# SQLITE_FULL Error - Complete Solution

## The Problem You Reported

```
Error: database or disk is full (code 13 SQLITE_FULL)
```

**Symptoms:**
- Error appears when loading data (e.g., ~2,200 tasks)
- Happens approximately 2,200 times
- Cache statistics show no data cached
- Error prevents data from being cached

## Root Cause Analysis

The issue was **NOT** that the cache was full - it was that the caching operation itself was filling the database:

### What Was Happening:
1. App fetches 500 tasks from server ✅
2. App tries to PIN all 500 tasks to local database 
3. With nested objects (property, ticket, assigned_staff), this creates 1,000+ database rows
4. Times 5 collections (tasks, images, users, tickets, properties) = 2,500+ rows
5. Database fills up during the pinning operation ❌
6. SQLITE_FULL error thrown
7. NO data gets cached (cache appears empty)
8. Error repeats on every data load

## Complete Solution Implemented

### 1. Smart Caching System ⭐ (Main Fix)

**Changed**: Only cache the most recent/relevant items, not everything

**Before:**
```typescript
Query: Fetch 500 tasks
Cache: Try to pin all 500 → SQLITE_FULL! ❌
Result: Error, no caching
```

**After:**
```typescript
Query: Fetch 500 tasks (display all)
Cache: Pin only 100 most recent → Success! ✅
If Error: Auto-retry with 20 items
Result: User sees all data, reasonable cache for offline
```

**Configuration:**
```typescript
// Default optimized limits (NEW)
maxTasksToCache: 100        // Was: 500
maxImagesToCache: 50        // Was: 500
maxUsersToCache: 100        // Was: 500
maxTicketsToCache: 100      // Was: 500
maxPropertiesToCache: 50    // Was: 500

maxTotalCachedObjects: 400  // Safety limit
```

### 2. Automatic Error Recovery

When SQLITE_FULL occurs:
```typescript
1. Detect error during pinning
2. Clear database automatically
3. Retry with configured limit (100 items)
4. If still fails, retry with 20 items
5. If still fails, disable caching for session
6. Continue showing data to user (no user-facing error)
```

### 3. Configuration Presets

Choose based on your device:

```typescript
import { applyCachePreset } from '@provider';

// Low storage devices (< 16GB)
applyCachePreset('minimal');  // 200 total objects

// Normal devices (default - recommended)
applyCachePreset('default');  // 400 total objects

// High storage devices (> 32GB)
applyCachePreset('full');     // 800 total objects
```

### 4. Database Monitoring

Check cache usage anytime:

**In App:**
- Profile → Settings → See cache statistics

**In Code:**
```typescript
import { getDatabaseStatistics, logDatabaseStatistics } from '@provider';

await logDatabaseStatistics();
// Shows: size, object counts, recommendations
```

### 5. Manual Cache Clear

If you still encounter issues:
- Profile → Settings → "Cache löschen"
- Clears all cached data
- Data reloads fresh from server

## Files Created/Modified

### New Files:
1. `src/provider/Parse/config/cacheConfig.ts` - Cache configuration system
2. `src/provider/Parse/utils/cleanupLocalDatastore.ts` - Cleanup utilities
3. `src/provider/Parse/utils/databaseMonitoring.ts` - Monitoring tools
4. `CACHE_CONFIGURATION_GUIDE.md` - Configuration guide
5. `DATABASE_SIZE_INFO.md` - Size limits documentation
6. `DATABASE_MONITORING_SUMMARY.md` - Quick reference
7. `README_DATABASE.md` - Main guide

### Modified Files:
- All hooks in `src/provider/hooks/`:
  - `useFindTasks.ts` - Smart caching
  - `useFindImages.ts` - Smart caching
  - `useFindUsers.ts` - Smart caching
  - `useFindTickets.ts` - Smart caching
  - `useFindProperty.ts` - Smart caching
- `src/provider/Parse/config.ts` - Auto cleanup on init
- `src/provider/Parse/index.ts` - Export new functions
- `content/Profile/content/ProfileSettings/ProfileSettings.tsx` - Stats display

## How to Use

