import { StyleSheet } from 'react-native';
import { ThemeColors } from '@provider';

export const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    calendar_container: {
      flex: 1,
      paddingVertical: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: themeColors.border
    },
    dateText: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    dayText: {
      fontSize: 16,
      color: '#666'
    },
    date_container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 3,
      paddingRight: 12,
      width: 66,
      gap: 0,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: themeColors.border
    },
    day: {
      fontSize: 36,
      fontWeight: '500',
      lineHeight: 36,
      color: themeColors.text
    },
    weekday: {
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 2,
      margin: 0,
      color: themeColors.text
    }
  });
