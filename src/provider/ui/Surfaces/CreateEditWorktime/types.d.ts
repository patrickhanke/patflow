import { Day } from '@types';

export type CreateEditWorktimeProps = {
  days: Day[];
  date: string;
  refetch: () => Promise<void>;
  records: Record[];
};

export type NoTimesProps = {
  date: string;
  refetch: () => Promise<void>;
  records: Record[];
};
