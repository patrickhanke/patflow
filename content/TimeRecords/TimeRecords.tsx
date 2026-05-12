import {
  AppContext,
  Calendar,
  convertMillisecondsToString,
  getWeekDayKeys,
  SwitchButtons,
  ThemeContext,
  UnderlineSwitchButtons,
  useDataStore
} from '@provider';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import weekdays from './constants/weekdays';
import { formatISO9075, getISODay, getWeek, getYear } from 'date-fns';
import { Day } from '@types';
import { WeekDateObject, WeekObject } from './types';
import Timer from './content/Timer';
import { cloneDeep, get, set } from 'lodash';
import button_states from './constants/button_states';

const TimeRecords = () => {
  const { user, isConnected } = useContext(AppContext);
  const [siteState, setSiteState] = React.useState<
    (typeof button_states)[number]
  >(button_states[0]);

  const { applicationStyles } = useContext(ThemeContext);
  const [days, setDays] = React.useState<Day[]>([]);
  const [resetTimer] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentWeekKey, setCurrentWeekKey] = useState<string>(() => {
    const now = new Date();
    return `${getYear(now)}-${getWeek(now, { weekStartsOn: 1 })}`;
  });
  const { currentRecord } = useDataStore();

  useEffect(() => {
    const newCurrentWeek = getWeek(new Date(), { weekStartsOn: 1 });
    if (newCurrentWeek !== currentWeek) {
      setCurrentWeek(newCurrentWeek);
    }
  }, [currentWeek]);

  useFocusEffect(
    React.useCallback(() => {
      const now = new Date();
      const weekKey = `${getYear(now)}-${getWeek(now, { weekStartsOn: 1 })}`;
      if (weekKey !== currentWeekKey) {
        setCurrentWeekKey(weekKey);
      }
    }, [currentWeekKey])
  );

  const weeks = useMemo(() => {
    const week = currentWeek;

    return {
      lastWeek: { value: week - 1, label: 'Letzte Woche' },
      thisWeek: { value: week, label: 'Diese Woche' },
      options: [
        { value: week - 1, label: 'Letzte Woche' },
        { value: week, label: 'Diese Woche' }
      ]
    };
  }, [currentWeek, currentWeekKey]);

  const [selectedWeek, setSelectedWeek] = React.useState(weeks.options[1]);

  useEffect(() => {
    setSelectedWeek(weeks.thisWeek);
  }, [weeks.thisWeek]);

  const weekData = useMemo(() => {
    const wk = selectedWeek.value || currentWeek;
    const wks = getWeekDayKeys(wk);

    const weekObject: WeekObject = {
      default: 0,
      time: 0,
      breaks: 0,
      holidays: []
    };

    const weekDateObject: WeekDateObject = {};
    wks.forEach((date: string) => {
      const week = weekdays.find(wd => wd.id === getISODay(date) - 1);
      weekDateObject[date] = {
        label: week?.label as string,
        date: date,
        days: []
      };

      if (currentRecord?.default_times) {
        const defaultTime = currentRecord.default_times.find(
          dt => dt.date === date
        );

        if (defaultTime?.default_time) {
          const dftime = get(weekObject, 'default', 0);
          const wt =
            defaultTime.default_time.duration - defaultTime.default_time.pause;
          set(weekObject, 'default', wt + dftime);
        }
      }
    });

    const weekDataArray: Day[] = [];

    if (days.length > 0) {
      days.forEach((day: Day) => {
        const wkdArray = Object.keys(weekDateObject);
        if (wkdArray.includes(day.date)) {
          if (day.type === 'absence' && day.is_working_day) {
            if (day.is_working_day) {
              weekObject.time += day?.default_time?.duration || 0;
              weekObject.breaks += day?.default_time?.pause || 0;
            }
          }
          if (day.type === 'work' && day?.time) {
            weekObject.time += day.time.duration;
            weekObject.breaks += day.time.pause;
          }
          const weekDaysCopy = cloneDeep(weekDateObject[day.date].days);

          weekDaysCopy.push(day);
          set(weekDateObject, `${day.date}.days`, weekDaysCopy);
        }
      });
    }

    return { weekDataArray, weekDateObject, weekObject, wks };
  }, [days, selectedWeek]);

  const disabledTimer = useMemo(() => {
    let isDisabled = false;
    weekData.weekDataArray.forEach(day => {
      const date = formatISO9075(new Date(), { representation: 'date' });

      if (date === day.date && day.time?.start && day.time?.end) {
        const newStart = new Date().getTime();
        const existingStart = new Date(day.time?.start).getTime();
        const existingEnd = new Date(day.time?.end).getTime();
        if (newStart <= existingEnd && newStart >= existingStart) {
          isDisabled = true;
        }
      }
    });

    return isDisabled;
  }, []);

  if (!isConnected) {
    return (
      <View style={applicationStyles.content_container}>
        <Text style={applicationStyles.medium_header}>
          Keine Internetverbindung
        </Text>
      </View>
    );
  }

  return (
    <View style={applicationStyles.content_container}>
      <View style={applicationStyles.section_top_container}>
        <UnderlineSwitchButtons
          buttonStates={[...button_states]}
          currentState={siteState}
          changeHandler={value =>
            setSiteState(value as (typeof button_states)[number])
          }
        />
        {/* Week Switcher */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 6
        }}
      >
        {siteState.value === 'overview' && (
          <SwitchButtons
            buttonStates={weeks.options}
            currentState={selectedWeek}
            changeHandler={value => {
              setSelectedWeek(value as { value: number; label: string });
            }}
          />
        )}
      </View>

      {!currentRecord ? (
        <View style={{ flex: 1, padding: 12 }}>
          <Text style={applicationStyles.medium_header}>
            Keine Zeiterfassung hinterlegt
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {siteState.value === 'timer' && (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Timer resetTimer={resetTimer} disabled={disabledTimer} />
            </View>
          )}
          {siteState.value === 'overview' && (
            <View
              style={[applicationStyles.section_container, { paddingTop: 12 }]}
            >
              <Calendar
                start={weekData.wks[0]}
                end={weekData.wks[6]}
                user={user}
                record={currentRecord}
                setDays={setDays}
              />
              <View style={applicationStyles.section_bottom_container}>
                <View
                  style={[
                    applicationStyles.horizontal_container,
                    { paddingBottom: 12 }
                  ]}
                >
                  <Text style={applicationStyles.small_header}>
                    Wochensaldo:
                  </Text>
                  <Text style={applicationStyles.small_header}>
                    {convertMillisecondsToString(
                      weekData.weekObject.time - weekData.weekObject.breaks
                    )}{' '}
                    / {convertMillisecondsToString(weekData.weekObject.default)}{' '}
                    Std.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TimeRecords;
