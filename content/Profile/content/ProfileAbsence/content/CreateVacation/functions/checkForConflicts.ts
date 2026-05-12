import { Day } from '@types';
import { eachDayOfInterval, formatISO9075 } from 'date-fns';
import { cloneDeep } from 'lodash';

const checkForConflicts = (
  start_date: string,
  end_date: string,
  days: Day[]
) => {
  const doubleBookedDays: string[] = [];
  const daysCopy = cloneDeep(days);

  const timesArryay = daysCopy.map(day => day.date);
  const start = new Date(start_date);
  const end = new Date(end_date);
  const dayInterval = eachDayOfInterval(
    {
      start,
      end
    },
    { step: 1 }
  );

  const formatedDayInterval = dayInterval.map(day =>
    formatISO9075(day, { representation: 'date' })
  );

  formatedDayInterval.forEach(day => {
    if (timesArryay.includes(day as string)) {
      doubleBookedDays.push(day);
    }
  });

  return doubleBookedDays;
};

export default checkForConflicts;
