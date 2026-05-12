import { formatDateToISO, ThemeContext } from '@provider';
import React, { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../styles';
import DatePicker from 'react-native-date-picker';

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

  const [newTime, setNewTime] = useState<string>(date);

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
              {new Date(date).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </Pressable>
      </View>
      <DatePicker
        date={new Date(newTime)}
        mode="time"
        locale="de"
        onDateChange={newDate => {
          setNewTime(formatDateToISO(newDate));
        }}
        minuteInterval={1}
        title={type === 'start' ? 'Startzeit' : 'Endzeit'}
        is24hourSource="locale"
        modal
        open={datePicker}
        cancelText="Abbrechen"
        confirmText="Bestätigen"
        onConfirm={() => {
          setDatePicker(false);
          timeHandler(type, newTime);
        }}
        onTouchCancel={() => setDatePicker(false)}
        onCancel={() => setDatePicker(false)}
      />
    </>
  );
};

export default EditTime;
