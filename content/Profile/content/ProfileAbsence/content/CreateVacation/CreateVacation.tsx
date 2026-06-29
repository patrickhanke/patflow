import {
  AppContext,
  Button,
  Divider,
  getDateObject,
  TextInput,
  ThemeContext,
  useDataHandler,
  useParse
} from '@provider';
import { Day, ErrorMessage } from '@types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import initialAbsence from './constants/initialAbsence';
import checkForConflicts from './functions/checkForConflicts';
import { CreateVacationProps } from './types';
import EditTime from './components/EditTime';
import styles from './styles';
import { formatISO9075 } from 'date-fns';
import { isEqual } from 'lodash';

const CreateVacation = ({
  record,
  setCreateTime,
  dataHasChanged,
  setDataHasChanged
}: CreateVacationProps) => {
  const { Parse, isReady } = useParse();
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [absenceState, setAbsenceState] = useState(initialAbsence(record.year));
  const { createData } = useDataHandler();
  const { user } = useContext(AppContext);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

  const [dayData, setDayData] = useState<Day[]>([]);

  const loadDays = useCallback(async () => {
    if (!isReady || !record) return;

    try {
      const DayClass = Parse.Object.extend('Day');
      const query = new Parse.Query(DayClass);

      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(user.objectId);

      query.equalTo('user', userPointer);
      query.equalTo('year', record.year);

      const results = await query.find();
      setDayData(results.map(r => r.toJSON() as unknown as Day));
    } catch (error) {
      console.error('Error loading days:', error);
      setDayData([]);
    }
  }, [isReady, Parse, record, user.objectId]);

  useEffect(() => {
    if (isReady && record) {
      loadDays();
    }
  }, [isReady, loadDays, record]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];

    if (!record) {
      errorArray.push({
        message: 'Kein Zeiteintrag vorhanden',
        id: 'no_record',
        key: 'no_record'
      });
    } else if (
      new Date(absenceState.start_date).getTime() <
      new Date(record.start_date).getTime()
    ) {
      errorArray.push({
        message: `Anfangsdatum muss nach dem ${
          getDateObject(record?.start_date).date
        } liegen`,
        id: 'date_too_early',
        key: 'date_too_early'
      });
    }

    if (
      new Date(absenceState.start_date).getTime() >
      new Date(record.end_date).getTime()
    ) {
      errorArray.push({
        message: `Anfangsdatum muss vor dem ${
          getDateObject(record?.end_date).date
        } liegen`,
        id: 'start_before_end',
        key: 'start_before_end'
      });
    }

    if (
      new Date(absenceState.end_date).getTime() <
      new Date(record.start_date).getTime()
    ) {
      errorArray.push({
        message: `Enddatum muss nach dem ${
          getDateObject(record?.start_date).date
        } liegen`,
        id: 'date_too_early',
        key: 'date_too_early'
      });
    }

    if (
      new Date(absenceState.end_date).getTime() >
      new Date(record.end_date).getTime()
    ) {
      errorArray.push({
        message: `Enddatum muss vor dem ${
          getDateObject(record?.end_date).date
        } liegen`,
        id: 'date_too_early',
        key: 'date_too_early'
      });
    }

    if (!absenceState.start_date) {
      errorArray.push({
        message: 'Anfangsdatum fehlt',
        id: 'start_date',
        key: 'start_date'
      });
    }
    if (!absenceState.end_date) {
      errorArray.push({
        message: 'Enddatum fehlt',
        id: 'end_date',
        key: 'end_date'
      });
    }
    if (
      absenceState.start_date &&
      absenceState.end_date &&
      new Date(absenceState.start_date).getTime() >
        new Date(absenceState.end_date).getTime()
    ) {
      errorArray.push({
        message: 'Anfangsdatum muss vor dem Enddatum liegen',
        id: 'start_before_end_date',
        key: 'start_before_end_date'
      });
    }
    if (dayData && absenceState.start_date && absenceState.end_date) {
      const days = dayData;

      const conflicts = checkForConflicts(
        absenceState.start_date,
        absenceState.end_date,
        days
      );

      if (conflicts.length > 0) {
        const conflictDates = conflicts.map(date => getDateObject(date)?.date);
        const conflictDatesString = conflictDates.join(', ');
        errorArray.push({
          message: `Es gibt Überschneidungen mit anderen Einträgen: ${conflictDatesString}`,
          id: 'day_conflict',
          key: 'day_conflict'
        });
      }
    }

    setErrors(errorArray);
  }, [absenceState, dayData, record]);

  const createAbsenceHandler = useCallback(async () => {
    setLoading(true);
    if (record) {
      await createData({
        className: 'Absence',
        updateObject: {
          type: absenceState.type,
          start_date: absenceState.start_date,
          end_date: absenceState.end_date,
          state: absenceState.state,
          comment: absenceState.comment,
          user: {
            __type: 'Pointer',
            className: '_User',
            objectId: user.objectId
          },
          year: record.year,
          created_by: {
            __type: 'Pointer',
            className: '_User',
            objectId: user?.objectId
          }
        }
      });
    }
    setLoading(false);
    setCreateTime(false);
  }, [absenceState, record, user]);

  useEffect(() => {
    if (
      !dataHasChanged &&
      !isEqual(absenceState, initialAbsence(record.year))
    ) {
      setDataHasChanged(true);
    }
  }, [absenceState, dataHasChanged]);

  return (
    <KeyboardAvoidingView
      style={{ paddingHorizontal: 12, paddingTop: 12 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          gap: 18,
          backgroundColor: themeColors.background
        }}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <View style={styles.time_buttons_container}>
          <EditTime
            date={
              absenceState.start_date
                ? new Date(absenceState.start_date)
                : new Date()
            }
            type="start"
            timeHandler={value => {
              setAbsenceState({
                ...absenceState,
                start_date: formatISO9075(new Date(new Date(value)), {
                  representation: 'date'
                }),
                end_date: formatISO9075(
                  new Date(
                    new Date(value).setDate(new Date(value).getDate() + 1)
                  ),
                  {
                    representation: 'date'
                  }
                )
              });
            }}
            year={record?.year}
          />
          <EditTime
            date={
              absenceState.end_date
                ? new Date(absenceState.end_date)
                : new Date()
            }
            type="end"
            timeHandler={value => {
              setAbsenceState({
                ...absenceState,
                end_date: formatISO9075(new Date(value), {
                  representation: 'date'
                })
              });
            }}
            year={record?.year}
          />
        </View>
        <View>
          <Text style={applicationStyles.label}>Kommentar</Text>
          <TextInput
            defaultValue={absenceState.comment}
            placeholder="Kommentar ..."
            onChange={(value: string) => {
              setAbsenceState({ ...absenceState, comment: value });
            }}
            multiline={true}
          />
        </View>
        <View>
          {errors.map(error => (
            <Text key={error.key} style={applicationStyles.error_message}>
              {error.message}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View>
        <Divider size="large" />
        <Button
          size="large"
          disabled={errors.length > 0 || loading}
          onPress={() => createAbsenceHandler()}
          color={themeColors.primary}
          text="Urlaubsantrag einreichen"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateVacation;
