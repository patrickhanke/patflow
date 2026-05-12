import React, { FC, useContext, useMemo } from 'react';
import { DateDisplyProps } from '../types';
import { Text, View } from 'react-native';
import { getStyles } from '../styles';
import { ThemeContext, weekdays } from '@provider';

const DateDisplay: FC<DateDisplyProps> = ({ date }) => {
  const renderDate = new Date(date);
  const { themeColors } = useContext(ThemeContext);

  const weekDayShort = useMemo(() => {
    const jsDay = renderDate.getDay(); // 0 (Sun) - 6 (Sat)
    // Find the weekday object in weekdays where id matches jsDay
    const found = weekdays.find(wd => wd.iso_id === jsDay);
    return found ? found.short : '';
  }, [renderDate]);

  return (
    <View style={getStyles(themeColors).date_container}>
      <Text style={getStyles(themeColors).weekday}>{weekDayShort}</Text>
      <Text style={getStyles(themeColors).day}>
        {renderDate.getDate() < 10
          ? `0${renderDate.getDate()}`
          : renderDate.getDate()}
      </Text>
    </View>
  );
};

export default DateDisplay;
