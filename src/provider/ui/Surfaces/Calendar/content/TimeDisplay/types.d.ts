import { ApolloRefetch, Day, Record } from '@types';

export type GetRecordObject = {
  loading: boolean;
  record: Record;
  refetch: () => void;
};

export type TimesMemo = {
  timesArray: Day[];
  monthArray: MonthArray;
  currentRecord?: Record;
};

export type TimeDay = {
  time: number;
  date: string;
  saldo: number;
  type: 'work' | 'absence' | 'initial';
  dayObject: Day | undefined;
};

export type MonthArray = {
  id: number;
  value: string;
  label: string;
  saldo: number;
  days: Day[];
}[];

export type TimeDisplayProps = {
  days: Day[];
  refetch: () => Promise<void>;
  date: string;
  isEditable: boolean;
  holiday?: string | null;
  record: Record;
};

export type EditDayProps = {
  date: string;
  time: TimeDay;
  timeHandler: (T: string) => void;
};
