import { AppContext, useParse } from '@provider';
import { useCallback, useContext, useMemo, useRef } from 'react';
import useDataStore from './useDataStore';
import {
  Class,
  DataStoreEntry,
  QueryRestriction,
  UseFindDataParams
} from './types';
import {
  Absence,
  Image,
  Property,
  Record as RecordType,
  Task,
  Ticket,
  User
} from '@types';
import RNFS from 'react-native-fs';
import { getPendingUploadKeys } from '../utils';
import savePendingUploads from '../functions/savePendingUploads';
import createLocalImageFile from '../functions/createLocalImageFile';
import { normalizeTask, TASK_PROPERTIES } from './normalizeParseData';
import { PATFLOW_PROJECT_ID } from '@provider/constants/project';

function applyRestriction(
  query: Parse.Query,
  restriction: QueryRestriction,
  ParseInstance: {
    Object: {
      extend: (name: string) => { createWithoutData: (id: string) => unknown };
    };
  }
): void {
  const operator = restriction.operator ?? 'equalTo';
  let value = restriction.value;

  if (restriction.pointerClassName) {
    const PointerClass = ParseInstance.Object.extend(
      restriction.pointerClassName
    );
    value = PointerClass.createWithoutData(String(restriction.value));
  }

  switch (operator) {
    case 'equalTo':
      query.equalTo(restriction.key, value);
      break;
    case 'containedIn':
      query.containedIn(restriction.key, value as unknown[]);
      break;
    case 'notEqualTo':
      query.notEqualTo(restriction.key, value);
      break;
    case 'notContainedIn':
      query.notContainedIn(restriction.key, value as unknown[]);
      break;
    case 'lessThan':
      query.lessThan(restriction.key, value);
      break;
    case 'greaterThan':
      query.greaterThan(restriction.key, value);
      break;
    case 'lessThanOrEqualTo':
      query.lessThanOrEqualTo(restriction.key, value);
      break;
    case 'greaterThanOrEqualTo':
      query.greaterThanOrEqualTo(restriction.key, value);
      break;
    case 'exists':
      query.exists(restriction.key);
      break;
    case 'doesNotExist':
      query.doesNotExist(restriction.key);
      break;
    default:
      query.equalTo(restriction.key, value);
  }
}

type CoalesceSlot<T> = {
  promise: Promise<T>;
  queued: boolean;
  fn: () => Promise<T>;
};

const coalesceSlots = new Map<string, CoalesceSlot<unknown>>();
const fetchGeneration: Partial<Record<DataStoreEntry, number>> = {};

function coalesceFetch<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = coalesceSlots.get(key) as CoalesceSlot<T> | undefined;
  if (existing) {
    existing.queued = true;
    existing.fn = fn;
    console.log(`[useFindData] ${key} already in flight, queued latest fetch`);
    return existing.promise;
  }

  const slot: CoalesceSlot<T> = {
    queued: false,
    fn,
    promise: Promise.resolve() as Promise<T>
  };

  const pump = async (): Promise<T> => {
    const currentFn = slot.fn;
    try {
      const result = await currentFn();
      if (slot.queued) {
        slot.queued = false;
        return pump();
      }
      coalesceSlots.delete(key);
      return result;
    } catch (error) {
      if (slot.queued) {
        slot.queued = false;
        return pump();
      }
      coalesceSlots.delete(key);
      throw error;
    }
  };

  slot.promise = pump();
  coalesceSlots.set(key, slot as CoalesceSlot<unknown>);
  return slot.promise;
}

function getCachedEntry<T extends Class>(entry?: DataStoreEntry): T[] {
  if (!entry || entry === 'adminTasks') {
    return [];
  }
  return (useDataStore.getState()[entry] as T[] | undefined) ?? [];
}

