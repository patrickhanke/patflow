import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { ThemeContext } from '../../../context/Theme';

export type DateTimePickerModalProps = {
  date: Date;
  mode: 'date' | 'time';
  open: boolean;
  locale?: string;
  minuteInterval?: number;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  cancelText?: string;
  confirmText?: string;
  onDateChange?: (date: Date) => void;
  onConfirm?: (date?: Date) => void;
  onCancel?: () => void;
  onTouchCancel?: () => void;
};

const DateTimePickerModal = ({
  date,
  mode,
  open,
  locale = 'de',
  minuteInterval = 1,
  title,
  minimumDate,
  maximumDate,
  cancelText = 'Abbrechen',
  confirmText = 'Bestätigen',
  onDateChange,
  onConfirm,
  onCancel,
  onTouchCancel
}: DateTimePickerModalProps) => {
  const { themeColors } = useContext(ThemeContext);
  const [tempDate, setTempDate] = useState(date);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (open) {
      setTempDate(date);
    }
  }, [open, date]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      prevOpen.current = open;
      return;
    }

    if (open && !prevOpen.current) {
      DateTimePickerAndroid.open({
        value: date,
        mode,
        is24Hour: true,
        minuteInterval,
        minimumDate,
        maximumDate,
        onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
          if (event.type === 'set' && selectedDate) {
            onDateChange?.(selectedDate);
            onConfirm?.(selectedDate);
            return;
          }

          onCancel?.();
          onTouchCancel?.();
        }
      });
    }

    prevOpen.current = open;
  }, [
    open,
    date,
    mode,
    minuteInterval,
    minimumDate,
    maximumDate,
    onDateChange,
    onConfirm,
    onCancel,
    onTouchCancel
  ]);

  const handleDismiss = () => {
    onCancel?.();
    onTouchCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.(tempDate);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    setTempDate(selectedDate);
    onDateChange?.(selectedDate);
  };

  if (Platform.OS === 'android') {
    return null;
  }

  return (
    <Modal
      transparent
      visible={open}
      animationType="slide"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleDismiss} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: themeColors.light_background }
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: themeColors.text }]}>
              {title}
            </Text>
          ) : null}
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            locale={locale}
            minuteInterval={minuteInterval}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            is24Hour
            onChange={handleChange}
          />
          <View style={styles.actions}>
            <Pressable hitSlop={8} onPress={handleDismiss}>
              <Text style={[styles.actionText, { color: themeColors.text }]}>
                {cancelText}
              </Text>
            </Pressable>
            <Pressable hitSlop={8} onPress={handleConfirm}>
              <Text
                style={[styles.actionText, { color: themeColors.primary }]}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 16,
    paddingHorizontal: 16
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600'
  }
});

export default DateTimePickerModal;
