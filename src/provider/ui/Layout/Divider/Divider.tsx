import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DividerProps } from './types';
import { differenceInDays, isToday, isYesterday } from 'date-fns';
import { ThemeContext } from '@provider';

const Divider = ({
  text,
  date,
  showLine = false,
  size = 'small'
}: DividerProps) => {
  const { themeColors } = useContext(ThemeContext);
  const getDate = (dateString: string | undefined) => {
    if (dateString === undefined) {
      return 'Kein Datum';
    }
    if (dateString === null) {
      return 'Kein Datum';
    }
    const dateObj = new Date(dateString);
    if (isToday(dateObj)) {
      return 'Heute';
    }
    if (isYesterday(dateObj)) {
      return 'Gestern';
    }
    if (differenceInDays(new Date(), dateObj) === 2) {
      return 'Vorgestern';
    }
    return dateObj.toLocaleDateString('de-DE');
  };
  return (
    <View
      style={[
        styles.divider,
        styles[size],
        {
          borderBottomColor: themeColors.border,
          borderBottomWidth: showLine ? 0.5 : 0
        }
      ]}
    >
      {text && <Text style={styles.text_container}>{text}</Text>}
      {date && getDate(date) && (
        <Text style={styles.text_container}>{getDate(date)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 3,
    borderBottomWidth: 0.5
  },
  small: {
    paddingVertical: 3
  },
  medium: {
    paddingVertical: 6
  },
  large: {
    paddingVertical: 12
  },
  text_container: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Divider;
