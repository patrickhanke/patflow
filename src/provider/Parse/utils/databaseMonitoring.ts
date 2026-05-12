/**
 * Database Monitoring Utilities
 * Provides information about SQLite database size and storage usage
 *
 * NOTE: File system size calculations require 'react-native-fs' package.
 * Install with: npm install react-native-fs
 * Without it, only object counts will be available.
 */

import Parse from 'parse/react-native';
import { Platform } from 'react-native';

// Optional import - will be undefined if package is not installed
let RNFS: any;
try {
  RNFS = require('react-native-fs');
} catch (e) {
  console.log(
    'react-native-fs not available. File size calculations will be unavailable.',
    e
  );
}

/**
 * SQLite Database Size Limits
 *
 * THEORETICAL LIMITS:
 * - SQLite: ~140 TB (1.4e+14 bytes)
 * - Practical limit: Device's available disk space
 *
 * PLATFORM-SPECIFIC:
 * - iOS: Limited only by device storage
 * - Android: Limited by device storage, but AsyncStorage defaults to 6MB
 *            (can be increased via AsyncStorage_db_size_in_MB in gradle.properties)
 *
 * PARSE SDK:
 * - No hard-coded size limit in Parse SDK
 * - Uses native SQLite limits
 * - Storage includes all pinned objects (tasks, images, users, tickets, properties)
 */

export interface DatabaseSizeInfo {
  databasePath: string | null;
  databaseSizeBytes: number | null;
  databaseSizeMB: number | null;
  availableStorageMB: number | null;
  totalStorageMB: number | null;
  usedPercentage: number | null;
  canCalculateSize: boolean;
  error?: string;
}

/**
 * Get the SQLite database file path based on platform
 */
const getDatabasePath = (): string | null => {
  if (Platform.OS === 'ios') {
    // iOS: Library/Application Support/parseLocalDatabase.sqlite
    return `${RNFS.LibraryDirectoryPath}/Application Support/parseLocalDatabase.sqlite`;
  } else if (Platform.OS === 'android') {
    // Android: /data/data/[package]/databases/parseLocalDatabase.sqlite
    return `${RNFS.DocumentDirectoryPath}/../databases/parseLocalDatabase.sqlite`;
  }
  return null;
};

/**
 * Get database size information
 * Note: This requires react-native-fs to be installed
 * Install: npm install react-native-fs
 */
