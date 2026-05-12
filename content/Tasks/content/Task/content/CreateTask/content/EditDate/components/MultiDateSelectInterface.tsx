import React, { useCallback, useContext } from 'react';
import { MultiDateSelectInterfaceProps } from '../types';
import getUpcomingDates from '../functions/getUpcomingDates';
import { Task } from '@types';
import { Divider, formatDateToISO, IconButton, ThemeContext } from '@provider';
import { View } from 'react-native';
import CalendarWeekSelect from './CalendarWeekSelect';
import EditDateTimeInterface from './EditDateTimeInterface';

const MultiDateSelectInterface = ({
  date,
  category,
  onChange
}: MultiDateSelectInterfaceProps) => {
  const { applicationStyles } = useContext(ThemeContext);

  const dateTransformHandler = useCallback(
    (dates: string[]) => {
      const dateObject: Task['time'] = {
        ...date,
        dates: dates,
        next_dates: getUpcomingDates(dates).map(nextDateString =>
          formatDateToISO(new Date(nextDateString))
        )
      };

      onChange(dateObject);
    },
    [date, category]
  );

  const deleteDateHandler = useCallback(
    (index: number) => {
      const datesCopy = [...date.dates];
      datesCopy.splice(index, 1);
      const dateObject: Task['time'] = {
        ...date,
        dates: [...datesCopy]
      };
      onChange(dateObject);
    },
    [date]
  );

  return (
    <View style={applicationStyles.vertical_container}>
      <View style={applicationStyles.vertical_container}>
        {category === 'opportunity' ? (
          <CalendarWeekSelect
            dates={date.dates}
            onSave={dateTransformHandler}
            loading={false}
            disabled={false}
            max={16}
            isSearchable={false}
          />
        ) : (
          date?.dates.map((dateFromArray: string, index: number) => (
            <View key={`${dateFromArray}-${index}`}>
              <EditDateTimeInterface
                onDelete={() => deleteDateHandler(index)}
                key={`${dateFromArray}-${index}`}
                value={dateFromArray}
                onChange={(newDate: string) => {
                  const datesCopy = [...date.dates];
                  datesCopy[index] = newDate;
                  dateTransformHandler(datesCopy);
                }}
                disabled={false}
              />
            </View>
          ))
        )}
      </View>
      <Divider />
      {date.category.value === 'fixed' && (
        <IconButton
          text="Neues Datum hinzufügen"
          size="medium"
          onPress={() =>
            dateTransformHandler([...date.dates, formatDateToISO(new Date())])
          }
          icon="add"
        />
      )}
    </View>
  );
};

export default MultiDateSelectInterface;
