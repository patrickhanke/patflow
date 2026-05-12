import { ApolloRefetch, Day, Record } from '@types';

export type GetRecordObject = {
  loading: boolean;
  record: Record | null;
  refetch: () => void;
  records: Record[];
};

export type TimeDisplayProps = {
  day: TimeDay;
  record: Record;
  refetch: ApolloRefetch;
  dayObject?: Day;
};

export type EditDayProps = {
  date: string;
  time: TimeDay;
  timeHandler: (T: string) => void;
};
export type MonthData = {
  month: string;
  monthSaldo: string;
  target: string;
  monthTimes: string;
  id: number;
  value: string;
};

export type SelectedMonth = {
  value: number;
  label: string;
  id: number;
};
