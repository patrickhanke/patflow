import {
  Calendar,
  convertMillisecondsToString,
  months,
  SwitchButtons,
  ThemeContext
} from '@provider';
import { Day, UserDisplayData } from '@types';
import React, { useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import useGetRecords from './hooks/useGetRecords';
import { MonthData, SelectedMonth } from './types';
import styles from './styles';
import createDateIntervalForMonth from './functions/createDateIntervalForMonth';
import findDefaultTimeForDate from './functions/findDefaultTimeForDate';

const ProfileTimes = ({ user }: { user: UserDisplayData }) => {
  const { applicationStyles } = useContext(ThemeContext);

  const [days, setDays] = useState<Day[]>([]);

  const { record, loading, records } = useGetRecords({
    userId: user.objectId,
    year: new Date().getFullYear(),
    date: new Date().toISOString()
  });

  console.log({ record });

  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>({
    id: new Date().getMonth(),
    value: new Date().getMonth(),
    label: months[new Date().getMonth()].label
  });

  const monthData = useMemo(() => {
    const monthArray: MonthData[] = [];
    let totalSaldo = 0;
    let totalTarget = 0;
    let totalTimes = 0;

    let result = {
      month: '',
      monthSaldo: '',
      target: '',
      monthTimes: ''
    };

    if (!days && !record) {
      return { monthArray, result };
    }

    const year = new Date().getFullYear();
    const month: (typeof months)[number] =
      months.find((m: { id: number }) => m.id === selectedMonth.id) ||
      months[new Date().getMonth()];

    const dateInterval = createDateIntervalForMonth(year, month.id);
    let target = 0;
    let monthTimes = 0;
    const record_default_times = dateInterval.map((dateElement: string) =>
      findDefaultTimeForDate(dateElement, records || [])
    );
    record_default_times.forEach(element => {
      let default_time = 0;
      if (element.default_time?.type === 'regular') {
        default_time =
          element.default_time?.duration - element.default_time?.pause;
      }
      target += default_time;
    });
    if (days && record) {
      dateInterval.forEach(dayString => {
        const dayArray = days.filter(
          (dayToFind: Day) => dayToFind.date === dayString
        );

        if (dayArray.length > 1) {
          dayArray.forEach((day: Day) => {
            if (day && day.type === 'work') {
              const time = day.time;
              let timeSpan = 0;
              if (time) {
                timeSpan = time?.duration - time?.pause;
              }
              monthTimes += timeSpan;
            }
          });
        } else if (dayArray.length === 1) {
          const day = dayArray[0];
          if (day && day.type === 'work') {
            const time = day.time;
            let timeSpan = 0;
            if (time) {
              timeSpan = time.duration - time.pause;
            }
            monthTimes += timeSpan;
          } else if (day && day.type === 'absence') {
            if (day.is_working_day) {
              monthTimes += day.default_time
                ? day.default_time.duration - day.default_time.pause
                : 0;
            }
          }
        }
      });
    }
    totalSaldo += monthTimes - target;
    totalTarget += target;
    totalTimes += monthTimes;
    monthArray.push({
      id: month.id,
      value: month.value,
      month: month.label,
      monthSaldo: convertMillisecondsToString(monthTimes - target),
      target: convertMillisecondsToString(target),
      monthTimes: convertMillisecondsToString(monthTimes)
    });

    result = {
      month: 'Gesamt',
      monthSaldo: convertMillisecondsToString(totalSaldo),
      target: convertMillisecondsToString(totalTarget),
      monthTimes: convertMillisecondsToString(totalTimes)
    };

    return {
      monthArray,
      result
    };
  }, [days, record, selectedMonth]);

  // Memoized first and last date of the selected month for the current year
  const selectedMonthRange = useMemo(() => {
    if (!selectedMonth) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { firstDate: firstDay, lastDate: lastDay };
    }
    const year = new Date().getFullYear();
    const month = selectedMonth.id;
    const firstDate = new Date(year, month, 1);
    // Last day: set date to 0 of next month to get last day of current month
    const lastDate = new Date(year, month + 1, 0);
    return { firstDate, lastDate };
  }, [selectedMonth]);

  const currentMonth = useMemo(() => {
    const month = monthData.monthArray.find(mon => mon.id === selectedMonth.id);
    if (month) {
      return month;
    }
    // Fallback to current month if not found
  }, [selectedMonth, monthData]);

  if (loading) {
    return (
      <View style={applicationStyles.loading_container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={applicationStyles.section_container}>
        <View style={[styles.select_container]}>
          <SwitchButtons
            buttonStates={months.map(month => ({
              value: month.id,
              label: month.short,
              id: month.id
            }))}
            currentState={selectedMonth}
            changeHandler={value => setSelectedMonth(value as SelectedMonth)}
          />
        </View>
        {record ? (
          <Calendar
            start={selectedMonthRange.firstDate}
            end={selectedMonthRange.lastDate}
            user={user}
            record={record}
            isEditable={false}
            setDays={setDays}
          />
        ) : (
          <Text>Kein Zeiteintrag gefunden</Text>
        )}
      </View>
      <View style={applicationStyles.section_bottom_container}>
        <View style={[applicationStyles.horizontal_container]}>
          <Text style={applicationStyles.small_header}>Monatssaldo:</Text>
          <Text style={applicationStyles.small_header}>
            {currentMonth ? currentMonth.monthTimes : '-'}
            {' /'}
            {currentMonth ? currentMonth.target : '-'} Std.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileTimes;
