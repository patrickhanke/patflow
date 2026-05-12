import { eachDayOfInterval, formatISO9075 } from 'date-fns';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import CalendarHeader from './content/CalendarHeader';
import useCreateInterval from './hooks/useCreateInterval';
import { ActivityIndicator, View } from 'react-native';
import styles from './styles';
import { Absence, User } from '@types';
import { ThemeContext, useParse } from '@provider';
import CalendarDay from './content/CalendarDay';
import { get, set } from 'lodash';
import absence_type_options from '../ProfileAbsence/constants/absence_type_options';
import { CalendarData } from './types';

const ProfileCalendar = () => {
  const [intervalIndex, setIntervalIndex] = useState(new Date().getMonth());
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [staff, setStaff] = useState<User[]>([]);

  const year = new Date().getFullYear();
  const interval = useCreateInterval();

  const loadData = useCallback(async () => {
    if (!isReady) return;

    setLoading(true);
    try {
      // Load absences
      const AbsenceClass = Parse.Object.extend('Absence');
      const absenceQuery = new Parse.Query(AbsenceClass);
      absenceQuery.equalTo('year', year);

      const absenceResults = await absenceQuery.find();
      setAbsences(absenceResults.map(r => r.toJSON() as Absence));

      // Load staff
      const UserClass = Parse.Object.extend('_User');
      const staffQuery = new Parse.Query(UserClass);

      const staffResults = await staffQuery.find();
      setStaff(staffResults.map(r => r.toJSON() as User));
    } catch (error) {
      console.error('Error loading data:', error);
      setAbsences([]);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, year]);

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady, loadData]);

  const currentInterval: string[] = useMemo(() => {
    let dayInterval: Date[] = [];

    const start = new Date(year, intervalIndex, 1);
    const end = new Date(year, intervalIndex + 1, 0);
    dayInterval = eachDayOfInterval(
      {
        start,
        end
      },
      { step: 1 }
    );

    return dayInterval.map(day =>
      formatISO9075(day, { representation: 'date' })
    );
  }, [interval, intervalIndex, year]);

  const calendarData = useMemo(() => {
    const data: CalendarData = {};
    if (staff.length === 0) {
      return data;
    }
    absences.forEach((absence: Absence) => {
      if (absence.state === 'approved') {
        const start = new Date(absence.start_date);
        const end = new Date(absence.end_date);
        const dayInterval = eachDayOfInterval(
          {
            start,
            end
          },
          { step: 1 }
        );
        dayInterval
          .map(day => formatISO9075(day, { representation: 'date' }))
          .forEach((day, index) => {
            const dayElement = get(data, day, undefined);

            if (!dayElement) {
              set(data, day, [
                {
                  ...absence,
                  dataType: 'absence',
                  dataColor: absence.user.color,
                  dataLength: dayInterval.length,
                  dataIndex: index,
                  dataTitle: `${absence.user.first_name} ${absence.user.last_name} - ${absence_type_options.find(option => option.value === absence.type)?.label}`
                }
              ]);
            } else {
              data[day].push({
                ...absence,
                dataType: 'absence',
                dataColor: absence.user.color,
                dataLength: dayInterval.length,
                dataIndex: index,
                dataTitle: absence.type
              });
            }
          });
      }
    });

    return data;
  }, [absences, staff]);

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
        <CalendarHeader
          intervalIndex={intervalIndex}
          setIntervalIndex={setIntervalIndex}
        />
        <View style={styles.calendar_container}>
          {interval.length > 0 &&
            interval[intervalIndex].map(week => (
              <View
                key={week.id}
                style={[
                  styles.days_container,
                  { borderTopColor: themeColors.border }
                ]}
              >
                {week.days.map((day: string) => (
                  <CalendarDay
                    key={day}
                    day={day}
                    currentInterval={currentInterval}
                    data={calendarData[day] || []}
                  />
                ))}
              </View>
            ))}
        </View>
      </View>
      <View style={applicationStyles.section_bottom_container} />
    </View>
  );
};

export default ProfileCalendar;
