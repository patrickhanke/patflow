import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import DateDisplay from './components/DateDisplay';
import { ThemeContext } from '@provider';
import { CalendarDayProps } from './types';
import { isWeekend } from 'date-fns';

const CalendarDay: FC<CalendarDayProps> = ({ date, children }) => {
  const { themeColors } = useContext(ThemeContext);

  return (
    <View
      style={[
        getStyles(themeColors).calendar_container,
        {
          backgroundColor: isWeekend(new Date(date))
            ? themeColors.light_background
            : 'transparent'
        }
      ]}
    >
      <DateDisplay date={date} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

export default CalendarDay;
