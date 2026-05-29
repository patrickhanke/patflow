import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import CalendarDay from './content/CalendarDay';
import { Day, Record, User, UserDisplayData } from '@types';
import { formatISO9075 } from 'date-fns';
import TimeDisplay from './content/TimeDisplay';
import useGetHolidays from './hooks/useGetHolidays';
import { useParse } from '@provider';

function getDateRange(start: string | Date, end: string | Date): Date[] {
  const range: Date[] = [];
  if (!start || !end) {
    return range;
  }
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    range.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return range;
}

const Calendar = ({
  start,
  end,
  record,
  user,
  isEditable = true,
  setDays
}: {
  start: string | Date;
  end: string | Date;
  user: UserDisplayData | User;
  record: Record;
  isEditable?: boolean;
  setDays?: (days: Day[]) => void;
}) => {
  const { Parse, isReady } = useParse();
  const [dayData, setDayData] = useState<Day[]>([]);

  console.log('days', JSON.stringify(dayData, null, 2));

  // Memoize dateRange to prevent infinite loop - only recalculate when start/end change
  const dateRange = useMemo(() => getDateRange(start, end), [start, end]);
  const { holidays, filteredHolidays } = useGetHolidays({
    template: record?.holiday_template
  });

  // Memoize the date strings array to use in query
  const dateStrings = useMemo(
    () =>
      dateRange.map(date =>
        formatISO9075(date.toISOString(), { representation: 'date' })
      ),
    [dateRange]
  );

  const loadDays = useCallback(async () => {
    if (!isReady || !record) return;

    try {
      const DayClass = Parse.Object.extend('Day');
      const query = new Parse.Query(DayClass);

      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(user.objectId);

      query.equalTo('user', userPointer);
      query.containedIn('date', dateStrings);

      const results = await query.find();
      setDayData(results.map(r => r.toJSON() as unknown as Day));
    } catch (error) {
      console.error('Error loading days:', error);
      setDayData([]);
    }
  }, [isReady, Parse, record, user.objectId, dateStrings]);

  useEffect(() => {
    if (isReady && record) {
      loadDays();
    }
  }, [isReady, loadDays, record]);

  const refetch = useCallback(async () => {
    await loadDays();
  }, [loadDays]);

  const getDays = (date: string): Day[] => {
    return (
      dayData.filter(
        day =>
          day.date === formatISO9075(new Date(date), { representation: 'date' })
      ) || []
    );
  };

  useEffect(() => {
    if (setDays && dayData.length > 0) {
      setDays(dayData);
    }
  }, [dayData, setDays]);

  const isHoliday: (date: string) => string | null = useCallback(
    date => {
      const year = new Date(date).getFullYear().toString();
      const holiday = filteredHolidays.find(hd => hd.dates[year] === date);
      if (holiday) {
        return holiday.name;
      } else {
        return null;
      }
    },
    [holidays, filteredHolidays]
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {dateRange.map(date => (
        <React.Fragment key={date.toISOString()}>
          <CalendarDay date={date.toISOString()}>
            <TimeDisplay
              days={getDays(date.toISOString())}
              refetch={refetch}
              date={formatISO9075(date, { representation: 'date' })}
              isEditable={isEditable}
              holiday={isHoliday(
                formatISO9075(date, { representation: 'date' })
              )}
              record={record}
            />
          </CalendarDay>
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default Calendar;
