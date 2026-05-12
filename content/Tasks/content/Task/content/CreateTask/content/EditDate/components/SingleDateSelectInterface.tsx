import React, { useCallback, useMemo } from 'react';
import { SingleDateSelectInterfaceProps } from '../types';
import { View } from 'react-native';
import { DateObject } from '@types';
import CalendarWeekSelect from './CalendarWeekSelect';
import EditDateTimeInterface from './EditDateTimeInterface';

const SingleDateSelectInterface = ({
  date,
  category,
  onChange
}: SingleDateSelectInterfaceProps) => {
  const dateTransformHandler = useCallback(
    (dates: string[]) => {
      const dateObject: DateObject = {
        ...date,
        dates: dates,
        next_dates: dates
      };

      onChange(dateObject);
    },
    [date, category]
  );

  const renderDateSelect = useMemo(
    () =>
      date.category.value === 'opportunity' ? (
        <CalendarWeekSelect
          dates={date.dates}
          onSave={dateTransformHandler}
          loading={false}
          disabled={false}
          max={1}
          isSearchable={false}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <EditDateTimeInterface
            value={date.dates[0]}
            onChange={(newDate: string) => dateTransformHandler([newDate])}
            disabled={false}
          />
        </View>
      ),
    [date]
  );

  return <View style={{ flex: 1 }}>{renderDateSelect}</View>;
};

export default SingleDateSelectInterface;
