import React, { FC, useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EditBreaksProps } from '../types';
import styles from '../styles';
import { Button, Divider, getStringFromDate, ThemeContext } from '@provider';
import DatePicker from 'react-native-date-picker';
import { formatISO9075 } from 'date-fns';

const EditBreaks: FC<EditBreaksProps> = ({
  breakItem,
  setBreak,
  disabled = false,
  deleteBreak
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [datePicker, setDatePicker] = useState<'start' | 'end' | undefined>();

  const [breakStart, setBreakStart] = useState(new Date(breakItem.start));
  const [breakEnd, setBreakEnd] = useState(new Date(breakItem.end));

  return (
    <View
      style={[
        styles.break_container,
        { backgroundColor: themeColors.light_background }
      ]}
    >
      <View
        style={[
          applicationStyles.vertical_container,
          { alignItems: 'stretch', flex: 1 }
        ]}
      >
        <View style={[applicationStyles.horizontal_container, { flex: 1 }]}>
          <Text
            style={[
              styles.edit_time_display_label_pause,
              { color: themeColors.text }
            ]}
          >
            Beginn / Ende
          </Text>
          <View style={[applicationStyles.button_container]}>
            <Pressable
              hitSlop={6}
              onPress={() => setDatePicker('start')}
              disabled={disabled}
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
                    styles.edit_time_display_text_pause,
                    {
                      color: disabled
                        ? themeColors.light_font
                        : themeColors.text
                    }
                  ]}
                >
                  {new Date(breakItem.start).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </Pressable>
            <Text>/</Text>
            <Pressable
              hitSlop={6}
              onPress={() => setDatePicker('end')}
              disabled={disabled}
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
                    styles.edit_time_display_text_pause,
                    {
                      color: disabled
                        ? themeColors.light_font
                        : themeColors.text
                    }
                  ]}
                >
                  {new Date(breakItem.end).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <DatePicker
          date={datePicker === 'start' ? breakStart : breakEnd}
          mode="time"
          locale="de"
          onDateChange={newDate => {
            if (datePicker === 'start') {
              setBreakStart(newDate);
            } else {
              setBreakEnd(newDate);
            }
          }}
          minuteInterval={1}
          title={datePicker === 'start' ? 'Startzeit' : 'Endzeit'}
          is24hourSource="locale"
          modal
          open={datePicker === 'start' || datePicker === 'end'}
          cancelText="Abbrechen"
          confirmText="Bestätigen"
          onConfirm={() => {
            setBreak({
              ...breakItem,
              start: formatISO9075(getStringFromDate(breakStart)),
              end: formatISO9075(getStringFromDate(breakEnd))
            });
            setDatePicker(undefined);
          }}
          onTouchCancel={() => setDatePicker(undefined)}
          onCancel={() => setDatePicker(undefined)}
        />
        <Divider />
        <Button
          size="small"
          color={'transparent'}
          text="Pause löschen"
          borderColor={themeColors.red}
          fontColor={themeColors.red}
          onPress={() => {
            deleteBreak();
          }}
        />
      </View>
    </View>
  );
};

export default EditBreaks;
