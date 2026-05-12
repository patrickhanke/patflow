# Quick Reference Guide - Centralized Data Fetching

## TL;DR

Data is now fetched automatically at the app level. Just read from `useDataStore` in your components.

## Common Operations

### Read Tasks
```tsx
import { useDataStore } from '@provider';

const tasks = useDataStore(state => state.tasks);
```

### Read Users
```tsx
const users = useDataStore(state => state.users);
```

### Read Tickets
```tsx
const tickets = useDataStore(state => state.tickets);
```

### Read Properties
```tsx
const properties = useDataStore(state => state.properties);
```

### Get Specific Item by ID
```tsx
const getTaskById = useDataStore(state => state.getTaskById);
const task = getTaskById('abc123');
```

### Read Multiple Values
```tsx
import { useDataStore, useShallow } from '@provider';

const { tasks, users, tickets } = useDataStore(
  useShallow(state => ({
    tasks: state.tasks,
    users: state.users,
    tickets: state.tickets
  }))
);
```

### Refetch Data
```tsx
import { useDataRefetch } from '@provider';

const { refetchTasks, refetchAll } = useDataRefetch();

// Refetch specific data
await refetchTasks();

// Or refetch everything
await refetchAll();
```

### Pull to Refresh Example
```tsx
import { useDataStore, useDataRefetch } from '@provider';
import { useState } from 'react';

function TasksList() {
  const tasks = useDataStore(state => state.tasks);
  const { refetchTasks } = useDataRefetch();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTasks();
    setRefreshing(false);
  };
  
  return (
    <FlatList
      data={tasks}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}
```

## Available Selectors

| Selector | Usage |
|----------|-------|
| `getTaskById(id)` | Get task by ID |
| `getUserById(id)` | Get user by ID |
| `getTicketById(id)` | Get ticket by ID |
| `getPropertyById(id)` | Get property by ID |
| `getImageById(id)` | Get image by ID |
| `getImagesByIds(ids)` | Get multiple images by IDs |
| `getTasksByPropertyId(propertyId)` | Get tasks for a property |
| `getTicketsByPropertyId(propertyId)` | Get tickets for a property |
| `getTasksByUserId(userId)` | Get tasks for a user |
| `getTasksByState(state)` | Get tasks by state |

## Refetch Functions

| Function | Description |
|----------|-------------|
| `refetchTasks()` | Refresh tasks data |
| `refetchUsers()` | Refresh users data |
| `refetchTickets()` | Refresh tickets data |
| `refetchProperties()` | Refresh properties data |
| `refetchAll()` | Refresh all data |

## Last Updated Times

```tsx
const lastUpdated = useDataStore(state => state.lastUpdated);

console.log('Tasks:', lastUpdated.tasks);
console.log('Users:', lastUpdated.users);
console.log('Tickets:', lastUpdated.tickets);
console.log('Properties:', lastUpdated.properties);
```

## Complete Component Example

```tsx
import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useDataStore, useDataRefetch } from '@provider';

function MyComponent() {
  // Read data from store
  const tasks = useDataStore(state => state.tasks);
  const getTaskById = useDataStore(state => state.getTaskById);
  
  // Setup refetch
  const { refetchTasks } = useDataRefetch();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTasks();
    setRefreshing(false);
  };
  
  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.objectId}
      renderItem={({ item }) => (
        <TaskItem task={item} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    />
  );
}
```

## Performance Tips

1. **Select only what you need**
   ```tsx
   // ✅ Good - only re-renders when tasks change
   const tasks = useDataStore(state => state.tasks);
   
   // ❌ Bad - re-renders on any store change
   const store = useDataStore();
   ```

2. **Use selectors for queries**
   ```tsx
   // ✅ Good - using built-in selector
   const getTaskById = useDataStore(state => state.getTaskById);
   const task = getTaskById(id);
   
   // ❌ Less efficient - filtering in component
   const tasks = useDataStore(state => state.tasks);
   const task = tasks.find(t => t.objectId === id);
   ```

3. **Use useShallow for multiple values**
   ```tsx
   // ✅ Good - single subscription
   const { tasks, users } = useDataStore(
     useShallow(state => ({ tasks: state.tasks, users: state.users }))
   );
   
   // ❌ Less efficient - multiple subscriptions
   const tasks = useDataStore(state => state.tasks);
   const users = useDataStore(state => state.users);
   ```

## Don't Do This Anymore

### ❌ Don't call useFind hooks in components
```tsx
// ❌ OLD WAY - Don't do this
function MyComponent() {
  const { tasks, refetch } = useFindTasks({ state: 'open' });
  return <View>...</View>;
}
```

### ✅ Do this instead
```tsx
// ✅ NEW WAY - Do this
function MyComponent() {
  const tasks = useDataStore(state => 
    state.tasks.filter(t => t.state === 'open')
  );
  return <View>...</View>;
}
```

## FAQ

**Q: Where is data fetched?**
A: At the app root level in `AppContextProvider` via `useInitializeData()`

**Q: When is data fetched?**
A: Automatically when the app goes online and Parse is ready

**Q: How do I refresh data?**
A: Use `useDataRefetch()` hook and call the appropriate refetch function

**Q: Does this work offline?**
A: Yes! Data is cached locally and loaded from cache when offline

**Q: What if I need to filter data?**
A: Filter in your component or create a custom selector

**Q: How do I know when data was last updated?**
A: Check `useDataStore(state => state.lastUpdated)`

**Q: Can I still use useFindTasks in components?**
A: Yes, but it's not recommended. Use `useDataStore` instead for better performance.

## Need More Info?

- **Architecture Details**: See `CENTRALIZED_DATA_FETCHING.md`
- **Code Examples**: See `EXAMPLE_USAGE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
