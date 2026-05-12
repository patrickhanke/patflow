import { create } from 'zustand';
import { Class, DataStoreEntry, DataStoreState } from './types';
import getCurrentRecord from '../../functions/getCurrentRecord';
import { Record } from '@types';

const useDataStore = create<DataStoreState>((set, get) => ({
  // Initial data state
  tasks: [],
  users: [],
  tickets: [],
  properties: [],
  images: [],
  records: [],
  currentRecord: null,

  // Manual data setters (for backwards compatibility)
  setData: (data: Class[], entry: DataStoreEntry) =>
    set(() => {
      const updates = { [entry]: data } as Partial<DataStoreState>;
      if (entry === 'records') {
        const records = data as Record[];
        updates.currentRecord = getCurrentRecord(records) ?? null;
      }
      return updates;
    }),

  // Clear all data
  clearAll: () =>
    set({
      tasks: [],
      users: [],
      tickets: [],
      properties: [],
      images: [],
      records: [],
      currentRecord: null
    }),

  // Selectors
  getTaskById: (id: string) => get().tasks.find(task => task.objectId === id),

  getUserById: (id: string) => get().users.find(user => user.objectId === id),

  getTicketById: (id: string) =>
    get().tickets.find(ticket => ticket.objectId === id),

  getPropertyById: (id: string) =>
    get().properties.find(property => property.objectId === id),

  getImageById: (id: string) =>
    get().images.find(image => image.objectId === id),

  getRecordById: (id: string) =>
    get().records.find(record => record.objectId === id),

  getImagesByIds: (ids: string[]) =>
    get().images.filter(image => ids.includes(image.objectId)),

  getTasksByPropertyId: (propertyId: string) =>
    get().tasks.filter(task => task.property?.objectId === propertyId),

  getTicketsByPropertyId: (propertyId: string) =>
    get().tickets.filter(ticket => ticket.property?.objectId === propertyId),

  getTasksByUserId: (userId: string) =>
    get().tasks.filter(task => task.assigned_staff?.includes(userId))
}));

export default useDataStore;

export { useShallow } from 'zustand/shallow';
