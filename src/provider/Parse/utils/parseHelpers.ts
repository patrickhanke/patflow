/**
 * Parse Helper Utilities
 * Common utility functions for working with Parse objects
 */

import Parse from 'parse/react-native';

/**
 * Create a Parse Pointer object
 */
export const createPointer = (
  className: string,
  objectId: string
): { __type: 'Pointer'; className: string; objectId: string } => ({
  __type: 'Pointer',
  className,
  objectId
});

/**
 * Create a Parse User Pointer
 */
export const createUserPointer = (
  objectId: string
): { __type: 'Pointer'; className: string; objectId: string } =>
  createPointer('_User', objectId);

/**
 * Convert a Parse Object to a pointer
 */
export const toPointer = (
  parseObject: Parse.Object
): { __type: 'Pointer'; className: string; objectId: string } =>
  createPointer(parseObject.className, parseObject.id);

/**
 * Create a Parse GeoPoint
 */
export const createGeoPoint = (
  latitude: number,
  longitude: number
): Parse.GeoPoint => new Parse.GeoPoint(latitude, longitude);

/**
 * Create a Parse File from base64 data
 */
export const createFileFromBase64 = async (
  name: string,
  base64Data: string,
  contentType: string
): Promise<Parse.File> => {
  const file = new Parse.File(name, { base64: base64Data }, contentType);
  await file.save();
  return file;
};

/**
 * Create a Parse File from URI (React Native)
 */
export const createFileFromUri = async (
  name: string,
  uri: string,
  contentType: string
): Promise<Parse.File> => {
  const file = new Parse.File(name, { uri }, contentType);
  await file.save();
  return file;
};

/**
 * Create a Parse ACL with read/write for specific user
 */
export const createUserACL = (
  userId: string,
  options?: { publicRead?: boolean; publicWrite?: boolean }
): Parse.ACL => {
  const acl = new Parse.ACL();
  acl.setReadAccess(userId, true);
  acl.setWriteAccess(userId, true);

  if (options?.publicRead) {
    acl.setPublicReadAccess(true);
  }
  if (options?.publicWrite) {
    acl.setPublicWriteAccess(true);
  }

  return acl;
};

/**
 * Create a Parse Relation add operation
 */
export const addToRelation = <T extends Parse.Object>(
  objects: T[]
): Parse.Relation<Parse.Object, T> => {
  const relation = new (Parse.Relation as any)();
  objects.forEach(obj => relation.add(obj));
  return relation;
};

/**
 * Batch save multiple Parse objects
 */
export const batchSave = async (
  objects: Parse.Object[]
): Promise<Parse.Object[]> => {
  return Parse.Object.saveAll(objects);
};

/**
 * Batch delete multiple Parse objects
 */
export const batchDelete = async (objects: Parse.Object[]): Promise<void> => {
  await Parse.Object.destroyAll(objects);
};

/**
 * Execute a Parse Cloud Function
 */
export const runCloudFunction = async <T = any>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> => {
  return Parse.Cloud.run(functionName, params);
};

/**
 * Subscribe to a Parse LiveQuery
 */
export const subscribeToQuery = async <T extends Parse.Object>(
  query: Parse.Query<T>,
  callbacks: {
    onOpen?: () => void;
    onCreate?: (object: T) => void;
    onUpdate?: (object: T) => void;
    onDelete?: (object: T) => void;
    onEnter?: (object: T) => void;
    onLeave?: (object: T) => void;
    onClose?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<Parse.LiveQuerySubscription> => {
  const subscription = await query.subscribe();

  if (callbacks.onOpen) {
    subscription.on('open', callbacks.onOpen);
  }
  if (callbacks.onCreate) {
    subscription.on('create', callbacks.onCreate);
  }
  if (callbacks.onUpdate) {
    subscription.on('update', callbacks.onUpdate);
  }
  if (callbacks.onDelete) {
    subscription.on('delete', callbacks.onDelete);
  }
  if (callbacks.onEnter) {
    subscription.on('enter', callbacks.onEnter);
  }
  if (callbacks.onLeave) {
    subscription.on('leave', callbacks.onLeave);
  }
  if (callbacks.onClose) {
    subscription.on('close', callbacks.onClose);
  }
  if (callbacks.onError) {
    subscription.on('error', callbacks.onError);
  }

  return subscription;
};

/**
 * Unsubscribe from a Parse LiveQuery
 */
export const unsubscribeFromQuery = async (
  subscription: Parse.LiveQuerySubscription
): Promise<void> => {
  subscription.unsubscribe();
};

/**
 * Convert legacy REST API pointer format to Parse SDK format
 */
export const convertPointerFormat = (
  data: Record<string, any>
): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      '__type' in value &&
      value.__type === 'Pointer'
    ) {
      const PointerClass = Parse.Object.extend(value.className);
      result[key] = PointerClass.createWithoutData(value.objectId);
    } else {
      result[key] = value;
    }
  });

  return result;
};

/**
 * Format Parse error for display
 */
export const formatParseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};
