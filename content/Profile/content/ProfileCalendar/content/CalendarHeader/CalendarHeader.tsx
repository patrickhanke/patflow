import React from 'react';
import { CalendarHeaderProps } from './types';
import { View } from 'react-native';
import styles from './styles';
import { months, SwitchButtons } from '@provider';

const CalendarHeader = ({
  intervalIndex,
  setIntervalIndex
}: CalendarHeaderProps) => {
  const switchButtonArray = months.map(month => ({
    value: month.id,
    label: month.short,
    id: month.id
  }));

  return (
    <View style={styles.calendar_header_container}>
      <View style={[styles.select_container, { minHeight: 30, flex: 1 }]}>
        <SwitchButtons
          buttonStates={switchButtonArray}
          currentState={switchButtonArray[intervalIndex]}
          changeHandler={value => setIntervalIndex(value.value as number)}
        />
      </View>
    </View>
  );
};

export default CalendarHeader;
