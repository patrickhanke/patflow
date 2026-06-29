import { formatISO9075 } from 'date-fns';
import { weekdays } from '../constants';

export function convertMillisecondsToString(
  ms: number,
  showSeconds?: boolean,
  showDoubleDigits = false
): string {
  const milsec = ms < 0 ? -ms : ms;
  let hours: string | number = Math.floor(milsec / (1000 * 60 * 60));
  if (showDoubleDigits) {
    hours = hours < 10 ? '0' + hours : hours;
  }
  let minutes: string | number = Math.floor(
    (milsec % (1000 * 60 * 60)) / (1000 * 60)
  );
  minutes = minutes < 10 ? '0' + minutes : minutes;
  if (showSeconds) {
    let seconds: string | number = Math.floor((milsec % (1000 * 60)) / 1000);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (ms < 0) {
      return `-${hours}.${minutes}.${seconds}`;
    }
    return `${hours}.${minutes}.${seconds}`;
  }
  if (ms < 0) {
    return `-${hours}.${minutes}`;
  }
  return ` ${hours}.${minutes}`;
}

export function getDateFromWeek(weekNumber: number, dayIndex: number) {
  // ISO week: 0 = Monday, 6 = Sunday
  const year = new Date().getFullYear();
  // Find the first Thursday of the year (ISO week 1 contains the first Thursday)
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // Sunday = 0, so set to 7
  // Get the Monday of the first ISO week
  const firstMonday = new Date(jan4);
  firstMonday.setDate(jan4.getDate() - (jan4Day - 1));
  // Calculate the target date
  const targetDate = new Date(firstMonday);
  targetDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7 + dayIndex);
  return targetDate;
}

export const getWeekDayKeys: (
  weekNumber: number,
  start?: string,
  end?: string
) => string[] = (weekNumber, start, end) => {
  if (start && end) {
    const weekArray: string[] = [];
    const start_date = new Date(start);
    const end_date = new Date(end);
    weekdays.forEach(day => {
      const date = getDateFromWeek(weekNumber, day.id);
      if (
        start_date.getTime() < date.getTime() &&
        date.getTime() < end_date.getTime()
      ) {
        weekArray.push(formatISO9075(date, { representation: 'date' }));
      }
    });
    return weekArray;
  }

  const weekDayKeys = weekdays.map(day => {
    return formatISO9075(getDateFromWeek(weekNumber, day.id), {
      representation: 'date'
    });
  });
  return weekDayKeys;
};

export const getStringFromDate = (date: Date): string => {
  if (date) {
    return `${formatISO9075(date, { representation: 'date' })}T${formatISO9075(date, { representation: 'time' })}`;
  } else {
    throw new Error('getStringFromDate called with null or undefined date');
  }
};
