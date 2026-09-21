import { useCallback, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { AppContext, useParse } from '@provider';
import { saveObjectToLocalStorage } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import {
  attachImagesToParents,
  ensureParentsExist
} from '../functions/mergeImagesIntoParent';

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
  const { projectId } = useContext(AppContext);
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
      console.log('createImageObject', file, title);
      console.log('isReady', isReady);
      if (!isReady) return null;

      try {
        const ImageClass = Parse.Object.extend('Image');
        const imageObject = new ImageClass();

        imageObject.set('title', title);
        imageObject.set('label', title);
        imageObject.set('date', new Date().toISOString());
        imageObject.set('description', '');
        if (projectId) {
          const ProjectClass = Parse.Object.extend('Project');
          imageObject.set('project', ProjectClass.createWithoutData(projectId));
        }
        imageObject.set('file', file);

        await imageObject.save();

        return imageObject;
      } catch (err) {
        console.error('Error creating image object:', err);
        throw err;
      }
    },
    [Parse, isReady, projectId]
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

      try {
        if (isConnected) {
          await ensureParentsExist({
            Parse,
            taskId,
            ticketId,
            propertyId
          });

          for (const asset of assets) {
            console.log('Uploading image:', asset.fileName);
            try {
              const imageTitle = title || asset.fileName || 'Untitled';
              const result = await createFileFromAsset(asset);
              console.log({ result });
              if (!result.success || !result.file) continue;

              const imageObject = await createImageObject(
                result.file,
                imageTitle
              );
              console.log('imageObject', imageObject);
              if (imageObject?.id) {
                imageIds.push(imageObject.id);
              }
            } catch (uploadError) {
              console.error('Error uploading single image:', uploadError);
            }
          }

          console.log('imageIds', imageIds);
          if (imageIds.length > 0) {
            await attachImagesToParents({
              Parse,
              imageIds,
              taskId,
              ticketId,
              propertyId
            });
          }
        } else {
          for (const asset of assets) {
            console.log('Saving image locally:', asset.fileName);
            try {
              if (!asset.uri) {
                console.error('Asset has no URI for local save');
                continue;
              }

              const imageTitle = title || asset.fileName || 'Untitled';
              const ext = asset.type?.split('/')[1] || 'jpg';
              const tempId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
              const imagesDir = `${RNFS.DocumentDirectoryPath}/images`;
              const localPath = `${imagesDir}/${tempId}.${ext}`;
              const filePrefix = Platform.OS === 'android' ? 'file://' : '';
              const localUrl = `${filePrefix}${localPath}`;

              await RNFS.mkdir(imagesDir);

              if (asset.uri.startsWith('file://')) {
                await RNFS.copyFile(
                  asset.uri.replace('file://', ''),
                  localPath
                );
              } else {
                await ReactNativeBlobUtil.config({ path: localPath }).fetch(
                  'GET',
                  asset.uri
                );
              }

              const key = uuidv4();
              const localImageObject = {
                title: imageTitle,
                label: imageTitle,
                taskId,
                ticketId,
                propertyId,
                projectId,
                localUrl,
                type: 'image'
              };
              console.log('file saved to', localImageObject);

              await saveObjectToLocalStorage({
                object: localImageObject,
                key
              });

              imageIds.push(key);
            } catch (uploadError) {
              console.error('Error saving single image locally:', uploadError);
            }
          }
        }

        setLoading(false);
        return { success: imageIds.length > 0, imageIds };
      } catch (saveError) {
        const message =
          saveError instanceof Error
            ? saveError.message
            : 'Error saving images';
        console.error('Error saving images:', saveError);
        setError(message);
        setLoading(false);
        return { success: false, imageIds, error: message };
      }
    },
    [
      Parse,
      isReady,
      isConnected,
      projectId,
      createFileFromAsset,
      createImageObject
    ]
  );

  return {
    saveImages,
    loading,
    error
  };
};

export default useSaveImages;
