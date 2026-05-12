import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_DATA_PREFIX = 'offline_data';
const OFFLINE_KEYS_KEY = 'offline_data_keys';

const saveObjectToLocalStorage = async ({
  object,
  key
}: {
  object: Record<string, unknown>;
  key: string;
}) => {
  const storageKey = `${OFFLINE_DATA_PREFIX}_${key}`;
  await AsyncStorage.setItem(storageKey, JSON.stringify(object));

  const keysJson = await AsyncStorage.getItem(OFFLINE_KEYS_KEY);
  const keys: string[] = keysJson ? JSON.parse(keysJson) : [];
  if (!keys.includes(key)) {
    keys.push(key);
    await AsyncStorage.setItem(OFFLINE_KEYS_KEY, JSON.stringify(keys));
  }
  console.log('keys', keys);
  console.log(
    'Object saved to local storage:',
    JSON.stringify({ object, key }, null, 2)
  );
};

export const getObjectFromLocalStorage = async (key: string) => {
  const storageKey = `${OFFLINE_DATA_PREFIX}_${key}`;
  const value = await AsyncStorage.getItem(storageKey);
  return value ? (JSON.parse(value) as Record<string, unknown>) : null;
};

export const getPendingUploadKeys = async (): Promise<string[]> => {
  const keysJson = await AsyncStorage.getItem(OFFLINE_KEYS_KEY);
  return keysJson ? JSON.parse(keysJson) : [];
};

export const removeObjectFromLocalStorage = async (key: string) => {
  const storageKey = `${OFFLINE_DATA_PREFIX}_${key}`;
  await AsyncStorage.removeItem(storageKey);

  const keysJson = await AsyncStorage.getItem(OFFLINE_KEYS_KEY);
  const keys: string[] = keysJson ? JSON.parse(keysJson) : [];
  const filtered = keys.filter(k => k !== key);
  await AsyncStorage.setItem(OFFLINE_KEYS_KEY, JSON.stringify(filtered));
};

export const removeKeyFromPendingUploadKeys = async (key: string) => {
  const keysJson = await AsyncStorage.getItem(OFFLINE_KEYS_KEY);
  const keys: string[] = keysJson ? JSON.parse(keysJson) : [];
  const filtered = keys.filter(k => k !== key);
  await AsyncStorage.setItem(OFFLINE_KEYS_KEY, JSON.stringify(filtered));
};

export { saveObjectToLocalStorage };
