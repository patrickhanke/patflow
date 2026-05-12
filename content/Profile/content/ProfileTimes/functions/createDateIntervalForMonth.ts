import { eachDayOfInterval, formatISO9075 } from 'date-fns';

export const createDateIntervalForMonth: (
  year: number,
  month: number
) => string[] = (year, month) => {
  const startDay = new Date(year, month, 1);
  const endDay = new Date(year, month + 1, 0);
  const interval = eachDayOfInterval(
    {
      start: startDay,
      end: endDay
    },
    { step: 1 }
  );
  return interval.map(day => formatISO9075(day, { representation: 'date' }));
};

export default createDateIntervalForMonth;