const useFindData = () => {
  const { isConnected, projectId } = useContext(AppContext);
  const { Parse, isReady } = useParse();
  const loadImagesRef = useRef<(imageIds: string[]) => Promise<Image[]>>(
    async () => []
  );

  const loadData = useCallback(
    async <T extends Class>({
      className,
      entry,
      restrictions = [],
      properties,
      limit = 500,
      sortBy = 'createdAt',
      sortOrder = 'descending',
      saveLocally = true,
      forceNetwork = false
    }: UseFindDataParams): Promise<T[]> => {
      if (!isReady) {
        return getCachedEntry<T>(entry);
      }

      // const pendingUploads = await getPendingUploadKeys();

      if (!isConnected && !forceNetwork) {
        const cached = getCachedEntry<T>(entry);
        console.log(
          `[useFindData] Offline: returning ${cached.length} cached ${className} from Zustand`
        );
        return cached;
      }

      const generation = (fetchGeneration[entry] ?? 0) + 1;
      fetchGeneration[entry] = generation;

      try {
        const ParseClass = Parse.Object.extend(className);
        const query = new Parse.Query(ParseClass);

        for (const r of restrictions) {
          applyRestriction(query, r, Parse);
        }

        query[sortOrder === 'descending' ? 'descending' : 'ascending'](sortBy);
        query.limit(limit);

        const results = await query.find();
        console.log(
          `[useFindData] Loaded ${results.length} ${className} from server`
        );

        let data = results.map((obj: Parse.Object) => {
          const full = obj.toJSON() as Record<string, unknown>;
          if (properties && properties.length > 0) {
            const filtered = Object.fromEntries(
              Object.entries(full).filter(
                ([k]) =>
                  properties.includes(k) ||
                  (className === 'Image' && k === 'local_url')
              )
            ) as Record<string, unknown>;
            return filtered as unknown as T;
          }
          return full as unknown as T;
        });

        if (className === 'Task') {
          data = data.map(item =>
            normalizeTask(item as unknown as Record<string, unknown>)
          ) as T[];
        }

        if (className === 'Image' && RNFS) {
          await createLocalImageFile({ results, data });
        }

        if (fetchGeneration[entry] !== generation) {
          console.log(
            `[useFindData] Ignoring stale ${className} result (gen ${generation} vs ${fetchGeneration[entry]})`
          );
          return data;
        }

        if (entry && saveLocally) {
          console.log(
            `[useFindData] Setting ${data.length} ${className} to Zustand store for ${entry}`
          );
          useDataStore.getState().setData(data, entry);
        }

        if (results.length > 0 && properties?.includes('images')) {
          const imageIds = results.flatMap(r => r.get('images') ?? []);
          if (imageIds.length > 0) {
            await loadImagesRef.current(imageIds as string[]);
          }
        }

        return data;
      } catch (error) {
        console.error(
          `[useFindData] Error loading ${className} from server:`,
          error
        );
        return getCachedEntry<T>(entry);
      }
    },
    [Parse, isReady, isConnected]
  );

  const loadImages = useCallback(
    async (imageIds: string[]): Promise<Image[]> => {
      const imageIdArray = imageIds
        .map(id => {
          if (typeof id === 'string') {
            return id;
          }
          if (id && typeof id === 'object' && 'objectId' in id) {
            const objectId = (id as { objectId?: unknown }).objectId;
            return typeof objectId === 'string' ? objectId : null;
          }
          return null;
        })
        .filter((id): id is string => Boolean(id));
      if (imageIdArray.length === 0) {
        return [];
      }
      return coalesceFetch('images', () =>
        loadData<Image>({
          className: 'Image',
          entry: 'images',
          properties: [
            'objectId',
            'title',
            'label',
            'name',
            'file',
            'created_by'
          ],
          restrictions: [
            { key: 'objectId', value: imageIdArray, operator: 'containedIn' }
          ],
          saveLocally: true
        })
      );
    },
    [loadData]
  );
  loadImagesRef.current = loadImages;

  const handlePendingUploads = useCallback(async () => {
    const pendingUploads = await getPendingUploadKeys();
    if (projectId && pendingUploads && pendingUploads.length > 0) {
      await savePendingUploads({ pendingUploads, Parse, projectId });
    }
  }, [Parse, projectId]);

  const loadTickets = useCallback(
    async ({ userId }: { userId: string }): Promise<Ticket[]> => {
      const UserClass = Parse.Object.extend('User');
      return coalesceFetch(`tickets:${userId}`, () =>
        loadData<Ticket>({
          className: 'Ticket',
          entry: 'tickets',
          properties: [
            'objectId',
            'title',
            'description',
            'createdAt',
            'state',
            'property',
            'created_by',
            'task',
            'images'
          ],
          restrictions: [
            {
              key: 'created_by',
              value: UserClass.createWithoutData(userId),
              operator: 'equalTo'
            },
            {
              key: 'state',
              value: ['open', 'in_progress'],
              operator: 'containedIn'
            }
          ],
          saveLocally: true
        })
      );
    },
    [loadData, Parse]
  );

  const loadUsers = useCallback(async (): Promise<User[]> => {
    const effectiveProjectId = projectId || PATFLOW_PROJECT_ID;

    return coalesceFetch('users', () =>
      loadData<User>({
        className: 'User',
        entry: 'users',
        properties: [
          'objectId',
          'first_name',
          'last_name',
          'email',
          'createdAt',
          'color',
          'portrait'
        ],
        restrictions: [
          {
            key: 'project',
            value: effectiveProjectId,
            pointerClassName: 'Project'
          }
        ],
        saveLocally: true
      })
    );
  }, [loadData, projectId]);

  const loadProperties = useCallback(async (): Promise<Property[]> => {
    return coalesceFetch('properties', () =>
      loadData<Property>({
        className: 'Property',
        entry: 'properties',
        properties: ['objectId', 'name', 'label', 'createdAt'],
        saveLocally: true
      })
    );
  }, [loadData]);

  const loadTasks = useCallback(
    async (options?: { forceNetwork?: boolean }): Promise<Task[]> => {
      console.log('[loadTasks] Starting fetch...');
      return coalesceFetch('tasks', () =>
        loadData<Task>({
          className: 'Task',
          entry: 'tasks',
          properties: [...TASK_PROPERTIES],
          restrictions: [
            {
              key: 'state',
              value: 'assigned',
              operator: 'equalTo'
            }
          ],
          saveLocally: true,
          forceNetwork: options?.forceNetwork
        })
      );
    },
    [loadData]
  );

  const loadRecords = useCallback(
    async ({ userId }: { userId: string }): Promise<RecordType[]> => {
      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(userId);
      const currentYear = new Date().getFullYear();
      const currentYearArray = [currentYear, currentYear - 1];
      return coalesceFetch(`records:${userId}`, () =>
        loadData<RecordType>({
          className: 'Record',
          entry: 'records',
          properties: [
            'objectId',
            'createdAt',
            'user',
            'year',
            'default_times',
            'start_date',
            'end_date',
            'time_settings',
            'vacation',
            'saldo'
          ],
          restrictions: [
            {
              key: 'user',
              value: userPointer,
              operator: 'equalTo'
            },
            {
              key: 'year',
              value: currentYearArray,
              operator: 'containedIn'
            }
          ],
          saveLocally: true
        })
      );
    },
    [loadData, Parse]
  );

  const loadAbsences = useCallback(
    async ({ userId }: { userId: string }): Promise<Absence[]> => {
      const currentYear = new Date().getFullYear();
      const currentYearArray = [currentYear, currentYear - 1];

      const UserClass = Parse.Object.extend('_User');
      return coalesceFetch(`absences:${userId}`, () =>
        loadData<Absence>({
          className: 'Absence',
          entry: 'absences',
          properties: [
            'objectId',
            'start_date',
            'end_date',
            'comment',
            'state',
            'user',
            'type',
            'year'
          ],
          restrictions: [
            {
              key: 'user',
              value: UserClass.createWithoutData(userId),
              operator: 'equalTo'
            },
            {
              key: 'year',
              value: currentYearArray,
              operator: 'containedIn'
            }
          ],
          saveLocally: true
        })
      );
    },
    [loadData, Parse]
  );

  return useMemo(
    () => ({
      loadData,
      loadTickets,
      loadUsers,
      loadProperties,
      loadTasks,
      handlePendingUploads,
      loadRecords,
      loadAbsences
    }),
    [
      loadData,
      loadTickets,
      loadUsers,
      loadProperties,
      loadTasks,
      handlePendingUploads,
      loadRecords,
      loadAbsences
    ]
  );
};

export default useFindData;
