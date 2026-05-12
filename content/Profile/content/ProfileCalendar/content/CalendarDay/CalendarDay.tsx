import React, { useContext, useMemo } from 'react';
import { CalendarDayProps } from './types';
import styles from './styles';
import { isMonday, isToday } from 'date-fns';
import { Text, View } from 'react-native';
import { ThemeContext } from '@provider';

const CalendarDay = ({ day, currentInterval = [], data }: CalendarDayProps) => {
  const { themeColors } = useContext(ThemeContext);
  const values = useMemo(() => {
    const dayLabel = new Date(day).getDate();
    return {
      dayLabel
    };
  }, []);

  const isOutOfInterval = !currentInterval.includes(day);

  return (
    <View
      style={[
        styles.data_container,
        isOutOfInterval && {
          backgroundColor: 'transparent'
        }
      ]}
    >
      <View
        style={[
          styles.day_label_container,
          {
            backgroundColor: isToday(new Date(day))
              ? themeColors.primary
              : 'transparent'
          }
        ]}
      >
        <Text
          style={{
            color: isToday(new Date(day))
              ? themeColors.light
              : !isOutOfInterval
                ? themeColors.text
                : themeColors.disabled,
            fontWeight: !isOutOfInterval ? 500 : 400
          }}
        >
          {values.dayLabel}
        </Text>
      </View>
      <View style={styles.data_element}>
        {data
          .sort((a, b) => b.length - a.length)
          .map(dataElement => {
            return (
              <View
                key={dataElement.objectId}
                style={[
                  styles.data_element,
                  { backgroundColor: dataElement.dataColor || 'grey' },
                  dataElement.index === 0 && {
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6
                  },
                  dataElement.index === dataElement.length - 1 && {
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    width: '80%'
                  }
                ]}
              >
                <View>
                  {(dataElement.dataIndex === 0 || isMonday(new Date(day))) && (
                    <Text
                      style={[
                        styles.data_element_label,
                        { color: themeColors.text }
                      ]}
                    >
                      {dataElement.dataTitle}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default CalendarDay;
