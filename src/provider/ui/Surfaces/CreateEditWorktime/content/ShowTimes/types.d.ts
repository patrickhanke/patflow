import { ApolloRefetch, Day } from '@types';

export type ShowTimesProps = {
  days: Day[];
  refetch: ApolloRefetch;
  date: string;
  records: Record[];
};

export type TimeProps = {
  day: Day;
  refetch: ApolloRefetch;
};
