import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateDisplayComponent } from './types';
import { getDateStringsFromIso, ThemeContext } from '@provider';

const styles = StyleSheet.create({
  date_display_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  date_element: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  }
});

const DateDisplay = ({ date, displayType }: DateDisplayComponent) => {
  const { themeColors } = useContext(ThemeContext);
  return (
    <View style={styles.date_display_container}>
      {displayType === 'date' ||
        (displayType === 'date-and-time' && (
          <Text style={[styles.date_element, { color: themeColors.text }]}>
            {getDateStringsFromIso(date).datum}
          </Text>
        ))}
      {displayType === 'time' ||
        (displayType === 'date-and-time' && (
          <Text style={[styles.date_element, { color: themeColors.text }]}>
            {getDateStringsFromIso(date).uhrzeit}
          </Text>
        ))}
    </View>
  );
};

export default DateDisplay;
