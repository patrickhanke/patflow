import { Day, Record } from '@types';
import { eachDayOfInterval, formatISO9075 } from 'date-fns';
import { cloneDeep, filter } from 'lodash';
import { useCallback, useMemo } from 'react';
import { MonthArray, TimeDay, TimesMemo } from '../types';
import { getSaldo, months } from '@provider';

const useGetTimes = ({
  record,
  dayData
}: {
  record: Record;
  dayData: Day[];
}) => {
  const getDayFromDate = useCallback(
    (date: string) => {
      let day: TimeDay = {
        date,
        time: 0,
        saldo: 0,
        type: 'work',
        dayObject: undefined
      };
      const dayDataElements =
        filter(dayData || [], (wd: Day) => wd.date === date) || [];

      if (dayDataElements.length > 0) {
        let saldo = 0;
        let type: TimeDay['type'] = 'work';
        let time = 0;

        dayDataElements.forEach((dayDataElement: Day) => {
          type = dayDataElement.type;
          saldo += dayDataElement.saldo;
          if (dayDataElement.time) {
            time += dayDataElement.time.duration - dayDataElement.time.pause;
          }
        });
        day.saldo = saldo;
        day.type = type;
        day.time = time;
      } else {
        const recordDefaultTime = record?.default_times.find(
          element => element?.date === date
        );
        day.saldo = getSaldo(null, recordDefaultTime?.default_time);
      }

      return day;
    },
    [record, dayData]
  );

  const times: TimesMemo = useMemo(() => {
    const monthArray: MonthArray = cloneDeep(months).map(month => ({
      ...month,
      days: [],
      saldo: 0
    }));

    const timesArray: Day[] = [];

    const year = new Date().getFullYear();
    const interval = eachDayOfInterval({
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31)
    });

    interval.forEach((date: Date) => {
      const month = date.getMonth();

      const monthIndex = monthArray.findIndex(
        (mt: MonthArray[number]) => mt.id === month
      );
      const day = getDayFromDate(
        formatISO9075(date, { representation: 'date' })
      );

      monthArray[monthIndex].days.push(day);
      if (typeof day.saldo === 'number' && !isNaN(day.saldo)) {
        monthArray[monthIndex].saldo += day.saldo;
      }
    });

    return {
      timesArray: timesArray,
      monthArray
    };
  }, [dayData]);

  return times;
};

export default useGetTimes;
