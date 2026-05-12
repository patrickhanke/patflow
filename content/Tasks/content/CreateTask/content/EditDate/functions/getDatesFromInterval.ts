import { DateObjectWithNextDates } from '@repo/types';
import {
  Day,
  eachMonthOfInterval,
  eachWeekOfInterval,
  formatISO9075,
  getDay
} from 'date-fns';

const getDatesFromInterval: (dateObject: DateObjectWithNextDates) => {
  allDates: string[];
  nextDates: string[];
} = dateObject => {
  if (
    dateObject.end_date &&
    new Date(dateObject.end_date).getTime() < new Date().getTime()
  ) {
    return {
      allDates: [],
      nextDates: []
    };
  }

  const year = new Date().getFullYear();
  const start = new Date(dateObject.start_date);
  const end = dateObject.end_date
    ? new Date(dateObject.end_date)
    : new Date(year + 1, 11, 31);

  console.log(end);

  if (dateObject.interval.unit === 'days' && dateObject.start_date) {
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();

    const interval = [];

    for (
      let date = start;
      date <= end;
      date.setDate(date.getDate() + (Number(dateObject.interval.number) || 1))
    ) {
      interval.push(new Date(date));
    }

    const filteredInterval = interval.filter(date => date > new Date());

    return {
      allDates: interval.map(date =>
        formatISO9075(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startHours,
            startMinutes
          )
        )
      ),
      nextDates: filteredInterval.map(date =>
        formatISO9075(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startHours,
            startMinutes
          )
        )
      )
    };
  }

  if (dateObject.interval.unit === 'weeks' && dateObject.start_date) {
    const startHours = new Date(start).getHours();
    const startMinutes = new Date(start).getMinutes();

    const interval = eachWeekOfInterval(
      {
        start,
        end
      },
      {
        weekStartsOn:
          dateObject.category.value === 'opportunity'
            ? 1
            : (getDay(start) as Day),
        step: Number(dateObject.interval.number) || 1
      }
    );

    const filteredInterval = interval.filter(date => date > new Date());

    return {
      allDates: interval.map(date =>
        formatISO9075(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startHours,
            startMinutes
          )
        )
      ),
      nextDates: filteredInterval.map(date =>
        formatISO9075(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startHours,
            startMinutes
          )
        )
      )
    };
  }
  if (dateObject.interval.unit === 'months' && dateObject.start_date) {
    const startHours = new Date(start).getHours();
    const startMinutes = new Date(start).getMinutes();
    const startDate = new Date(start).getDate();

    const interval = eachMonthOfInterval(
      {
        start,
        end
      },
      {
        step: Number(dateObject.interval.number) || 1
      }
    );

    const filteredInterval = interval.filter(date => date > new Date());

    const allDates = interval.map(date =>
      formatISO9075(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          startDate,
          startHours,
          startMinutes
        )
      )
    );
    return {
      allDates: allDates,
      nextDates: filteredInterval.map(date =>
        formatISO9075(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            startDate,
            startHours,
            startMinutes
          )
        )
      )
    };
  }
  return {
    allDates: [],
    nextDates: []
  };
};

export default getDatesFromInterval;
