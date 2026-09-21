import {
  getObjectFromLocalStorage,
  removeKeyFromPendingUploadKeys,
  removeObjectFromLocalStorage,
  saveObjectToLocalStorage
} from '../utils';
import RNFS from 'react-native-fs';
import { SavePendingUploads } from './types';
import {
  attachImagesToParents,
  resolveParentId
} from './mergeImagesIntoParent';

type PendingEntry = {
  key: string;
  objectToUpload: Record<string, unknown>;
};

const getStringField = (
  objectToUpload: Record<string, unknown>,
  ...keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = objectToUpload[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

const uploadPendingTicket = async ({
  Parse,
  objectToUpload,
  projectId,
  key
}: {
  Parse: Parse;
  objectToUpload: Record<string, unknown>;
  projectId: string;
  key: string;
}): Promise<string> => {
  const propertyId = getStringField(objectToUpload, 'propertyId', 'property');
  const createdBy = getStringField(objectToUpload, 'created_by');

  const propertyClass = new Parse.Object('Property');
  if (propertyId) {
    propertyClass.set('objectId', propertyId);
  }

  const projectClass = new Parse.Object('Project');
  projectClass.set('objectId', projectId);

  const userClass = new Parse.Object('_User');
  if (createdBy) {
    userClass.set('objectId', createdBy);
  }

  const ticketObject = new Parse.Object('Ticket');
  ticketObject.set('title', objectToUpload.title);
  ticketObject.set('description', objectToUpload.description);
  ticketObject.set('created_by', userClass);
  ticketObject.set('property', propertyClass);
  ticketObject.set('task', null);
  ticketObject.set('images', []);
  ticketObject.set('state', objectToUpload.state ?? 'open');
  ticketObject.set('comments', []);
  ticketObject.set('project', projectClass);
  ticketObject.set('key', key);

  await ticketObject.save();
  await ticketObject.pinWithName('tickets');
  console.log(`[savePendingUploads] Ticket saved: ${ticketObject.id}`);
  return ticketObject.id;
};

const lookupTicketIdByLocalKey = async ({
  Parse,
  localKey,
  localIdToServerId
}: {
  Parse: Parse;
  localKey: string;
  localIdToServerId: Map<string, string>;
}): Promise<string | undefined> => {
  const mapped = localIdToServerId.get(localKey);
  if (mapped) {
    return mapped;
  }

  const query = new Parse.Query('Ticket');
  query.equalTo('key', localKey);
  const existing = await query.first();
  if (existing?.id) {
    localIdToServerId.set(localKey, existing.id);
    return existing.id;
  }

  return undefined;
};

const uploadPendingImage = async ({
  Parse,
  objectToUpload,
  projectId
}: {
  Parse: Parse;
  objectToUpload: Record<string, unknown>;
  projectId: string;
}): Promise<string> => {
  const imageObject = new Parse.Object('Image');
  const localUrl = objectToUpload.localUrl as string;

  const filePath = localUrl.replace(/^file:\/\//, '');
  const base64 = await RNFS.readFile(filePath, 'base64');
  const ext = filePath.split('.').pop()?.split('?')[0] || 'jpg';
  const fileName = `image_${Date.now()}.${ext}`;
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  const parseFile = new Parse.File(fileName, { base64 }, contentType);
  await parseFile.save();

  imageObject.set('file', parseFile);
  imageObject.set('title', objectToUpload.title);
  imageObject.set('label', objectToUpload.title || objectToUpload.label);
  imageObject.set('date', new Date().toISOString());
  imageObject.set('description', '');
  if (projectId) {
    const ProjectClass = Parse.Object.extend('Project');
    imageObject.set('project', ProjectClass.createWithoutData(projectId));
  }
  await imageObject.save();
  await imageObject.pinWithName('images');
  console.log(`[savePendingUploads] Image saved: ${imageObject.id}`);
  return imageObject.id;
};

const savePendingUploads: SavePendingUploads = async ({
  pendingUploads,
  Parse,
  projectId
}) => {
  if (pendingUploads.length === 0) {
    return;
  }

  const entries: PendingEntry[] = [];
  for (const key of pendingUploads) {
    const objectToUpload = await getObjectFromLocalStorage(key);
    if (!objectToUpload) {
      console.error(`[savePendingUploads] Object not found: ${key}`);
      await removeKeyFromPendingUploadKeys(key);
      continue;
    }
    entries.push({ key, objectToUpload });
  }

  const parents = entries.filter(
    entry => entry.objectToUpload.type === 'ticket'
  );
  const images = entries.filter(
    entry => entry.objectToUpload.type === 'image'
  );
  const unknown = entries.filter(
    entry =>
      entry.objectToUpload.type !== 'ticket' &&
      entry.objectToUpload.type !== 'image'
  );

  for (const { key, objectToUpload } of unknown) {
    console.error(
      `[savePendingUploads] Unknown pending type: ${String(objectToUpload.type)}`
    );
    await removeKeyFromPendingUploadKeys(key);
  }

  const localIdToServerId = new Map<string, string>();
  const failedParentKeys = new Set<string>();

  for (const { key, objectToUpload } of parents) {
    try {
      const serverId = await uploadPendingTicket({
        Parse,
        objectToUpload,
        projectId,
        key
      });
      localIdToServerId.set(key, serverId);
      await removeKeyFromPendingUploadKeys(key);
      await removeObjectFromLocalStorage(key);
    } catch (error) {
      console.error(`[savePendingUploads] Ticket failed: ${key}`, error);
      failedParentKeys.add(key);
    }
  }

  const parentJobKey = ({
    taskId,
    ticketId,
    propertyId
  }: {
    taskId?: string;
    ticketId?: string;
    propertyId?: string;
  }) =>
    [
      taskId ? `Task:${taskId}` : '',
      ticketId ? `Ticket:${ticketId}` : '',
      propertyId ? `Property:${propertyId}` : ''
    ].join('|');

  const uploadedImages: Array<{
    key: string;
    imageId: string;
    taskId?: string;
    ticketId?: string;
    propertyId?: string;
  }> = [];

  for (const { key, objectToUpload } of images) {
    const ticketId = getStringField(objectToUpload, 'ticketId');
    const taskId = getStringField(objectToUpload, 'taskId');
    const propertyId = getStringField(objectToUpload, 'propertyId');

    if (ticketId && failedParentKeys.has(ticketId)) {
      continue;
    }

    let resolvedTicketId = resolveParentId(ticketId, localIdToServerId);
    if (ticketId && ticketId.includes('-') && resolvedTicketId === ticketId) {
      resolvedTicketId = await lookupTicketIdByLocalKey({
        Parse,
        localKey: ticketId,
        localIdToServerId
      });
      if (!resolvedTicketId) {
        continue;
      }
    }

    try {
      let imageId = getStringField(objectToUpload, 'serverImageId');
      if (!imageId) {
        imageId = await uploadPendingImage({
          Parse,
          objectToUpload,
          projectId
        });
        await saveObjectToLocalStorage({
          object: { ...objectToUpload, serverImageId: imageId },
          key
        });
      }

      uploadedImages.push({
        key,
        imageId,
        taskId: resolveParentId(taskId, localIdToServerId),
        ticketId: resolvedTicketId,
        propertyId: resolveParentId(propertyId, localIdToServerId)
      });
    } catch (error) {
      console.error(`[savePendingUploads] Image failed: ${key}`, error);
    }
  }

  const failedMerges = new Set<string>();
  const mergeJobs = new Map<
    string,
    {
      taskId?: string;
      ticketId?: string;
      propertyId?: string;
      imageIds: string[];
    }
  >();

  for (const image of uploadedImages) {
    const jobKey = parentJobKey(image);
    const existing = mergeJobs.get(jobKey) ?? {
      taskId: image.taskId,
      ticketId: image.ticketId,
      propertyId: image.propertyId,
      imageIds: []
    };
    if (!existing.imageIds.includes(image.imageId)) {
      existing.imageIds.push(image.imageId);
    }
    mergeJobs.set(jobKey, existing);
  }

  for (const [jobKey, job] of mergeJobs) {
    try {
      await attachImagesToParents({
        Parse,
        imageIds: job.imageIds,
        taskId: job.taskId,
        ticketId: job.ticketId,
        propertyId: job.propertyId
      });
    } catch (error) {
      console.error(
        `[savePendingUploads] Parent image merge failed: ${jobKey}`,
        error
      );
      failedMerges.add(jobKey);
    }
  }

  for (const image of uploadedImages) {
    if (failedMerges.has(parentJobKey(image))) {
      continue;
    }

    await removeKeyFromPendingUploadKeys(image.key);
    await removeObjectFromLocalStorage(image.key);
  }
};

export default savePendingUploads;
