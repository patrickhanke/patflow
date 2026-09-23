import React, { FC, useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EditBreaksProps } from '../types';
import styles from '../styles';
import { Button, DateTimePickerModal, Divider, ThemeContext } from '@provider';
import {
  absoluteDateTimeToDate,
  absoluteTimeLabel,
  toAbsoluteDateTime,
  withAbsoluteClock
} from '../../../functions/absoluteTime';

const EditBreaks: FC<EditBreaksProps> = ({
  breakItem,
  setBreak,
  disabled = false,
  deleteBreak
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [datePicker, setDatePicker] = useState<'start' | 'end' | undefined>();
  const breakStart = absoluteDateTimeToDate(breakItem.start);
  const breakEnd = absoluteDateTimeToDate(breakItem.end);

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
                  {absoluteTimeLabel(breakItem.start)}
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
                  {absoluteTimeLabel(breakItem.end)}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <DateTimePickerModal
          date={(datePicker === 'start' ? breakStart : breakEnd) ?? new Date()}
          mode="time"
          locale="de"
          minuteInterval={1}
          title={datePicker === 'start' ? 'Startzeit' : 'Endzeit'}
          open={datePicker === 'start' || datePicker === 'end'}
          cancelText="Abbrechen"
          confirmText="Bestätigen"
          onConfirm={confirmedDate => {
            setBreak({
              ...breakItem,
              start:
                datePicker === 'start' && confirmedDate
                  ? withAbsoluteClock(breakItem.start, confirmedDate)
                  : toAbsoluteDateTime(breakItem.start),
              end:
                datePicker === 'end' && confirmedDate
                  ? withAbsoluteClock(breakItem.end, confirmedDate)
                  : toAbsoluteDateTime(breakItem.end)
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
