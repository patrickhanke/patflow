import { Refetch, Day } from '@types';

export type ShowTimesProps = {
  days: Day[];
  refetch: Refetch;
  date: string;
  records: Record[];
};

export type TimeProps = {
  day: Day;
  refetch: Refetch;
};
