import { DateTimePickerModal, ThemeContext } from '@provider';
import React, { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../styles';

const EditTime = ({
  type,
  date,
  timeHandler,
  year
}: {
  type: 'start' | 'end';
  date: Date;
  timeHandler: (date: Date) => void;
  year: number;
}) => {
  const [datePicker, setDatePicker] = useState(false);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [newTime, setNewTime] = useState(date);

  return (
    <>
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <Text style={applicationStyles.label}>
          {type === 'start' ? 'Urlaubsanfang' : 'Urlaubsende'}
        </Text>
        <Pressable hitSlop={6} onPress={() => setDatePicker(true)}>
          <View
            style={[
              styles.edit_time_display,
              { borderColor: themeColors.text }
            ]}
          >
            <Text
              style={[
                styles.edit_time_display_text,
                { color: themeColors.text }
              ]}
            >
              {new Date(date).toLocaleDateString('de-DE')}
            </Text>
          </View>
        </Pressable>
        <View />
      </View>
      <DateTimePickerModal
        date={newTime}
        mode="date"
        locale="de"
        onDateChange={newDate => setNewTime(newDate)}
        minuteInterval={1}
        title={type === 'start' ? 'Anfang' : 'Ende'}
        open={datePicker}
        cancelText="Abbrechen"
        confirmText="Bestätigen"
        minimumDate={new Date(year, 0, 1)}
        maximumDate={new Date(year, 11, 31)}
        onConfirm={confirmedDate => {
          const nextDate = confirmedDate ?? newTime;
          setDatePicker(false);
          setNewTime(nextDate);
          timeHandler(nextDate);
        }}
        onTouchCancel={() => setDatePicker(false)}
        onCancel={() => setDatePicker(false)}
      />
    </>
  );
};

export default EditTime;
