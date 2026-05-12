import { ViewState } from './content/CalendarHeader/types';

export type CalendarDayElement = {
  dataType: string;
  dataLength: number;
  dataColor: string;
  dataTitle: string;
  dataIndex: number;
  [key: string]: any;
};

export type CalendarData = { [key: string]: CalendarDayElement[] };

export type CalendarProps = {
  data: CalendarData;
};

export type DayWithLength = Day & { length: number; index: number };

export type Week = {
  id: string;
  days: string[];
};

export type WeekInterval = Week[];

export type UseCreateIntervalHook = () => WeekInterval[];

export type ViewState = ViewState;
