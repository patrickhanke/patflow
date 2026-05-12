import { Dispatch, SetStateAction } from 'react';

export type CalendarHeaderProps = {
  intervalIndex: number;
  setIntervalIndex: Dispatch<SetStateAction<number>>;
};

export type IntervalSelectOptions = {
  value: number;
  label: string;
}[];
