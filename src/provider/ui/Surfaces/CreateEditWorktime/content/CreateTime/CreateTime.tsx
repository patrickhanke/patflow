import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import {
  AppContext,
  Button,
  convertMillisecondsToString,
  Divider,
  getDateObject,
  getStringFromDate,
  IconButton,
  parseErrorMessage,
  TextInput,
  ThemeContext,
  useAxiosClient,
  useFindRecordForDate
} from '@provider';
import uuid from 'react-native-uuid';

import styles from './styles';
import EditTime from './components/EditTime';
import { formatISO9075 } from 'date-fns';
import getDefaultTime from './functions/getDefaultTime';
import { CreateTimeProps, DefaultDayTime } from './types';
import { DayTime, DefaultDay, Record } from '@types';
import getDefaultDay from './functions/getDefaultDay';
import { isEqual } from 'lodash';
import EditBreaks from './components/EditBreaks';
import { getPauseTime } from './functions/getPauseTime';

const CreateTime = ({
  initialTime,
  date,
  id,
  refetch,
  afterSaveHandler,
  dataHasChanged,
  setDataHasChanged
}: CreateTimeProps) => {
  const { user, indicatorHandler, isConnected } = useContext(AppContext);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const record = useFindRecordForDate({ date });

  const axiosclient = useAxiosClient();
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState<DayTime | DefaultDayTime>(
    initialTime ? initialTime : getDefaultTime(date).time
  );

  useEffect(() => {
    if (initialTime) {
      setTime(initialTime);
    } else {
      setTime(getDefaultTime(date).time);
    }
  }, [initialTime, date]);

  useEffect(() => {
    if (setDataHasChanged) {
      if (!dataHasChanged && !isEqual(time, getDefaultTime(date).time)) {
        setDataHasChanged(true);
      }
    }
  }, [dataHasChanged, initialTime, record]);

  const timeHandler = (type: 'start' | 'end', newTime: string) => {
    let duration = 0;
    if (type === 'start') {
      duration = new Date(time.end).getTime() - new Date(newTime).getTime();
    } else {
      duration = new Date(newTime).getTime() - new Date(time.start).getTime();
    }

    setTime({
      ...time,
      [type]: newTime,
      duration
    });
  };

  const getDayFromDate = useCallback((dateToGet: string) => {
    let dayToFind: DefaultDay = getDefaultDay(dateToGet);
    const recordDefaultTime = record?.default_times.find(
      (element: Record['default_times'][number]) => element?.date === dateToGet
    );
    dayToFind.default_time = recordDefaultTime?.default_time || null;
    dayToFind.record = record || null;
    return dayToFind;
  }, []);

  const updateHandler = useCallback(
    async (day: DefaultDay) => {
      setLoading(true);
      const indicatorElement = {
        loading: 'Warte auf Verbindung ...',
        error: 'Fehler beim Erstellen',
        success: 'Arbeitszeit erfolgreich erstellt',
        id: uuid.v4() as string
      };
      indicatorHandler(indicatorElement, 'loading');

      if (day) {
        await axiosclient()
          .post('/functions/create-time', {
            time: day.time,
            date: day.date,
            day_id: id,
            user_id: user.objectId,
            comment: day.time.comment
          })
          .then(response => {
            if (response.data.result.success) {
              indicatorHandler(
                { ...indicatorElement, success: response.data.result.message },
                'success'
              );
            }
            if (!response.data.result.success) {
              indicatorHandler(
                { ...indicatorElement, error: response.data.result.error },
                'error'
              );
            }
          })
          .catch(error => {
            indicatorHandler(
              {
                ...indicatorElement,
                error: parseErrorMessage(error) || indicatorElement.error
              },
              'error'
            );
          });
      } else {
        indicatorHandler(
          { ...indicatorElement, error: 'Keine Zeiterfassung hinterlegt' },
          'error'
        );
        setLoading(false);
        return;
      }
      if (refetch) {
        await refetch();
      }
      setLoading(false);
      if (afterSaveHandler) {
        afterSaveHandler(true);
      }
    },
    [record, user, id, indicatorHandler, refetch]
  );

  console.log({ time });

  const dateButtonValues = useMemo(() => {
    let text = 'Datum wählen';
    let color = 'transparent';
    let fontColor = themeColors.text;
    let borderColor = themeColors.border;
    let isValid = true;
    if (date) {
      const day = getDayFromDate(
        formatISO9075(new Date(date), { representation: 'date' })
      );

      if (day.type === 'absence') {
        text = 'Abwesenheit';
        fontColor = themeColors.yellow;
        borderColor = themeColors.yellow;
        isValid = false;
        // } else if (days.map(daysToFind => daysToFind.date).includes(day.date)) {
        //   text = 'Für dieses Datum existiert bereits ein Eintrag';
        //   fontColor = themeColors.red;
        //   borderColor = themeColors.red;
        //   isValid = false;
      } else {
        text =
          new Date(date).toLocaleDateString('de-DE', { weekday: 'long' }) +
          ' - ' +
          new Date(date).toLocaleDateString('de-DE');
        fontColor = themeColors.primary;
        borderColor = themeColors.primary;
      }
    } else {
      isValid = false;
    }

    return { text, color, fontColor, borderColor, isValid };
  }, [themeColors, date]);

  const buttonDisabled = useMemo(() => {
    let isDisabled = false;
    if (new Date(time.start).getTime() > new Date(time.end).getTime()) {
      isDisabled = true;
    }
    if (time.pause < 0) {
      isDisabled = true;
    }
    if (loading) {
      isDisabled = true;
    }
    if (dateButtonValues.isValid === false) {
      isDisabled = true;
    }

    return isDisabled;
  }, [time, loading, dateButtonValues]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height: '100%' }}
    >
      <ScrollView
        style={{ flex: 0.3, gap: 12 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: 12
        }}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <View style={styles.date_container}>
          <Text style={applicationStyles.large_header}>
            {getDateObject(date).string}
          </Text>
        </View>
        <Divider showLine />

        <View style={styles.time_buttons_container}>
          <EditTime
            disabled={!date}
            date={time.start}
            type="start"
            timeHandler={timeHandler}
          />
          <EditTime
            disabled={!date}
            date={time.end}
            type="end"
            timeHandler={timeHandler}
          />
        </View>
        <Divider showLine />
        <View style={[applicationStyles.vertical_container, { height: 240 }]}>
          <Text
            style={[applicationStyles.small_header, { textAlign: 'center' }]}
          >
            Pause
          </Text>
          <ScrollView>
            {time?.breaks &&
              time.breaks.map(breakItem => (
                <EditBreaks
                  key={breakItem.id}
                  breakItem={breakItem}
                  setBreak={updatedBreak => {
                    const newBreaks = time.breaks.map(existingBreak =>
                      existingBreak.id === updatedBreak.id
                        ? updatedBreak
                        : existingBreak
                    );

                    setTime(prevTime => ({
                      ...prevTime,
                      breaks: newBreaks,
                      pause: getPauseTime(newBreaks)
                    }));
                  }}
                  deleteBreak={() => {
                    setTime(prevTime => ({
                      ...prevTime,
                      breaks: prevTime.breaks.filter(
                        existingBreak => existingBreak.id !== breakItem.id
                      ),
                      pause: getPauseTime(
                        prevTime.breaks.filter(
                          existingBreak => existingBreak.id !== breakItem.id
                        )
                      )
                    }));
                  }}
                />
              ))}
          </ScrollView>
          <Divider />
          <IconButton
            icon="add"
            size="small"
            text="Pause hinzufügen"
            color={themeColors.text}
            onPress={() => {
              const lastBreak = time.breaks[time.breaks.length - 1];
              let newBreak: DayTime['breaks'][number];

              if (lastBreak?.start && lastBreak?.end) {
                const newStart = getStringFromDate(
                  new Date(new Date(lastBreak.end).getTime() + 30 * 60000)
                );
                const newEnd = getStringFromDate(
                  new Date(new Date(lastBreak.end).getTime() + 60 * 60000)
                );
                newBreak = {
                  id: uuid.v4(),
                  start: newStart,
                  end: newEnd
                };
              } else {
                const newStart = getStringFromDate(
                  new Date(new Date(time.start).getTime() + 360 * 60000)
                );
                const newEnd = getStringFromDate(
                  new Date(new Date(time.start).getTime() + 420 * 60000)
                );
                newBreak = {
                  id: uuid.v4(),
                  start: newStart,
                  end: newEnd
                };
              }
              setTime(prevTime => ({
                ...prevTime,
                pause: getPauseTime([...prevTime.breaks, newBreak]),
                breaks: [...prevTime.breaks, newBreak]
              }));
            }}
          />
        </View>
        <Divider showLine />
        <View style={styles.align_center}>
          <Text
            style={[applicationStyles.small_header, { textAlign: 'center' }]}
          >
            Kommentar
          </Text>
          <TextInput
            defaultValue={time.comment}
            placeholder="Kommentar"
            onChange={description => setTime({ ...time, comment: description })}
            multiline={true}
          />
        </View>
        <Divider />

        <View style={styles.align_center}>
          <Text
            style={[applicationStyles.small_header, { textAlign: 'center' }]}
          >
            Arbeitszeit
          </Text>
          <Text
            style={[applicationStyles.medium_header, { textAlign: 'center' }]}
          >
            {convertMillisecondsToString(time.duration - time.pause)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexBasis: 180,
            flexDirection: 'column',
            gap: 18,
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: themeColors.background
          }}
        >
          <Button
            size="medium"
            color={themeColors.light}
            fontColor={themeColors.text}
            text="Abbrechen"
            onPress={() => {
              if (afterSaveHandler) {
                afterSaveHandler(false);
              }
            }}
          />
          <Button
            size="medium"
            color={themeColors.primary}
            fontColor={themeColors.button}
            text={!isConnected ? 'Keine Internetverbindung' : 'Speichern'}
            onPress={() =>
              updateHandler({
                ...getDayFromDate(
                  formatISO9075(new Date(date ? date : ''), {
                    representation: 'date'
                  })
                ),
                time
              })
            }
            disabled={buttonDisabled || !date || !isConnected}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTime;
