import React, { useContext, useState, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { ThemeContext } from '@provider';
import { Button } from '@provider';
import styles from '../styles';

type EditDateTimeInterfaceProps = {
  value?: string; // Format: YYYY-MM-DD or YYYY-MM-DDTHH:MM
  onChange: (value: string) => void;
  disabled?: boolean;
  onDelete?: () => void;
};

const EditDateTimeInterface: React.FC<EditDateTimeInterfaceProps> = ({
  value,
  onChange,
  disabled = false,
  onDelete
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [datePicker, setDatePicker] = useState<'date' | 'time' | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [includeTime, setIncludeTime] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  // Parse initial value
  useEffect(() => {
    if (value) {
      // Check if value includes time (contains 'T' and has time format)
      const hasTime = value.includes('T') && !!value.split('T')[1];
      setIncludeTime(hasTime);

      // Parse YYYY-MM-DD or YYYY-MM-DDTHH:MM
      const [datePart, timePart] = value.split('T');
      const [year, month, day] = datePart.split('-').map(Number);

      if (hasTime && timePart) {
        const [hours, minutes] = timePart.split(':').map(Number);
        setSelectedDate(new Date(year, month - 1, day, hours, minutes));
      } else {
        setSelectedDate(new Date(year, month - 1, day));
      }
    }
  }, [value]);

  const formatOutput = (date: Date, withTime: boolean): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (withTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return `${year}-${month}-${day}`;
  };

  const formatDisplay = (date: Date, withTime: boolean): string => {
    if (withTime) {
      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = () => {
    setSelectedDate(tempDate);
    onChange(formatOutput(tempDate, includeTime));
    setDatePicker(undefined);
  };

  const handleTimeConfirm = () => {
    setSelectedDate(tempDate);
    onChange(formatOutput(tempDate, true));
    setDatePicker(undefined);
  };

  const handleTimeToggle = () => {
    const newIncludeTime = !includeTime;
    setIncludeTime(newIncludeTime);
    onChange(formatOutput(selectedDate, newIncludeTime));
  };

  return (
    <View
      style={[
        applicationStyles.section_element_container,
        { backgroundColor: themeColors.light_background }
      ]}
    >
      <View style={styles.date_container}>
        {onDelete && (
          <Pressable
            style={[
              styles.delete_button,
              { backgroundColor: themeColors.dark }
            ]}
            onPress={onDelete}
          >
            <Text>
              <AntIcons name="delete" size={12} color={themeColors.white} />;
            </Text>
          </Pressable>
        )}
        {/* Date Display */}
        <Pressable
          hitSlop={6}
          onPress={() => {
            if (!disabled) {
              setTempDate(selectedDate);
              setDatePicker('date');
            }
          }}
          disabled={disabled}
        >
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
              {formatDisplay(selectedDate, includeTime)}
            </Text>
          </View>
        </Pressable>

        {/* Time Toggle Button */}
        <View style={applicationStyles.horizontal_container}>
          <Button
            text={includeTime ? 'Uhrzeit entfernen' : 'Uhrzeit hinzufügen'}
            size="small"
            color={includeTime ? themeColors.primary : 'transparent'}
            borderColor={themeColors.primary}
            fontColor={includeTime ? themeColors.white : themeColors.primary}
            onPress={handleTimeToggle}
            disabled={disabled}
          />
          {/* Edit Time Button - Only visible when time is included */}
          {includeTime && (
            <Button
              text="Uhrzeit ändern"
              size="small"
              color="transparent"
              borderColor={themeColors.text}
              fontColor={themeColors.text}
              onPress={() => {
                if (!disabled) {
                  setTempDate(selectedDate);
                  setDatePicker('time');
                }
              }}
              disabled={disabled}
            />
          )}
        </View>
      </View>

      {/* Date Picker */}
      <DatePicker
        date={tempDate}
        mode="date"
        locale="de"
        onDateChange={newDate => setTempDate(newDate)}
        modal
        open={datePicker === 'date'}
        cancelText="Abbrechen"
        confirmText="Bestätigen"
        onConfirm={handleDateConfirm}
        onTouchCancel={() => setDatePicker(undefined)}
        onCancel={() => setDatePicker(undefined)}
      />

      {/* Time Picker */}
      <DatePicker
        date={tempDate}
        mode="time"
        locale="de"
        onDateChange={newDate => setTempDate(newDate)}
        minuteInterval={1}
        is24hourSource="locale"
        modal
        open={datePicker === 'time'}
        cancelText="Abbrechen"
        confirmText="Bestätigen"
        onConfirm={handleTimeConfirm}
        onTouchCancel={() => setDatePicker(undefined)}
        onCancel={() => setDatePicker(undefined)}
      />
    </View>
  );
};

export default EditDateTimeInterface;
