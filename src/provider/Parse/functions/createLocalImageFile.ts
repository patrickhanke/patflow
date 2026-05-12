import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { Class } from '../hooks/types';

const createLocalImageFile = async ({
  results,
  data
}: {
  results: Parse.Object[];
  data: Class[];
}) => {
  const imagesDir = `${RNFS.DocumentDirectoryPath}/images`;
  const filePrefix = Platform.OS === 'android' ? 'file://' : '';
  await RNFS.mkdir(imagesDir);
  await Promise.all(
    results.map(async (obj: Parse.Object, index: number) => {
      const file = obj.get('file');
      const objectId = obj.id;
      if (!file || !objectId) return;
      const url = typeof file.url === 'function' ? file.url() : file?.url;
      if (!url) return;
      const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
      const localPath = `${imagesDir}/${objectId}.${ext}`;
      try {
        const exists = await RNFS!.exists(localPath);
        if (!exists) {
          await RNFS!.downloadFile({
            fromUrl: url,
            toFile: localPath
          }).promise;
        }
        const localUrl = `${filePrefix}${localPath}`;
        obj.set('local_url', localUrl);
        (data[index] as Record<string, unknown>).local_url = localUrl;
      } catch (err) {
        console.warn(
          `[useFindData] Failed to save image locally: ${objectId}`,
          err
        );
      }
    })
  );
};

export default createLocalImageFile;
