import {
  getObjectFromLocalStorage,
  removeKeyFromPendingUploadKeys,
  removeObjectFromLocalStorage
} from '../utils';
import RNFS from 'react-native-fs';
import { SavePendingUploads } from './types';

const savePendingUploads: SavePendingUploads = async ({
  pendingUploads,
  Parse,
  projectId
}) => {
  if (pendingUploads.length > 0) {
    for (const key of pendingUploads) {
      const objectToUpload = await getObjectFromLocalStorage(key);

      if (!objectToUpload) {
        console.error(`[useFindData] Object not found: ${key}`);
        await removeKeyFromPendingUploadKeys(key);
        continue;
      }

      if (objectToUpload.type === 'image') {
        const imageObject = new Parse.Object('Image');
        const localUrl = objectToUpload.localUrl as string;

        const filePath = localUrl.replace(/^file:\/\//, '');
        const base64 = await RNFS.readFile(filePath, 'base64');
        const ext = filePath.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `image_${Date.now()}.${ext}`;
        const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

        const parseFile = new Parse.File(fileName, { base64 }, contentType);
        await parseFile.save();

        // Modify the actual Parse Object
        imageObject.set('file', parseFile);
        imageObject.set('title', objectToUpload.title);
        imageObject.set('task', objectToUpload.taskId);
        imageObject.set('ticket', objectToUpload.ticketId);
        imageObject.set('property', objectToUpload.propertyId);
        await imageObject.save();
        await imageObject.pinWithName('images');
        await removeKeyFromPendingUploadKeys(key);
        await removeObjectFromLocalStorage(key);
        console.log(`[useFindData] Image saved: ${imageObject.id}`);
      } else {
        console.error(`[useFindData] Image not found: ${key}`);
        await removeKeyFromPendingUploadKeys(key);
      }

      if (objectToUpload.type === 'ticket') {
        const propertyClass = new Parse.Object('Property');
        propertyClass.set('objectId', objectToUpload.propertyId);

        const projectClass = new Parse.Object('Project');
        projectClass.set('objectId', projectId);

        const userClass = new Parse.Object('_User');
        userClass.set('objectId', objectToUpload.created_by);

        const ticketObject = new Parse.Object('Ticket');
        ticketObject.set('title', objectToUpload.title);
        ticketObject.set('description', objectToUpload.description);
        ticketObject.set('created_by', userClass);
        ticketObject.set('property', propertyClass);
        ticketObject.set('task', null);
        ticketObject.set('images', []);
        ticketObject.set('state', 'open');
        ticketObject.set('comments', []);
        ticketObject.set('project', projectClass);
        ticketObject.set('key', key);

        await ticketObject.save();
        await ticketObject.pinWithName('tickets');
        await removeKeyFromPendingUploadKeys(key);
        await removeObjectFromLocalStorage(key);
        console.log(`[useFindData] Ticket saved: ${ticketObject.id}`);
      }
    }
  }
};

export default savePendingUploads;
