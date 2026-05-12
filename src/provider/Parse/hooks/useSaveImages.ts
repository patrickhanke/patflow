import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { useParse } from '@provider';
import { saveObjectToLocalStorage } from '../utils';
import { v4 as uuidv4 } from 'uuid';

type SaveImageParams = {
  assets: Asset[];
  title?: string;
  taskId?: string;
  ticketId?: string;
  propertyId?: string;
};

type SaveImageResult = {
  success: boolean;
  imageIds: string[];
  error?: string;
};

/**
 * Hook for saving images to Parse server with offline support
 * Uses URI-based file upload (not base64) for better performance
 */
const useSaveImages = ({ isConnected }: { isConnected: boolean }) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * Create a Parse File from an Asset (using base64 data)
   */
  const createFileFromAsset = useCallback(
    async (
      asset: Asset
    ): Promise<{
      success: boolean;
      file: Parse.File | null;
      error?: string;
    }> => {
      if (!asset.base64 && !asset.uri) {
        console.error('Asset has no base64 data or URI');
        return {
          success: false,
          file: null,
          error: 'Asset has no base64 data or URI'
        };
      }

      try {
        const fileName =
          asset.fileName ||
          `image_${Date.now()}.${asset.type?.split('/')[1] || 'jpg'}`;
        const contentType = asset.type || 'image/jpeg';

        let file: Parse.File;

        if (asset.base64) {
          file = new Parse.File(
            fileName,
            { base64: asset.base64 },
            contentType
          );
        } else if (asset.uri) {
          file = new Parse.File(fileName, { uri: asset.uri }, contentType);
        } else if (asset.uri) {
          // Fallback to URI (may not work on all platforms)
          console.warn('No base64 data available, falling back to URI upload');
          file = new Parse.File(fileName, { uri: asset.uri }, contentType);
        } else if (asset.uri) {
          // Fallback to URI (may not work on all platforms)
          console.warn('No base64 data available, falling back to URI upload');
          file = new Parse.File(fileName, { uri: asset.uri }, contentType);
        } else if (asset.uri) {
          // Fallback to URI (may not work on all platforms)
          console.warn('No base64 data available, falling back to URI upload');
          file = new Parse.File(fileName, { uri: asset.uri }, contentType);
        } else if (asset.uri) {
          // Fallback to URI (may not work on all platforms)
          console.warn('No base64 data available, falling back to URI upload');
          file = new Parse.File(fileName, { uri: asset.uri }, contentType);
        } else {
          console.error('No valid data source for file');
          return {
            success: false,
            file: null,
            error: 'No valid data source for file'
          };
        }

        await file.save();
        console.log('File saved to Parse:', file.url());

        return {
          success: true,
          file
        };
      } catch (err) {
        console.error('Error creating file from asset:', err);
        return { success: false, file: null, error: err as string };
      }
    },
    [Parse]
  );

  /**
   * Create an Image object in Parse with the saved file
   */
  const createImageObject = useCallback(
    async (file: Parse.File, title: string): Promise<Parse.Object | null> => {
      if (!isReady) return null;

      try {
        const ImageClass = Parse.Object.extend('Image');
        const imageObject = new ImageClass();

        imageObject.set('title', title);
        imageObject.set('file', file);

        await imageObject.save();

        return imageObject;
      } catch (err) {
        console.error('Error creating image object:', err);
        throw err;
      }
    },
    [Parse, isReady]
  );

  const addImagesToParent = useCallback(
    async (
      imageIds: string[],
      taskId?: string,
      ticketId?: string
    ): Promise<boolean> => {
      if (!isReady || imageIds.length === 0) return false;

      try {
        if (taskId) {
          const TaskClass = Parse.Object.extend('Task');
          const query = new Parse.Query(TaskClass);
          const task = await query.get(taskId);

          const currentImages = task.get('images') || [];
          const updatedImages = [...currentImages, ...imageIds];
          task.set('images', updatedImages);

          await task.save();
        }

        if (ticketId) {
          const TicketClass = Parse.Object.extend('Ticket');
          const query = new Parse.Query(TicketClass);
          const ticket = await query.get(ticketId);

          const currentImages = ticket.get('images') || [];
          const updatedImages = [...currentImages, ...imageIds];
          ticket.set('images', updatedImages);

          await ticket.save();
        }

        return true;
      } catch (err) {
        console.error('Error adding images to parent:', err);
        return false;
      }
    },
    [Parse, isReady]
  );

  const saveImages = useCallback(
    async ({
      assets,
      title,
      taskId,
      ticketId,
      propertyId
    }: SaveImageParams): Promise<SaveImageResult> => {
      if (!isReady) {
        return { success: false, imageIds: [], error: 'Parse not ready' };
      }

      if (!assets || assets.length === 0) {
        return { success: false, imageIds: [], error: 'No images provided' };
      }

      const imageIds: string[] = [];

      setLoading(true);
      setError(null);

      for (const asset of assets) {
        console.log('Uploading image:', asset.fileName);
        try {
          const imageTitle = title || asset.fileName || 'Untitled';
          const ImageClass = Parse.Object.extend('Image');
          const imageObject = new ImageClass();

          imageObject.set('title', imageTitle);
          if (taskId) {
            imageObject.set('task', taskId);
          }
          if (ticketId) {
            imageObject.set('ticket', ticketId);
          }
          if (propertyId) {
            imageObject.set('property', propertyId);
          }

          if (isConnected) {
            // Create Parse File from asset URI and upload
            const result = await createFileFromAsset(asset);
            console.log({ result });
            if (!result.success) continue;

            imageObject.set('file', result.file);
            await imageObject.saveEventually();
            imageIds.push(imageObject.id);
          } else {
            // Offline: save asset locally and add as local_url
            if (!asset.uri) {
              console.error('Asset has no URI for local save');
              continue;
            }

            const ext = asset.type?.split('/')[1] || 'jpg';
            const tempId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const imagesDir = `${RNFS.DocumentDirectoryPath}/images`;
            const localPath = `${imagesDir}/${tempId}.${ext}`;
            const filePrefix = Platform.OS === 'android' ? 'file://' : '';
            const localUrl = `${filePrefix}${localPath}`;

            await RNFS.mkdir(imagesDir);

            if (asset.uri.startsWith('file://')) {
              await RNFS.copyFile(asset.uri.replace('file://', ''), localPath);
            } else {
              await ReactNativeBlobUtil.config({ path: localPath }).fetch(
                'GET',
                asset.uri
              );
            }
            imageObject.set('local_url', localUrl);
            const localImageObject = {
              title: imageTitle,
              taskId: taskId,
              ticketId: ticketId,
              propertyId: propertyId,
              localUrl: localUrl,
              type: 'image'
            };
            console.log('file saved to', localImageObject);

            await saveObjectToLocalStorage({
              object: localImageObject,
              key: uuidv4()
            });

            imageIds.push(imageObject.id);
          }
        } catch (uploadError) {
          console.error('Error uploading single image:', uploadError);
          // Continue with other images even if one fails
        }
      }

      setLoading(false);
      return { success: imageIds.length > 0, imageIds };
    },
    [
      Parse,
      isReady,
      isConnected,
      createFileFromAsset,
      createImageObject,
      addImagesToParent
    ]
  );

  /**
   * Sync pending uploads when coming back online
   */

  return {
    saveImages,
    loading,
    error
  };
};

export default useSaveImages;
