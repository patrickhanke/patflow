import { Record } from '@types';

export type CalendarProps = {
  start: string;
  end: string;
  record?: Record;
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
