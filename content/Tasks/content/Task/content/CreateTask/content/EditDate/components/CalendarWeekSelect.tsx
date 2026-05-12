import React, { useContext, useEffect, useMemo, useState } from 'react';
import { formatISO9075, getISOWeekYear, getWeek, startOfWeek } from 'date-fns';
import {
  Button,
  ElementSelectInterface,
  SelectElement,
  ThemeContext
} from '@provider';
import { Text, View } from 'react-native';
import styles from '../styles';

type CalendarWeekSelectProps = {
  dates: string[];
  onSave: (weeks: string[]) => void;
  loading?: boolean;
  disabled?: boolean;
  max?: number;
  isSearchable?: boolean;
};

const CalendarWeekSelect: React.FC<CalendarWeekSelectProps> = ({
  dates,
  onSave,
  loading = false,
  disabled = false,
  max = 1,
  isSearchable = false
}) => {
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const [selectedWeeks, setSelectedWeeks] = useState<SelectElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const weekElements = useMemo(() => {
    const weeks: SelectElement[] = [];
    const today = new Date();

    // Start from current week and generate 16 weeks
    for (let i = 0; i < 16; i++) {
      // Calculate the date for this iteration (current date + i weeks)
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i * 7);

      // Get the Monday of this week
      const mondayOfWeek = startOfWeek(targetDate, { weekStartsOn: 1 });

      // Get the week number and year for this specific week
      const weekNumber = getWeek(mondayOfWeek, { weekStartsOn: 1 });
      const year = getISOWeekYear(mondayOfWeek);

      // Format the Monday date as ISO string (YYYY-MM-DD)
      const mondayDate = formatISO9075(mondayOfWeek, {
        representation: 'date'
      });

      weeks.push({
        value: mondayDate,
        label: `KW ${weekNumber < 10 ? '0' + weekNumber : weekNumber} ${year}`
      });
    }

    return weeks;
  }, []);

  useEffect(() => {
    if (dates && weekElements) {
      const selectedDates = dates.map(date => {
        return weekElements.find(
          week =>
            getWeek(new Date(week.value), { weekStartsOn: 1 }) ===
            getWeek(new Date(date), { weekStartsOn: 1 })
        );
      });
      setSelectedWeeks(selectedDates.filter(Boolean) as SelectElement[]);
    }
  }, [dates, weekElements]);

  console.log({ selectedWeeks });
  console.log({ weekElements });

  return (
    <View
      style={[
        applicationStyles.section_element_container,
        { backgroundColor: themeColors.light_background }
      ]}
    >
      <View style={styles.date_container}>
        {selectedWeeks.map(week => (
          <Text style={applicationStyles.small_header}>{week.label} </Text>
        ))}
        <Button
          size="medium"
          color={themeColors.primary}
          fontColor={themeColors.white}
          onPress={() => setIsVisible(true)}
          text={
            max > 1 ? 'Kalenderwochen auswählen' : 'Kalenderwoche auswählen'
          }
        />
      </View>
      <ElementSelectInterface
        title={max > 1 ? 'Kalenderwochen auswählen' : 'Kalenderwoche auswählen'}
        elements={weekElements}
        selectedElements={selectedWeeks}
        onSelect={setSelectedWeeks}
        max={max}
        isSearchable={isSearchable}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        loading={loading}
        onSave={() => {
          onSave(selectedWeeks.map(week => week.value as string));
          setIsVisible(false);
        }}
        disabled={disabled}
        layer={2}
      />
    </View>
  );
};

export default CalendarWeekSelect;