export const getDatabaseSize = async (): Promise<DatabaseSizeInfo> => {
  const result: DatabaseSizeInfo = {
    databasePath: null,
    databaseSizeBytes: null,
    databaseSizeMB: null,
    availableStorageMB: null,
    totalStorageMB: null,
    usedPercentage: null,
    canCalculateSize: false
  };

  try {
    // Check if RNFS is available
    if (!RNFS) {
      result.error =
        'react-native-fs not installed. Install with: npm install react-native-fs';
      return result;
    }

    const dbPath = getDatabasePath();
    result.databasePath = dbPath;

    if (!dbPath) {
      result.error = 'Could not determine database path for platform';
      return result;
    }

    // Check if database file exists
    const exists = await RNFS.exists(dbPath);
    if (!exists) {
      result.error = 'Database file not found';
      return result;
    }

    // Get database file size
    const stat = await RNFS.stat(dbPath);
    result.databaseSizeBytes = parseInt(stat.size, 10);
    result.databaseSizeMB = result.databaseSizeBytes / (1024 * 1024);

    // Get available storage space
    const freeSpace = await RNFS.getFSInfo();
    result.availableStorageMB = freeSpace.freeSpace / (1024 * 1024);
    result.totalStorageMB = freeSpace.totalSpace / (1024 * 1024);

    // Calculate usage percentage
    if (result.totalStorageMB && result.totalStorageMB > 0) {
      const usedSpace = result.totalStorageMB - result.availableStorageMB;
      result.usedPercentage = (usedSpace / result.totalStorageMB) * 100;
    }

    result.canCalculateSize = true;
  } catch (error) {
    console.error('Error getting database size:', error);
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
};

/**
 * Get estimated count of pinned objects by collection
 */
export const getPinnedObjectCounts = async (): Promise<{
  [key: string]: number;
}> => {
  const counts: { [key: string]: number } = {};
  const pinNames = [
    { name: 'tasks', className: 'Task' },
    { name: 'images', className: 'Image' },
    { name: 'users', className: '_User' },
    { name: 'tickets', className: 'Ticket' },
    { name: 'properties', className: 'Property' }
  ];

  try {
    for (const { name, className } of pinNames) {
      try {
        // Create a generic query for each collection
        const ObjectClass = Parse.Object.extend(className);
        const query = new Parse.Query(ObjectClass);
        query.fromPinWithName(name);

        const results = await query.find();
        console.log({ results });

        const count = await query.count();
        counts[name] = count;

        console.log({ count });
      } catch (error) {
        console.error(`Error counting ${name}:`, error);
        counts[name] = 0;
      }
    }
  } catch (error) {
    console.error('Error getting pinned object counts:', error);
  }

  return counts;
};

/**
 * Get comprehensive database statistics
 */
export const getDatabaseStatistics = async (): Promise<{
  sizeInfo: DatabaseSizeInfo;
  pinnedCounts: { [key: string]: number };
  totalPinnedObjects: number;
  recommendations: string[];
}> => {
  const sizeInfo = await getDatabaseSize();
  const pinnedCounts = await getPinnedObjectCounts();
  const totalPinnedObjects = Object.values(pinnedCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  console.log({ sizeInfo, pinnedCounts, totalPinnedObjects });

  const recommendations: string[] = [];

  // Add recommendations based on statistics
  if (sizeInfo.databaseSizeMB && sizeInfo.databaseSizeMB > 50) {
    recommendations.push(
      'Database is larger than 50 MB. Consider clearing cache.'
    );
  }

  if (sizeInfo.databaseSizeMB && sizeInfo.databaseSizeMB > 100) {
    recommendations.push(
      'Database is larger than 100 MB. Cache cleanup highly recommended.'
    );
  }

  if (totalPinnedObjects > 1000) {
    recommendations.push(
      `You have ${totalPinnedObjects} cached objects. Consider reducing cache size.`
    );
  }

  if (
    sizeInfo.availableStorageMB &&
    sizeInfo.totalStorageMB &&
    sizeInfo.usedPercentage &&
    sizeInfo.usedPercentage > 90
  ) {
    recommendations.push(
      'Device storage is over 90% full. Free up device space.'
    );
  }

  return {
    sizeInfo,
    pinnedCounts,
    totalPinnedObjects,
    recommendations
  };
};

/**
 * Format bytes to human-readable string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Log database statistics to console
 */
export const logDatabaseStatistics = async (): Promise<void> => {
  console.log('\n=== Parse Local Database Statistics ===');

  const stats = await getDatabaseStatistics();

  console.log('\nDatabase Size:');
  if (stats.sizeInfo.canCalculateSize) {
    console.log(`  Path: ${stats.sizeInfo.databasePath}`);
    console.log(
      `  Size: ${formatBytes(stats.sizeInfo.databaseSizeBytes || 0)} (${stats.sizeInfo.databaseSizeMB?.toFixed(2)} MB)`
    );
  } else {
    console.log(`  Error: ${stats.sizeInfo.error}`);
  }

  console.log('\nDevice Storage:');
  if (stats.sizeInfo.availableStorageMB !== null) {
    console.log(
      `  Available: ${stats.sizeInfo.availableStorageMB.toFixed(2)} MB`
    );
    console.log(`  Total: ${stats.sizeInfo.totalStorageMB?.toFixed(2)} MB`);
    console.log(`  Used: ${stats.sizeInfo.usedPercentage?.toFixed(2)}%`);
  } else {
    console.log('  Could not retrieve storage info');
  }

  console.log('\nCached Objects:');
  Object.entries(stats.pinnedCounts).forEach(([name, count]) => {
    console.log(`  ${name}: ${count} objects`);
  });
  console.log(`  Total: ${stats.totalPinnedObjects} objects`);

  if (stats.recommendations.length > 0) {
    console.log('\nRecommendations:');
    stats.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  console.log('\n=====================================\n');
};
