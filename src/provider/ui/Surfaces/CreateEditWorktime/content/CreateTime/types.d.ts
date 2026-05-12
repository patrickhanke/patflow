import { DayTime, MonthDayTime } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type CreateTimeProps = {
  initialTime?: DayTime | DefaultDayTime;
  date: string;
  id?: string;
  refetch?: () => Promise<void>;
  afterSaveHandler?: (success?: boolean) => void;
  dataHasChanged?: boolean;
  setDataHasChanged?: Dispatch<SetStateAction<boolean>>;
  discardTimeHandler?: () => void;
};

export type WeekDayState = [
  ...MonthDayTime,
  Dispatch<SetStateAction<MonthDayTime>>
];

export type DefaultDayTime = {
  start: string;
  end: string;
  pause: number;
  comment: string;
  duration: number;
  type: 'regular';
  state: 'created';
  breaks: { start: string; end: string; id: string }[];
};

export type EditBreaksProps = {
  breakItem: DayTime['breaks'][number];
  setBreak: (T: DayTime['breaks'][number]) => void;
  disabled?: boolean;
  deleteBreak: () => void;
};
