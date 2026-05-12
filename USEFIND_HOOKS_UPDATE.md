# useFind Hooks Update Summary

## Overview

All `useFind...` hooks have been refactored to follow the pattern established in `useFindTasks`, providing a consistent, efficient, and reliable data fetching strategy across the application.

## Changes Made

### 1. Updated Hooks

#### `useFindUsers.ts`
- **Before**: Used Zustand store's `loadUsers` function, maintained local state for users
- **After**: Direct data fetching with local caching, follows `useFindTasks` pattern
- **Key Changes**:
  - Removed local state management (`useState`)
  - Added `loadFromLocalDatastore` helper function
  - Implemented direct server queries with `safeCacheData`
  - Simplified return type to only include `refetch` function
  - Auto-fetches when online and Parse is ready

#### `useFindTickets.ts`
- **Before**: Used Zustand store's `loadTickets` function, maintained local state
- **After**: Direct data fetching with local caching and image caching
- **Key Changes**:
  - Removed local state management
  - Added `loadFromLocalDatastore` helper function
  - Added `fetchAndCacheTicketImages` to fetch and cache related images
  - Implemented direct server queries with `safeCacheData`
  - Images are automatically fetched and cached when tickets are loaded
  - Simplified return type to only include `refetch` function

#### `useFindProperty.ts`
- **Before**: Used Zustand store's `loadProperties` function, maintained local state
- **After**: Direct data fetching with local caching
- **Key Changes**:
  - Removed local state management
  - Added `loadFromLocalDatastore` helper function
  - Implemented direct server queries with `safeCacheData`
  - Removed `isConnected` from function parameters (now uses context)
  - Simplified return type to only include `refetch` function

### 2. New Hook: `useLoadAllData.ts`

A new hook that loads all application data and pins it into cache in one operation.

**Features**:
- Fetches all tasks, users, tickets, and properties
- Caches all data using `safeCacheData`
- Fetches and caches images for both tasks and tickets
- Returns comprehensive results including counts for each data type
- Includes standalone `loadAllDataAndCache` function for programmatic use

**Usage**:
```typescript
import { useLoadAllData } from '@provider';

const MyComponent = () => {
  const { loadAllData } = useLoadAllData();

  const handleLoadAll = async () => {
    const results = await loadAllData();
    console.log('Loaded data:', results);
    // {
    //   success: true,
    //   tasksCount: 150,
    //   usersCount: 25,
    //   ticketsCount: 80,
    //   propertiesCount: 10,
    //   taskImagesCount: 0,
    //   ticketImagesCount: 0
    // }
  };

  return <Button onPress={handleLoadAll}>Load All Data</Button>;
};
```

**Standalone Function Usage**:
```typescript
import { loadAllDataAndCache } from '@provider';

// Programmatically load all data
const results = await loadAllDataAndCache(Parse, isReady, isConnected, {
  projectId: 'abc123'
});
```

## Consistent Pattern

All hooks now follow this pattern:

1. **Local Datastore Helper**: Each hook has a `loadFromLocalDatastore` function for offline access
2. **Smart Caching**: Uses `safeCacheData` for automatic error recovery
3. **Online/Offline Handling**: Checks connection status and loads from cache when offline
4. **Auto-fetch**: Automatically fetches data when Parse is ready and online
5. **Simplified Return**: Returns only `refetch` function (data is stored in Zustand)
6. **Image Caching**: Tasks and tickets automatically fetch and cache their related images

## Image Caching

### Task Images
- Images are fetched when tasks are loaded
- Cached in `'images'` pin name
- Automatically handled in `useFindTasks`

### Ticket Images
- Images are fetched when tickets are loaded
- Cached in `'ticket_images'` pin name
- Automatically handled in `useFindTickets`

### How It Works
1. When tasks/tickets are fetched, the system collects all image IDs
2. A separate query fetches all images in one batch
3. Images are unpinned (old cache cleared) and repinned (new cache saved)
4. Images are now available offline via local datastore

## Benefits

1. **Consistency**: All hooks follow the same pattern, making the codebase easier to understand
2. **Performance**: Smart caching reduces unnecessary server queries
3. **Offline Support**: All data is available offline through local datastore
4. **Error Recovery**: `safeCacheData` handles caching errors gracefully
5. **Simplified API**: Hooks return only what's needed (`refetch` function)
6. **Image Availability**: Related images are automatically cached for offline use
7. **Single Source of Truth**: Data is stored in Zustand store, not in local hook state

## Migration Notes

### For Users Hook
```typescript
// Before
const { users, loading, refetch } = useFindUsers();

// After
const { refetch } = useFindUsers();
const users = useDataStore(state => state.users); // Get from store
```

### For Tickets Hook
```typescript
// Before
const { tickets, loading, refetch } = useFindTickets({ propertyId });

// After
const { refetch } = useFindTickets({ propertyId });
const tickets = useDataStore(state => state.tickets); // Get from store
```

### For Properties Hook
```typescript
// Before
const { properties, loading, refetch } = useFindProperty({ 
  projectId, 
  isConnected 
});

// After
const { refetch } = useFindProperty({ projectId }); // isConnected removed
const properties = useDataStore(state => state.properties); // Get from store
```

## Files Modified

1. `src/provider/hooks/useFindUsers.ts` - Refactored to match pattern
2. `src/provider/hooks/useFindTickets.ts` - Refactored with image caching
3. `src/provider/hooks/useFindProperty.ts` - Refactored to match pattern
4. `src/provider/hooks/useLoadAllData.ts` - New hook created
5. `src/provider/hooks/index.ts` - Exported new hook

## Next Steps

1. Update components that use these hooks to access data from Zustand store
2. Remove any local state management related to this data in components
3. Test offline functionality to ensure data is available when offline
4. Consider using `useLoadAllData` during app initialization for better UX
