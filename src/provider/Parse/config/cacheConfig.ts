/**
 * Cache Configuration
 * Controls how much data is cached locally in the SQLite database
 */

export interface CacheConfig {
  // Maximum number of items to cache per collection
  maxTasksToCache: number;
  maxImagesToCache: number;
  maxUsersToCache: number;
  maxTicketsToCache: number;
  maxPropertiesToCache: number;

  // Enable/disable caching per collection
  enableTaskCaching: boolean;
  enableImageCaching: boolean;
  enableUserCaching: boolean;
  enableTicketCaching: boolean;
  enablePropertyCaching: boolean;

  // Global cache settings
  enableCaching: boolean;
  maxTotalCachedObjects: number;

  // Cache only recent items (days)
  cacheOnlyRecentDays: number | null;

  // EXPERIMENTAL: Disable all local datastore operations
  // Set to true to completely bypass local caching for debugging
  disableLocalDatastore: boolean;
}

/**
 * Default cache configuration
 * Optimized to prevent SQLITE_FULL errors
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  // Reduced from 500 to prevent database overflow
  maxTasksToCache: 100,
  maxImagesToCache: 50, // Images can be large with metadata
  maxUsersToCache: 100,
  maxTicketsToCache: 100,
  maxPropertiesToCache: 50,

  // All caching enabled by default
  enableTaskCaching: true,
  enableImageCaching: true,
  enableUserCaching: true,
  enableTicketCaching: true,
  enablePropertyCaching: true,

  // Global settings
  enableCaching: true,
  maxTotalCachedObjects: 400, // Safety limit across all collections

  // Cache only items from last 30 days (null = cache all)
  cacheOnlyRecentDays: 30,

  // Set to true to completely disable local datastore (for debugging)
  disableLocalDatastore: false
};

/**
 * Aggressive cache config for limited storage devices
 */
export const MINIMAL_CACHE_CONFIG: CacheConfig = {
  maxTasksToCache: 50,
  maxImagesToCache: 20,
  maxUsersToCache: 50,
  maxTicketsToCache: 50,
  maxPropertiesToCache: 25,

  enableTaskCaching: true,
  enableImageCaching: false, // Disable image caching
  enableUserCaching: true,
  enableTicketCaching: true,
  enablePropertyCaching: true,

  enableCaching: true,
  maxTotalCachedObjects: 200,
  cacheOnlyRecentDays: 14,
  disableLocalDatastore: false
};

/**
 * No caching config - for debugging SQLITE issues
 */
export const NO_CACHE_CONFIG: CacheConfig = {
  maxTasksToCache: 0,
  maxImagesToCache: 0,
  maxUsersToCache: 0,
  maxTicketsToCache: 0,
  maxPropertiesToCache: 0,

  enableTaskCaching: false,
  enableImageCaching: false,
  enableUserCaching: false,
  enableTicketCaching: false,
  enablePropertyCaching: false,

  enableCaching: false,
  maxTotalCachedObjects: 0,
  cacheOnlyRecentDays: null,
  disableLocalDatastore: true
};

/**
 * Full cache config for devices with plenty of storage
 */
export const FULL_CACHE_CONFIG: CacheConfig = {
  maxTasksToCache: 200,
  maxImagesToCache: 100,
  maxUsersToCache: 200,
  maxTicketsToCache: 200,
  maxPropertiesToCache: 100,

  enableTaskCaching: true,
  enableImageCaching: true,
  enableUserCaching: true,
  enableTicketCaching: true,
  enablePropertyCaching: true,

  enableCaching: true,
  maxTotalCachedObjects: 800,
  cacheOnlyRecentDays: null, // Cache everything
  disableLocalDatastore: false
};

// Current active configuration
let currentConfig: CacheConfig = { ...DEFAULT_CACHE_CONFIG };

/**
 * Get current cache configuration
 */
export const getCacheConfig = (): CacheConfig => {
  return { ...currentConfig };
};

/**
 * Update cache configuration
 */
export const setCacheConfig = (config: Partial<CacheConfig>): void => {
  currentConfig = { ...currentConfig, ...config };
  console.log('Cache configuration updated:', currentConfig);
};

/**
 * Reset to default configuration
 */
export const resetCacheConfig = (): void => {
  currentConfig = { ...DEFAULT_CACHE_CONFIG };
  console.log('Cache configuration reset to defaults');
};

/**
 * Apply preset configuration
 */
export const applyCachePreset = (
  preset: 'default' | 'minimal' | 'full'
): void => {
  switch (preset) {
    case 'minimal':
      currentConfig = { ...MINIMAL_CACHE_CONFIG };
      break;
    case 'full':
      currentConfig = { ...FULL_CACHE_CONFIG };
      break;
    case 'default':
    default:
      currentConfig = { ...DEFAULT_CACHE_CONFIG };
      break;
  }
  console.log(`Cache preset '${preset}' applied:`, currentConfig);
};

/**
 * Check if caching is enabled for a specific collection
 */
export const isCachingEnabled = (
  collection: 'tasks' | 'images' | 'users' | 'tickets' | 'properties'
): boolean => {
  // If local datastore is completely disabled, return false
  if (currentConfig.disableLocalDatastore) return false;

  if (!currentConfig.enableCaching) return false;

  switch (collection) {
    case 'tasks':
      return currentConfig.enableTaskCaching;
    case 'images':
      return currentConfig.enableImageCaching;
    case 'users':
      return currentConfig.enableUserCaching;
    case 'tickets':
      return currentConfig.enableTicketCaching;
    case 'properties':
      return currentConfig.enablePropertyCaching;
    default:
      return false;
  }
};

/**
 * Check if local datastore is completely disabled
 */
export const isLocalDatastoreDisabled = (): boolean => {
  return currentConfig.disableLocalDatastore;
};

/**
 * Get max items to cache for a collection
 */
export const getMaxItemsToCache = (
  collection: 'tasks' | 'images' | 'users' | 'tickets' | 'properties'
): number => {
  switch (collection) {
    case 'tasks':
      return currentConfig.maxTasksToCache;
    case 'images':
      return currentConfig.maxImagesToCache;
    case 'users':
      return currentConfig.maxUsersToCache;
    case 'tickets':
      return currentConfig.maxTicketsToCache;
    case 'properties':
      return currentConfig.maxPropertiesToCache;
    default:
      return 0;
  }
};
