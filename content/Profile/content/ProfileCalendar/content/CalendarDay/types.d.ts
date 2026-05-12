import { CalendarData } from '../../types';

export type CalendarDayProps = {
  day: string;
  currentInterval: string[];
  data: CalendarData[string];
};
