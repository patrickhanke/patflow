import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Text, View, ScrollView } from 'react-native';
import {
  AppContext,
  Button,
  convertMillisecondsToString,
  Divider,
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
import getDefaultTime from './functions/getDefaultTime';
import { CreateTimeProps, DefaultDayTime } from './types';
import { DayTime, DefaultDay, Record } from '@types';
import getDefaultDay from './functions/getDefaultDay';
import { isEqual } from 'lodash';
import EditBreaks from './components/EditBreaks';
import { getPauseTime } from './functions/getPauseTime';
import {
  absoluteDateKey,
  absoluteDateTimeToDate,
  absoluteDiffMs,
  addAbsoluteMinutes,
  normalizeDayTime
} from '../../functions/absoluteTime';

const CreateTime = ({
  initialTime,
  date,
  id,
  refetch,
  afterSaveHandler,
  dataHasChanged,
  setDataHasChanged,
  discardTimeHandler
}: CreateTimeProps) => {
  const { user, indicatorHandler, isConnected } = useContext(AppContext);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const record = useFindRecordForDate({ date });

  const axiosclient = useAxiosClient();
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState<DayTime | DefaultDayTime>(
    initialTime ? normalizeDayTime(initialTime) : getDefaultTime(date).time
  );

  useEffect(() => {
    if (initialTime) {
      const initTime = normalizeDayTime(initialTime);
      const duration = absoluteDiffMs(initTime.end, initTime.start);
      const pause = getPauseTime(initTime.breaks);

      setTime({
        ...initTime,
        duration: Number.isNaN(duration) ? 0 : duration,
        pause: Number.isNaN(pause) ? 0 : pause
      });
    } else {
      const defaultTime = getDefaultTime(date).time;
      const duration = absoluteDiffMs(defaultTime.end, defaultTime.start);
      const pause = getPauseTime(defaultTime.breaks);

      setTime({
        ...defaultTime,
        duration: Number.isNaN(duration) ? 0 : duration,
        pause: Number.isNaN(pause) ? 0 : pause
      });
    }
  }, [initialTime, date]);

  useEffect(() => {
    if (setDataHasChanged) {
      if (!dataHasChanged && !isEqual(time, getDefaultTime(date).time)) {
        setDataHasChanged(true);
      }
    }
  }, [dataHasChanged, initialTime, record]);

  const timeHandler = useCallback(
    (type: 'start' | 'end', newTime: string) => {
      const start = type === 'start' ? newTime : time.start;
      const end = type === 'end' ? newTime : time.end;
      const duration = absoluteDiffMs(end, start);
      const pause = getPauseTime(time.breaks);

      setTime({
        ...time,
        start,
        end,
        duration: Number.isNaN(duration) ? 0 : duration,
        pause: Number.isNaN(pause) ? 0 : pause
      });
    },
    [time]
  );

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

  const dateButtonValues = useMemo(() => {
    let text = 'Datum wählen';
    let color = 'transparent';
    let fontColor = themeColors.text;
    let borderColor = themeColors.border;
    let isValid = true;
    if (date) {
      const dayKey = absoluteDateKey(date) || date;
      const day = getDayFromDate(dayKey);
      const dayDate = absoluteDateTimeToDate(`${dayKey}T12:00:00`);

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
        text = dayDate
          ? dayDate.toLocaleDateString('de-DE', { weekday: 'long' }) +
            ' - ' +
            dayDate.toLocaleDateString('de-DE')
          : dayKey;
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
    let message = 'Speichern';
    const duration = absoluteDiffMs(time.end, time.start);
    if (Number.isNaN(duration) || duration < 0) {
      isDisabled = true;
      message = 'Ungültige Arbeitszeit';
    }
    if (time.pause < 0) {
      isDisabled = true;
      message = 'Ungültige Pause';
    }
    if (loading) {
      isDisabled = true;
      message = 'Warte auf Verbindung ...';
    }
    if (dateButtonValues.isValid === false) {
      isDisabled = true;
      message = 'Keine Zeiterfassung hinterlegt';
    }

    return {
      isDisabled,
      message
    };
  }, [time, loading, dateButtonValues]);

  const dayLabel = useMemo(() => {
    const dayKey = absoluteDateKey(date) || date;
    return (
      absoluteDateTimeToDate(`${dayKey}T12:00:00`)?.toLocaleDateString(
        'de-DE',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      ) || date
    );
  }, [date]);

  return (
    <View style={{ flexShrink: 1 }}>
      <ScrollView
        style={{ flexShrink: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 12
        }}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <View style={styles.date_container}>
          <Text style={applicationStyles.large_header}>{dayLabel}</Text>
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
                    setTime(prevTime => {
                      const newBreaks = (prevTime.breaks ?? []).map(
                        existingBreak =>
                          existingBreak.id === updatedBreak.id
                            ? updatedBreak
                            : existingBreak
                      );

                      return {
                        ...prevTime,
                        breaks: newBreaks,
                        pause: getPauseTime(newBreaks)
                      };
                    });
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
                newBreak = {
                  id: uuid.v4(),
                  start: addAbsoluteMinutes(lastBreak.end, 30),
                  end: addAbsoluteMinutes(lastBreak.end, 60)
                };
              } else {
                newBreak = {
                  id: uuid.v4(),
                  start: addAbsoluteMinutes(time.start, 360),
                  end: addAbsoluteMinutes(time.start, 420)
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
      </ScrollView>
      <View
        style={{
          flexShrink: 0,
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
        {discardTimeHandler && (
          <Button
            size="medium"
            color={themeColors.light}
            fontColor={themeColors.text}
            text="Zeit Verwerfen"
            onPress={() => {
              discardTimeHandler();
            }}
          />
        )}
        <Button
          size="medium"
          color={themeColors.primary}
          fontColor={themeColors.button}
          text={
            !isConnected
              ? 'Keine Internetverbindung'
              : buttonDisabled.message || 'Speichern'
          }
          onPress={() =>
            updateHandler({
              ...getDayFromDate(absoluteDateKey(date) || date),
              time: normalizeDayTime(time)
            })
          }
          disabled={buttonDisabled.isDisabled || !date || !isConnected}
        />
      </View>
    </View>
  );
};

export default CreateTime;
