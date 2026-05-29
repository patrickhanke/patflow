import { Comment, MonthDayTime } from '@types';
import { User, UserDisplayData } from './User';
import { date_category_options } from '../../content/AdminTasks/content/CreateTask/content/EditDate/constants';

export type TaskState = 'completed' | 'executed' | 'created' | 'assigned';

export type Ticket = {
  title: string;
  objectId: string;
  description: string;
  created_by?: User;
  createdAt: string;
  updatedAt: string;
  images: string[];
  state: string;
  response: boolean;
  comments: Comment[];
  property: Property;
  task: Task;
};

export type DateInterval = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type DateObject = {
  type: DateInterval;
  category: (typeof date_category_options)[number];
  interval: {
    number: number;
    unit: string;
  };
  dates: string[];
  start_date: string;
  end_date: string;
  weekday: string;
  time: string;
  next_dates: string[];
};

export type Task = {
  objectId: string;
  title: string;
  comments: Comment[];
  description: string;
  documents: Document[];
  state: TaskState;
  property: Property;
  time?: DateObject;
  ticket?: Ticket;
  assigned_staff: string[];
  dates: string[];
  type: string;
  images: string[];
};

export type Property = {
  objectId: string;
  name: string;
  settings: object;
  created_by: User;
};

export type ObjectService = {
  objectId: string;
  time: string;
  name: string;
  interval: string;
  active: boolean;
  period: {
    start: string;
    end: string;
  };
  worker: User;
};

export type ObjectSelect = {
  value: string;
  id: string;
  label: string;
};

export type DayTimeBreak = {
  start: string;
  end: string;
  id: string;
};

export type DayTime = {
  type: 'regular';
  start: string;
  end: string;
  pause: number;
  duration: number;
  comment: string;
  state: 'created' | 'submitted' | 'approved' | 'initial';
  breaks: DayTimeBreak[];
};

export type TimeObject = {
  absence: Absence | null;
  default_time: DayTime | null;
  time: DayTime | null;
  type: 'absence' | 'time' | null;
  is_working_day: boolean;
  date: string;
};

export type MonthDayTime = {
  start: Date;
  end: Date;
  pause: number;
  comment: string;
  duration: number;
};

export type Absence = {
  objectId: string;
  start_date: string;
  end_date: string;
  comment: string;
  state: AbsenceStateOptions[number]['value'];
  user: UserDisplayData.objectId;
  type: 'illness' | 'vacation' | 'other';
  year: number;
};

export type AbsenceStateOptions = [
  {
    value: 'created';
    id: 'created';
    label: 'Erstellt';
    color: string;
  },
  {
    value: 'submitted';
    id: 'submitted';
    label: 'Eingereicht';
    color: string;
  },
  {
    value: 'approved';
    id: 'approved';
    label: 'Genehmigt';
    color: string;
  }
];

export type RecordTimeSettings = {
  hours: number;
  weekdays: number;
  pause: number;
  vacation: number;
  start: string;
};

export type Record = {
  objectId: string;
  createdAt: string;
  user: User;
  absence: Absence[];
  default_times: TimeObject[];
  working_days: Array<DayTime>;
  start_date: string;
  end_date: string;
  absence_days: number;
  time_settings: RecordTimeSettings;
  vacation: number;
  saldo: number;
  year: number;
  former_record: Record;
  holiday_template: HolidayTemplate;
};

export type Day = {
  record: Record | null;
  objectId: string;
  year: number;
  month: number;
  date: string;
  type: 'work' | 'absence' | 'initial';
  is_working_day: boolean;
  time: DayTime | null;
  default_time: DayTime | null;
  absence: Absence | null;
  user: UserDisplayData;
  saldo: number;
};

export type Holiday = {
  date: string;
  name: string;
  comment: string;
  objectId: string;
  type: 'holiday';
  dates: { [key: string]: string };
};

export type DefaultDay = Omit<Day, 'user', 'objectId'>;

export type MessageTypes =
  | 'task_created'
  | 'ticket_created'
  | 'task_assigned'
  | 'task_completed'
  | 'task_deleted'
  | 'ticket_closed'
  | 'ticket_response'
  | 'ticket_deleted'
  | 'task_response'
  | 'task_comment'
  | 'ticket_comment'
  | 'task_updated'
  | 'ticket_updated';

export type Message = {
  objectId: string;
  createdAt: string;
  type: MessageTypes;
  task?: TaskTypes.Task;
  ticket?: TicketTypes.Ticket;
  is_read: boolean;
  created_by: UserTypes.UserDisplayData;
};

export type MessageUpdateObject = Partial<Message, 'task' | 'type' | 'is_read'>;

type GeneralTemplate = {
  objectId: string;
  name: string;
  project: Project;
};

export type HolidayTemplate = GeneralTemplate & {
  type: 'holiday';
  holidays: string[];
};

export type DefaultWorkingDay = MakeOptional<
  WorkingDay,
  'record' | 'user' | 'objectId'
>;
