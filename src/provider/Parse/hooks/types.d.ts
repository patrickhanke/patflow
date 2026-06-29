import {
  Absence,
  Image,
  Property,
  Record,
  Task,
  Ticket,
  User
} from '@types';

export type ImageFile = {
  objectId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  local_url?: string;
  file: {
    name: string;
    url: string;
    __type: string;
  };
};

interface DataStoreState {
  tasks: Task[];
  users: User[];
  tickets: Ticket[];
  properties: Property[];
  images: ImageFile[];
  records: Record[];
  absences: Absence[];
  currentRecord: Record | null;
  setData: (data: Class[], entry: DataStoreEntry) => void;
  clearAll: () => void;
  getTaskById: (id: string) => Task | undefined;
  getUserById: (id: string) => User | undefined;
  getTicketById: (id: string) => Ticket | undefined;
  getPropertyById: (id: string) => Property | undefined;
  getImageById: (id: string) => ImageFile | undefined;
  getRecordById: (id: string) => Record | undefined;
  getAbsenceById: (id: string) => Absence | undefined;
  getImagesByIds: (ids: string[]) => ImageFile[];
  getTasksByPropertyId: (propertyId: string) => Task[];
  getTicketsByPropertyId: (propertyId: string) => Ticket[];
  getTasksByUserId: (userId: string) => Task[];
}

export type DataStoreEntry =
  | 'tasks'
  | 'adminTasks'
  | 'users'
  | 'tickets'
  | 'properties'
  | 'images'
  | 'records'
  | 'absences';

/** Parse query operators supported by the hook */
export type QueryOperator =
  | 'equalTo'
  | 'containedIn'
  | 'notEqualTo'
  | 'notContainedIn'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqualTo'
  | 'greaterThanOrEqualTo'
  | 'exists'
  | 'doesNotExist';

/** Single query restriction */
export type QueryRestriction = {
  key: string;
  value: unknown;
  operator?: QueryOperator;
  /** If set, creates a Parse pointer for the value (value should be objectId string) */
  pointerClassName?: string;
};

export type UseFindDataParams = {
  className: string;
  entry: DataStoreEntry;
  restrictions?: QueryRestriction[];
  properties: string[];
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ascending' | 'descending';
  saveLocally?: boolean;
};

export type Class =
  | Task
  | Ticket
  | User
  | Property
  | Image
  | Record
  | Absence;
