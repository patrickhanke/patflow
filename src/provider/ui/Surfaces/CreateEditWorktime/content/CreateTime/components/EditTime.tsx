import { DateTimePickerModal, ThemeContext } from '@provider';
import React, { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../styles';
import {
  absoluteDateTimeToDate,
  absoluteTimeLabel,
  toAbsoluteDateTime,
  withAbsoluteClock
} from '../../../functions/absoluteTime';

const EditTime = ({
  type,
  date,
  timeHandler,
  disabled = false
}: {
  type: 'start' | 'end';
  date: string;
  timeHandler: (type: 'start' | 'end', date: string) => void;
  disabled?: boolean;
}) => {
  const [datePicker, setDatePicker] = useState(false);
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <>
      <View
        style={[
          applicationStyles.horizontal_container,
          { flex: 1, width: '100%' }
        ]}
      >
        <Text style={applicationStyles.small_header}>
          {type === 'start' ? 'Arbeitsbeginn' : 'Arbeitsende'}
        </Text>
        <Pressable
          hitSlop={6}
          onPress={() => setDatePicker(true)}
          disabled={disabled}
          style={{ width: 60 }}
        >
          <View
            style={[
              styles.edit_time_display,
              {
                borderColor: disabled
                  ? themeColors.light_font
                  : themeColors.text
              }
            ]}
          >
            <Text
              style={[
                styles.edit_time_display_text,
                { color: disabled ? themeColors.light_font : themeColors.text }
              ]}
            >
              {absoluteTimeLabel(date)}
            </Text>
          </View>
        </Pressable>
      </View>
      <DateTimePickerModal
        date={absoluteDateTimeToDate(date) ?? new Date()}
        mode="time"
        locale="de"
        minuteInterval={1}
        title={type === 'start' ? 'Startzeit' : 'Endzeit'}
        open={datePicker}
        cancelText="Abbrechen"
        confirmText="Bestätigen"
        onConfirm={confirmedDate => {
          const time = confirmedDate
            ? withAbsoluteClock(date, confirmedDate)
            : toAbsoluteDateTime(date);
          setDatePicker(false);
          timeHandler(type, time);
        }}
        onTouchCancel={() => setDatePicker(false)}
        onCancel={() => setDatePicker(false)}
      />
    </>
  );
};

export default EditTime;
