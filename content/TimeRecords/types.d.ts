import { Day, Record } from '@types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {};

export type TimeRecordsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Zeiterfassung'>;
};

export type FindRecordsObject = {
  loading: boolean;
  record: Record;
  refetch: ApolloRefetch;
};

export type GetRecordObject = {
  record?: Record;
  refetch: () => void;
};

export type WeekObject = {
  time: number;
  holidays: Holiday[];
  breaks: number;
  default: number;
};

export type DayQueryResult = {
  data: {
    objects: {
      findDay: {
        results: Array<Day>;
      };
    };
  };
};

export type DateMonthRecord = WeekObject;

export type WeekDateObject = {
  [key: string]: {
    label: string;
    date: string;
    days: (Day | Holiday)[];
  };
};

export type GetRecordObject = {
  loading: boolean;
  record: Record;
  refetch: ApolloRefetch;
};
