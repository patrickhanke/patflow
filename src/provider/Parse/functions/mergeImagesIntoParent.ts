import Parse from 'parse/react-native';

type ParseSDK = typeof Parse;

type ParentClassName = 'Task' | 'Ticket' | 'Property';

type ParentIds = {
  taskId?: string;
  ticketId?: string;
  propertyId?: string;
};

const parentUpdateQueues = new Map<string, Promise<void>>();

export const uniqueImageIds = (values: unknown[]): string[] => {
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const value of values) {
    let id: string | undefined;
    if (typeof value === 'string') {
      id = value;
    } else if (value && typeof value === 'object') {
      const record = value as { id?: unknown; objectId?: unknown };
      if (typeof record.objectId === 'string') {
        id = record.objectId;
      } else if (typeof record.id === 'string') {
        id = record.id;
      }
    }

    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }

  return ids;
};

const enqueueParentUpdate = async (
  className: ParentClassName,
  objectId: string,
  task: () => Promise<void>
): Promise<void> => {
  const queueKey = `${className}:${objectId}`;
  const previous = parentUpdateQueues.get(queueKey) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(task);
  parentUpdateQueues.set(queueKey, next);

  try {
    await next;
  } finally {
    if (parentUpdateQueues.get(queueKey) === next) {
      parentUpdateQueues.delete(queueKey);
    }
  }
};

/**
 * Adds image IDs to a parent. Only additive: existing IDs are kept,
 * duplicates are skipped, and updates for the same parent are serialized
 * so concurrent saves cannot overwrite each other.
 */
export const mergeImagesIntoParent = async ({
  Parse: ParseSDK,
  className,
  objectId,
  imageIds
}: {
  Parse: ParseSDK;
  className: ParentClassName;
  objectId: string;
  imageIds: string[];
}): Promise<void> => {
  const idsToAdd = uniqueImageIds(imageIds);
  if (!objectId || idsToAdd.length === 0) {
    return;
  }

  console.log('idsToAdd', idsToAdd);

  await enqueueParentUpdate(className, objectId, async () => {
    const ParentClass = ParseSDK.Object.extend(className);
    const query = new ParseSDK.Query(ParentClass);
    const parent = await query.get(objectId);
    const currentIds = uniqueImageIds(parent.get('images') ?? []);
    const newIds = idsToAdd.filter(id => !currentIds.includes(id));

    console.log('newIds', newIds);

    if (newIds.length === 0) {
      return;
    }

    newIds.forEach(id => parent.addUnique('images', id));
    await parent.save();
  });
};

export const attachImagesToParents = async ({
  Parse: ParseSDK,
  imageIds,
  taskId,
  ticketId,
  propertyId
}: ParentIds & {
  Parse: ParseSDK;
  imageIds: string[];
}): Promise<void> => {
  const uniqueIds = uniqueImageIds(imageIds);
  if (uniqueIds.length === 0) {
    return;
  }

  if (taskId) {
    await mergeImagesIntoParent({
      Parse: ParseSDK,
      className: 'Task',
      objectId: taskId,
      imageIds: uniqueIds
    });
  }
  if (ticketId) {
    await mergeImagesIntoParent({
      Parse: ParseSDK,
      className: 'Ticket',
      objectId: ticketId,
      imageIds: uniqueIds
    });
  }
  if (propertyId) {
    await mergeImagesIntoParent({
      Parse: ParseSDK,
      className: 'Property',
      objectId: propertyId,
      imageIds: uniqueIds
    });
  }
};

export const ensureParentsExist = async ({
  Parse: ParseSDK,
  taskId,
  ticketId,
  propertyId
}: ParentIds & { Parse: ParseSDK }): Promise<void> => {
  const checks: Array<Promise<Parse.Object>> = [];

  if (taskId) {
    checks.push(new ParseSDK.Query(ParseSDK.Object.extend('Task')).get(taskId));
  }
  if (ticketId) {
    checks.push(
      new ParseSDK.Query(ParseSDK.Object.extend('Ticket')).get(ticketId)
    );
  }
  if (propertyId) {
    checks.push(
      new ParseSDK.Query(ParseSDK.Object.extend('Property')).get(propertyId)
    );
  }

  if (checks.length > 0) {
    await Promise.all(checks);
  }
};

export const resolveParentId = (
  localOrServerId: string | undefined,
  localIdToServerId: Map<string, string>
): string | undefined => {
  if (!localOrServerId) {
    return undefined;
  }
  return localIdToServerId.get(localOrServerId) ?? localOrServerId;
};
