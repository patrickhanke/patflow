import { Holiday, Record } from '@types';
import { useParse } from '@provider';
import { useEffect, useMemo, useState } from 'react';

const useGetHolidays = ({
  template
}: {
  template?: Record['holiday_template'];
}) => {
  const { Parse, isReady } = useParse();
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const loadHolidays = async () => {
      if (!isReady) return;

      try {
        const HolidayClass = Parse.Object.extend('Holiday');
        const query = new Parse.Query(HolidayClass);

        const results = await query.find();
        setHolidays(results.map(r => r.toJSON() as unknown as Holiday));
      } catch (error) {
        console.error('Error loading holidays:', error);
        setHolidays([]);
      }
    };

    loadHolidays();
  }, [isReady, Parse]);

  const filteredHolidays = useMemo(() => {
    const filteredHolidaysArray: Holiday[] = [];
    if (holidays.length > 0 && template) {
      holidays.forEach((holiday: Holiday) => {
        if (template?.holidays?.includes(holiday.objectId)) {
          filteredHolidaysArray.push(holiday);
        }
      });
    }
    return filteredHolidaysArray;
  }, [holidays, template]);

  return {
    holidays,
    filteredHolidays
  };
};

export default useGetHolidays;
