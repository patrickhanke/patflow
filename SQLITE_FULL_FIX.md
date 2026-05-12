# SQLite Database Full Error - Fix Documentation

## Problem
The app was throwing the error: `Error: database or disk is full (code 13 SQLITE_FULL)`

This occurs when the Parse SDK's local datastore (SQLite database) reaches its storage limit. The app uses local datastore for offline caching of tasks, images, users, tickets, and properties.

## Root Cause
- Parse SDK's `enableLocalDatastore()` uses SQLite for offline caching
- Multiple collections (tasks, images, users, tickets, properties) are pinned to local storage
- Over time, the database accumulates data and fills up
- While the code unpins old objects before pinning new ones, this doesn't always prevent database growth

## Solution Implemented

### 1. Database Cleanup Utilities
Created `src/provider/Parse/utils/cleanupLocalDatastore.ts` with:
- `clearAllPinnedData()` - Clears all pinned objects
- `clearPinnedDataByName()` - Clears specific collections
- `performFullCleanup()` - Full database cleanup
- `checkAndCleanupIfNeeded()` - Automatic cleanup on database full errors

### 1.5. Database Monitoring Utilities
Created `src/provider/Parse/utils/databaseMonitoring.ts` with:
- `getDatabaseSize()` - Get database file size and storage info
- `getPinnedObjectCounts()` - Count cached objects by category
- `getDatabaseStatistics()` - Comprehensive statistics with recommendations
- `formatBytes()` - Format byte sizes for display
- `logDatabaseStatistics()` - Log all stats to console

### 2. Automatic Cleanup on Initialization
Modified `src/provider/Parse/config.ts`:
- Checks database health on app startup
- Automatically triggers cleanup if database is full
- Prevents app crashes on initialization

### 3. Error Handling in Data Hooks
Updated all data fetching hooks to catch SQLITE_FULL errors:
- `useFindTasks.ts`
- `useFindImages.ts`
- `useFindUsers.ts`
- `useFindTickets.ts`
- `useFindProperty.ts`

When pinning data fails due to full database, automatic cleanup is triggered.

### 4. Manual Cache Clear Option & Statistics Display
Enhanced Profile Settings (`content/Profile/content/ProfileSettings/ProfileSettings.tsx`):
- **Cache Statistics Display**: Shows real-time cache size and object counts
- **"Cache löschen" Button**: Allows users to manually clear cache
- Shows breakdown by category (tasks, images, users, tickets, properties)
- Displays database size if `react-native-fs` is installed
- Confirmation dialog before clearing
- Automatically refreshes statistics after cleanup

## Usage

### For Users

#### Monitoring Cache Size
1. Open Profile tab
2. Scroll down to see "Cache Statistiken"
3. View current database size and object counts

#### Clearing Cache
If you experience the app becoming slow or showing errors:
1. Open Profile tab
2. Scroll down and tap "Cache löschen"
3. Confirm the action
4. The app will reload data fresh from the server

### For Developers

#### Cleanup Operations
```typescript
import { 
  performFullCleanup, 
  checkAndCleanupIfNeeded,
  clearPinnedDataByName,
  ALL_PIN_NAMES 
} from '@provider';

// Manual full cleanup
await performFullCleanup();

// Check and cleanup if needed
const wasCleanedUp = await checkAndCleanupIfNeeded();

// Clear specific collections
await clearPinnedDataByName(['tasks', 'images']);
```

#### Monitoring Operations
```typescript
import {
  getDatabaseStatistics,
  getDatabaseSize,
  getPinnedObjectCounts,
  logDatabaseStatistics,
  formatBytes
} from '@provider';

// Get comprehensive statistics
const stats = await getDatabaseStatistics();
console.log('Database size:', stats.sizeInfo.databaseSizeMB, 'MB');
console.log('Total objects:', stats.totalPinnedObjects);
console.log('Recommendations:', stats.recommendations);

// Get just the size (requires react-native-fs)
const sizeInfo = await getDatabaseSize();
console.log('Size:', formatBytes(sizeInfo.databaseSizeBytes || 0));

// Get object counts only
const counts = await getPinnedObjectCounts();
console.log('Cached objects:', counts);

// Log everything to console
await logDatabaseStatistics();
```

## Prevention
The implemented solution includes:
1. **Proactive cleanup** on app initialization
2. **Automatic recovery** when pinning fails
3. **User control** via manual cache clear option
4. **Better error handling** to prevent app crashes

## Testing
To test the fix:
1. App should start normally even if database was full
2. Data fetching should automatically recover from SQLITE_FULL errors
3. Manual cache clear button should work in Profile settings
4. App should show appropriate console logs for cleanup operations

## Notes
- The fix is non-destructive - cached data can be re-downloaded from server
- Users may experience a brief loading period after cleanup as data is re-fetched
- The cleanup is safe to run at any time without data loss (server data is not affected)
- Database size monitoring requires `react-native-fs` package (optional)
- Object counts work without any additional packages

## Optional: Enhanced Monitoring
For full database size monitoring, install `react-native-fs`:
```bash
npm install react-native-fs
cd ios && pod install && cd ..
```

Without this package:
- ✅ Object counts still work
- ✅ Cleanup functions still work
- ❌ File size calculations unavailable

## Additional Documentation
See `DATABASE_SIZE_INFO.md` for comprehensive information about:
- Database size limits and maximums
- Detailed monitoring guide
- Performance optimization tips
- API reference
