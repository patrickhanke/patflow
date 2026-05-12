# Database Management - Complete Guide

This guide covers the SQLite database used by Parse SDK for local caching in your React Native app.

## 📚 Documentation Files

1. **[CACHE_CONFIGURATION_GUIDE.md](./CACHE_CONFIGURATION_GUIDE.md)** - ⭐ Start here if you're getting errors!
   - Solves SQLITE_FULL errors when loading large datasets
   - Smart caching configuration (100 items vs 2,200)
   - Automatic error recovery
   - Configuration presets

2. **[DATABASE_MONITORING_SUMMARY.md](./DATABASE_MONITORING_SUMMARY.md)** - Quick reference
   - Quick answers about database size limits
   - Where to find current size information
   - Simple commands to get started

3. **[SQLITE_FULL_FIX.md](./SQLITE_FULL_FIX.md)**
   - Details on the "database full" error fix
   - How the automatic cleanup works
   - Technical implementation details

4. **[DATABASE_SIZE_INFO.md](./DATABASE_SIZE_INFO.md)**
   - Comprehensive database size limits
   - Detailed monitoring guide
   - Performance optimization tips
   - Complete API reference

## 🚀 Quick Start

### Check Your Database Size

**Option 1: In the App (Easiest)**
1. Open the app
2. Go to Profile tab
3. Scroll down to see "Cache Statistiken"

**Option 2: In Code**
```typescript
import { logDatabaseStatistics } from '@provider';

// Logs complete statistics to console
await logDatabaseStatistics();
```

### Clear Cache If Needed

**In the App:**
1. Profile tab → Settings
2. Tap "Cache löschen"
3. Confirm

**In Code:**
```typescript
import { performFullCleanup } from '@provider';

await performFullCleanup();
```

## 📊 What's Tracked

The app caches these types of data locally:
- **Tasks** (assigned work items)
- **Images** (metadata only, not actual files)
- **Users** (staff profiles)
- **Tickets** (issue reports)
- **Properties** (location/building data)

## 🔧 Features Implemented

### Smart Caching (NEW - Prevents Errors)
- ✅ **Limits cached items**: 100 per collection (vs 500 before)
- ✅ **Total safety limit**: 400 objects max across all types
- ✅ **Still shows all data**: Caches less, displays everything
- ✅ **Auto-retry**: Reduces cache size if errors occur
- ✅ **Configurable**: Adjust limits based on device storage

### Automatic Protection
- ✅ Detects "database full" errors automatically
- ✅ Triggers cleanup when errors occur
- ✅ Prevents app crashes from storage issues
- ✅ Checks health on app startup

### Manual Controls
- ✅ View cache statistics in Profile settings
- ✅ Clear cache with one tap
- ✅ See breakdown by data type
- ✅ Confirmation before clearing
- ✅ Configure cache limits (default/minimal/full presets)

### Developer Tools
- ✅ Get database size and statistics
- ✅ Monitor object counts
- ✅ Log detailed info to console
- ✅ Clear specific data collections
- ✅ Format utilities for displaying sizes
- ✅ Cache configuration API

## 📦 Optional Enhancement

For detailed file size information, install `react-native-fs`:

```bash
npm install react-native-fs
cd ios && pod install && cd ..
```

**What this adds:**
- Actual database file size in MB/GB
- Available device storage space
- Total device storage capacity
- Storage usage percentage

**Without it:**
- Object counts still work perfectly
- All cleanup functions still work
- Just can't calculate actual file sizes

## ⚠️ Database Size Limits

- **Maximum**: Effectively unlimited (uses device storage)
- **Recommended**: Keep under 100 MB
- **Warning threshold**: 50 MB
- **Critical threshold**: 100 MB

## 🎯 Best Practices

1. **Use default cache limits**: Already optimized to prevent errors
2. **Monitor regularly**: Check stats in Profile settings
3. **Clear periodically**: Especially for heavy users (weekly)
4. **Adjust configuration**: Use presets based on device storage
   - Minimal: < 16GB storage
   - Default: 16-32GB storage (recommended)
   - Full: > 32GB storage
5. **Let automatic systems work**: Smart caching and cleanup handle most issues
6. **Check console logs**: See what's being cached in real-time

## 🛠️ Troubleshooting

### "Database or disk is full" error
- ✅ Fixed automatically by the system
- Or manually: Profile → Cache löschen

### App is slow
- Check cache size in Profile settings
- Clear cache if > 50 MB or > 1,000 objects

### Can't see file size
- Install `react-native-fs` (optional)
- Object counts still work without it

### Database not shrinking after cleanup
- SQLite doesn't immediately reclaim space
- Space will be reused for new data
- This is normal SQLite behavior

## 📖 API Reference

### Monitoring Functions
```typescript
getDatabaseSize()           // Get file size and storage info
getPinnedObjectCounts()     // Count objects by type
getDatabaseStatistics()     // Complete statistics
logDatabaseStatistics()     // Log everything to console
formatBytes()               // Format size for display
```

### Cleanup Functions
```typescript
performFullCleanup()        // Clear all cached data
checkAndCleanupIfNeeded()   // Auto-cleanup if needed
clearAllPinnedData()        // Clear all pins
clearPinnedDataByName()     // Clear specific types
```

## 🎓 Learn More

- See individual documentation files for detailed information
- Check code comments in `src/provider/Parse/utils/`
- SQLite docs: https://sqlite.org/limits.html
- Parse docs: https://docs.parseplatform.org/

## 💡 Need Help?

1. Check the documentation files listed above
2. Look at code examples in the docs
3. Run `logDatabaseStatistics()` to see current state
4. Check console logs for automatic cleanup messages