### Immediate Fix (No Code Required)
The app now automatically:
- ✅ Caches only 100 items per collection
- ✅ Retries with smaller amounts if errors occur
- ✅ Shows all data to users (caching doesn't limit display)
- ✅ Logs helpful information to console

### If You Want to Adjust

```typescript
// In your app initialization or settings:
import { applyCachePreset, setCacheConfig } from '@provider';

// Option 1: Use a preset
applyCachePreset('minimal');  // For limited storage

// Option 2: Custom configuration
setCacheConfig({
  maxTasksToCache: 50,        // Even less caching
  enableImageCaching: false   // Disable image cache
});
```

### Monitoring Usage

```typescript
import { getDatabaseStatistics } from '@provider';

const stats = await getDatabaseStatistics();

console.log('Tasks cached:', stats.pinnedCounts.tasks);
console.log('Total cached:', stats.totalPinnedObjects);
console.log('Recommendations:', stats.recommendations);
```

## What Changed for Users

### ✅ Benefits:
- No more SQLITE_FULL errors
- App loads faster (less to cache)
- All data still displays (not limited to cache)
- Offline mode still works (100 items cached)
- Automatic error recovery
- Visible cache statistics in Profile

### 📊 Technical Details:
- Server queries: Still fetch 500 items (unchanged)
- Display: Show all fetched items (unchanged)
- Cache: Store only 100 items (NEW - prevents errors)
- Total cache: Max 400 objects vs 2,500+ before

### 🎯 User Experience:
**Before:**
1. Open app
2. Load tasks → SQLITE_FULL ERROR
3. See error message
4. No offline data cached

**After:**
1. Open app
2. Load tasks → Success ✅
3. See all 500 tasks
4. 100 most recent cached for offline
5. If any error → auto-retry → works anyway

## Testing the Fix

### Verify It's Working:
1. Check console logs for:
   ```
   ✅ Caching 100 of 234 tasks (max: 100)
   ✅ Tasks pinned to local datastore: 100
   ```

2. Check Profile settings:
   - Should show cache statistics
   - Should show < 500 total objects

3. Test with large dataset:
   - Load 2,200 tasks
   - Should cache only 100
   - Should display all 2,200
   - No error should appear

### If Error Still Occurs:
```typescript
// 1. Apply minimal preset
applyCachePreset('minimal');

// 2. Clear cache
import { performFullCleanup } from '@provider';
await performFullCleanup();

// 3. Further reduce if needed
setCacheConfig({
  maxTasksToCache: 20,
  maxTotalCachedObjects: 100
});
```

## Console Logs to Expect

### Successful Caching:
```
✅ Caching 100 of 234 tasks (max: 100)
✅ Unpinned old tasks
✅ Tasks pinned to local datastore: 100
```

### With Auto-Recovery:
```
⚠️ Error pinning tasks: Error: database or disk is full
⚠️ Database full while pinning, triggering cleanup...
⚠️ Retrying with reduced cache: 20 items
✅ Reduced cache successful
```

### When Caching Disabled:
```
ℹ️ Task caching is disabled
```

## Summary

**Problem**: Trying to cache 2,500+ objects caused SQLITE_FULL errors during the caching operation itself

**Root Cause**: Database filled up while pinning data, not from accumulated cache

**Solution**: 
1. Smart caching (100 items vs 500)
2. Total limit of 400 objects
3. Automatic retry with reduced sets
4. Configurable based on device
5. Monitoring and statistics
6. Manual cleanup option

**Result**: 
- ✅ No more SQLITE_FULL errors
- ✅ Better performance
- ✅ User sees all data
- ✅ Reasonable offline cache
- ✅ Configurable per device
- ✅ Transparent monitoring

## Questions?

See the detailed guides:
- [CACHE_CONFIGURATION_GUIDE.md](./CACHE_CONFIGURATION_GUIDE.md) - How to configure
- [DATABASE_SIZE_INFO.md](./DATABASE_SIZE_INFO.md) - Size limits and API
- [DATABASE_MONITORING_SUMMARY.md](./DATABASE_MONITORING_SUMMARY.md) - Quick reference
- [README_DATABASE.md](./README_DATABASE.md) - Main guide
