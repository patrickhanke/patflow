import { AppContext, useParse } from '@provider';
import { useCallback, useContext, useMemo, useState } from 'react';
import useDataStore from './useDataStore';
import { Class, QueryRestriction, UseFindDataParams } from './types';
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

const useFindData = () => {
  const { isConnected, projectId } = useContext(AppContext);
  const { Parse, isReady } = useParse();
  const { setData } = useDataStore();
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [ticketsLoading, setTicketsLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [propertiesLoading, setPropertiesLoading] = useState<boolean>(false);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);
  const [absencesLoading, setAbsencesLoading] = useState<boolean>(false);

  const loadImages = useCallback(
    async (imageIds: string[]): Promise<Image[]> => {
      if (imagesLoading) {
        return [];
      }
      setImagesLoading(true);

      const imageIdArray = imageIds.filter(
        id => typeof id === 'string' && id.length === 10
      );
      const images = await loadData<Image>({
        className: 'Image',
        entry: 'images',
        properties: ['objectId', 'name', 'file', 'created_by'],
        restrictions: [
          { key: 'objectId', value: imageIdArray, operator: 'containedIn' }
        ],
        saveLocally: true
      });
      setImagesLoading(false);
      return images;
    },
    [imagesLoading]
  );

  const loadData = useCallback(
    async <T extends Class>({
      className,
      entry,
      restrictions = [],
      properties,
      limit = 500,
      sortBy = 'createdAt',
      sortOrder = 'descending'
    }: UseFindDataParams): Promise<T[]> => {
      if (!isReady) {
        return [];
      }

      const pendingUploads = await getPendingUploadKeys();
      console.log('pendingUploads', JSON.stringify(pendingUploads, null, 2));

      if (!isConnected) {
        console.log(
          `[useFindData] Offline: returning cached data from Zustand for ${className}`
        );
        return [];
      }

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

        if (className === 'Image' && RNFS) {
          await createLocalImageFile({ results, data });
        }

        if (entry) {
          console.log(
            `[useFindData] Setting ${data.length} ${className} to Zustand store for ${entry}`
          );
          setData(data, entry);
        }

        if (results.length > 0 && properties?.includes('images')) {
          const imageIds = results.flatMap(r => r.get('images') ?? []);
          if (imageIds.length > 0) {
            await loadImages(imageIds as string[]);
          }
        }

        return data;
      } catch (error) {
        console.error(
          `[useFindData] Error loading ${className} from server:`,
          error
        );
        return [];
      }
    },
    [Parse, isReady, isConnected, setData, loadImages]
  );

  const handlePendingUploads = useCallback(async () => {
    const pendingUploads = await getPendingUploadKeys();
    if (projectId && pendingUploads && pendingUploads.length > 0) {
      await savePendingUploads({ pendingUploads, Parse, projectId });
    }
  }, [Parse, projectId]);

  const loadTickets = useCallback(
    async ({ userId }: { userId: string }): Promise<Ticket[]> => {
      if (ticketsLoading) {
        return [];
      }
      setTicketsLoading(true);

      const UserClass = Parse.Object.extend('User');
      const tickets = await loadData<Ticket>({
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
      });
      setTicketsLoading(false);
      return tickets;
    },
    [loadData, ticketsLoading]
  );

  const loadUsers = useCallback(async (): Promise<User[]> => {
    if (usersLoading) {
      return [];
    }
    setUsersLoading(true);

    const users = await loadData<User>({
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
      saveLocally: true
    });

    setUsersLoading(false);
    return users;
  }, [loadData, usersLoading]);

  const loadProperties = useCallback(async (): Promise<Property[]> => {
    if (propertiesLoading) {
      return [];
    }
    setPropertiesLoading(true);

    const properties = await loadData<Property>({
      className: 'Property',
      entry: 'properties',
      properties: ['objectId', 'name', 'label', 'createdAt'],
      saveLocally: true
    });

    setPropertiesLoading(false);
    return properties;
  }, [loadData, propertiesLoading]);

  const loadTasks = useCallback(async (): Promise<Task[]> => {
    if (tasksLoading) {
      return [];
    }
    setTasksLoading(true);

    const tasks = await loadData<Task>({
      className: 'Task',
      entry: 'tasks',
      properties: [
        'objectId',
        'title',
        'description',
        'assigned_staff',
        'dates',
        'time',
        'state',
        'images',
        'comments',
        'documents',
        'type',
        'createdAt',
        'property',
        'ticket'
      ],
      restrictions: [
        {
          key: 'state',
          value: 'assigned',
          operator: 'equalTo'
        }
      ],
      saveLocally: true
    });

    setTasksLoading(false);
    return tasks;
  }, [loadData, tasksLoading]);

  const loadRecords = useCallback(
    async ({ userId }: { userId: string }): Promise<RecordType[]> => {
      if (recordsLoading) {
        return [];
      }
      setRecordsLoading(true);
      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(userId);
      const currentYear = new Date().getFullYear();
      const currentYearArray = [currentYear, currentYear - 1];
      const records = await loadData<RecordType>({
        className: 'Record',
        entry: 'records',
        properties: [
          'objectId',
          'createdAt',
          'user',
          'absence',
          'year',
          'default_times',
          'start_date',
          'end_date',
          'absence_days',
          'time_settings',
          'vacation',
          'saldo',
          'holiday_template'
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
      });
      setRecordsLoading(false);
      return records;
    },
    [loadData, recordsLoading]
  );

  const loadAbsences = useCallback(
    async ({ userId }: { userId: string }): Promise<Absence[]> => {
      if (absencesLoading) {
        return [];
      }
      setAbsencesLoading(true);
      const currentYear = new Date().getFullYear();
      const currentYearArray = [currentYear, currentYear - 1];

      const UserClass = Parse.Object.extend('_User');
      const absences = await loadData<Absence>({
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
      });

      setAbsencesLoading(false);
      return absences;
    },
    [loadData, absencesLoading]
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
      loadRecords,
      loadAbsences
    ]
  );
};

export default useFindData;
