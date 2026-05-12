import { eachDayOfInterval, formatISO9075, setDay } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { UseCreateIntervalHook, ViewState, WeekInterval } from '../types';
import { viewSettings } from '../content/CalendarHeader';

const getInterval = (view: ViewState['value']) => {
  if (view === 'monthly') {
    return {
      interval: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      distance: 1
    };
  }
  if (view === 'quaterly') {
    return {
      interval: [0, 3, 6, 9],
      distance: 3
    };
  }
  return {
    interval: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    distance: 1
  };
};

const useCreateInterval: UseCreateIntervalHook = () => {
  const view: (typeof viewSettings)[0] = {
    label: 'Monatsansicht',
    value: 'monthly',
    is_icon: false
  };
  const getIntervalHandler = useCallback((year: number, month: number) => {
    const start = setDay(new Date(year, month, 1), 1, { weekStartsOn: 1 });
    const end = setDay(
      new Date(year, month + getInterval(view.value).distance, 0),
      0,
      { weekStartsOn: 1 }
    );

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

    return [...formatedDayInterval] as string[];
  }, []);

  const interval: WeekInterval[] = useMemo(() => {
    const startingYear = new Date().getFullYear();

    const intervalArrayOnlyDates: string[][] = [];

    getInterval(view.value).interval.forEach(number => {
      intervalArrayOnlyDates.push(getIntervalHandler(startingYear, 0 + number));
    });

    const intervalWeekArray: WeekInterval[] = [];

    intervalArrayOnlyDates.forEach(arrayElement => {
      const weekInterval: WeekInterval = [];
      for (let n = 0; n < arrayElement.length; n += 7) {
        const newArray = arrayElement.slice(n, n + 7);
        weekInterval.push({ id: n.toString(), days: newArray });
      }
      intervalWeekArray.push(weekInterval);
    });

    return intervalWeekArray;
  }, []);

  return interval;
};

export default useCreateInterval;
