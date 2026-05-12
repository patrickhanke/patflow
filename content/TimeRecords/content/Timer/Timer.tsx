import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import Ion from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Break, TimerProps, TimerStates } from './types';
import DisplayTime from './components/DisplayTime';
import {
  CreateTime,
  formatDateToISO,
  getStringFromDate,
  Modal,
  ThemeContext
} from '@provider';
import { formatISO9075 } from 'date-fns';
import { DayTime } from '@types';
import useButtonColors from './hooks/useButtonColors';
import { timer_pause, timer_start } from './constants/storage_keys';
import checkTimerValidity from './functions/checkTimerValidity';

const Timer = ({ disabled }: TimerProps) => {
  const { themeColors, theme } = useContext(ThemeContext);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [timerState, setTimerState] = useState<TimerStates | undefined>(
    undefined
  );
  const [breaks, setBreaks] = useState<DayTime['breaks']>([]);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [endValue, setEndValue] = useState<DayTime>();
  const hasUserStartedRef = useRef(false);
  const [discardTimeModalVisible, setDiscardTimeModalVisible] = useState(false);

  useEffect(() => {
    const getStoreData = async () => {
      if (hasUserStartedRef.current) return;

      const pauseTime = await AsyncStorage.getItem(timer_pause);
      const startTime = await AsyncStorage.getItem(timer_start);

      const isSameDay =
        startTime &&
        startTime !== '' &&
        new Date(startTime).getDate() === new Date().getDate() &&
        new Date(startTime).getMonth() === new Date().getMonth() &&
        new Date(startTime).getFullYear() === new Date().getFullYear();

      if (isSameDay) {
        setStart(new Date(startTime!));
        setTimerState('clock');
      } else {
        await AsyncStorage.removeItem(timer_start);
        await AsyncStorage.removeItem(timer_pause);
      }

      if (pauseTime) {
        const breakArray: Break[] = JSON.parse(pauseTime);
        if (isSameDay && breakArray.length > 0) {
          setBreaks(breakArray);
          const lastIndex = breakArray.length - 1;
          if (
            lastIndex >= 0 &&
            breakArray[lastIndex]?.start &&
            !breakArray[lastIndex]?.end
          ) {
            setTimerState('pause');
          }
        }
      }
    };

    if (!start) {
      getStoreData();
    }
  }, [start, JSON.stringify(breaks), end]);

  const clearTimerStorage = useCallback(async () => {
    await AsyncStorage.removeItem(timer_start);
    await AsyncStorage.removeItem(timer_pause);
  }, []);

  const timerHandler = useCallback(
    async (value: 'start' | 'pause' | 'continue' | 'end') => {
      const now = new Date();
      const { breaks: validBreaks, changed } = checkTimerValidity({
        start,
        breaks,
        end,
        timerHandlerValue: value,
        now
      });

      if (changed) {
        setBreaks(validBreaks);
        await AsyncStorage.setItem(timer_pause, JSON.stringify(validBreaks));
      }

      if (value === 'start') {
        hasUserStartedRef.current = true;
        await AsyncStorage.setItem(timer_start, new Date().toISOString());
        setTimerState('clock');
        setStart(new Date());
      }
      if (value === 'pause') {
        setTimerState('pause');
        const breaksCopy = [...breaks];
        breaksCopy.push({
          start: getStringFromDate(new Date()),
          end: '',
          id: new Date().toISOString()
        });
        await AsyncStorage.setItem(timer_pause, JSON.stringify(breaksCopy));
        setBreaks(breaksCopy);
      }
      if (value === 'continue') {
        const breaksCopy = [...validBreaks];
        const index = breaksCopy.length - 1;
        if (index < 0) return;

        setTimerState('clock');
        breaksCopy[index] = {
          ...breaksCopy[index],
          end: getStringFromDate(new Date())
        };

        await AsyncStorage.setItem(timer_pause, JSON.stringify(breaksCopy));
        setBreaks(breaksCopy);
      }
      if (value === 'end' && start) {
        const pauseDuration = breaks.reduce((acc, cur) => {
          if (cur.end) {
            return (
              acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
            );
          }
          return acc;
        }, 0);

        setEnd(new Date());
        setEndValue({
          start: formatDateToISO(start),
          end: formatDateToISO(new Date()),
          duration: new Date().getTime() - start.getTime(),
          type: 'regular',
          pause: pauseDuration,
          comment: '',
          state: 'submitted',
          breaks: validBreaks
        });
      }
    },
    [start, JSON.stringify(breaks), end]
  );

  const buttonStates = useMemo(() => {
    const buttonArray: ('start' | 'pause' | 'end')[] = [];
    if (start && timerState === 'clock') {
      buttonArray.push('pause');
      buttonArray.push('end');
    }
    if (start && timerState === 'pause') {
      buttonArray.push('start');
    }
    if (!start) {
      buttonArray.push('start');
    }

    return buttonArray;
  }, [start, JSON.stringify(breaks), end, timerState]);

  const buttonColors = useButtonColors({
    timerState,
    buttonStates,
    start,
    breaks,
    end,
    disabled
  });

  useEffect(() => {
    if (discardTimeModalVisible) {
      Alert.alert(
        'Zeiten verwerfen',
        'Sind Sie sicher, dass Sie die Zeiten verwerfen und den Timer beenden wollen?',
        [
          {
            text: 'Abbrechen',
            onPress: () => setDiscardTimeModalVisible(false),
            style: 'cancel'
          },
          {
            text: 'Verwerfen',
            onPress: async () => {
              setDiscardTimeModalVisible(false);
              setStart(undefined);
              setTimerState(undefined);
              setBreaks([]);
              setEnd(undefined);
              setEndValue(undefined);
              hasUserStartedRef.current = false;
              await clearTimerStorage();
            }
          }
        ],
        {
          userInterfaceStyle: theme === 'dark' ? 'dark' : 'light'
        }
      );
    }
  }, [discardTimeModalVisible]);

  return (
    <>
      <View style={styles.timer_container}>
        <DisplayTime
          timerState={timerState}
          start={start}
          end={end}
          breaks={breaks}
        />
        <View style={styles.timer_buttons}>
          <View style={styles.icon_container}>
            <Pressable
              disabled={timerState === 'clock' || disabled}
              onPress={() => timerHandler(!start ? 'start' : 'continue')}
            >
              <View
                style={[
                  styles.timer_button,
                  {
                    backgroundColor: buttonColors.startColor.background
                  }
                ]}
              >
                <Ion
                  name="play"
                  size={20}
                  color={buttonColors.startColor.font}
                />
              </View>
            </Pressable>
            <Text
              style={[
                styles.time_text,
                {
                  color:
                    buttonColors.startColor.background !== 'transparent'
                      ? buttonColors.startColor.background
                      : themeColors.disabled
                }
              ]}
            >
              {start && timerState === 'pause' ? 'Weiter' : 'Start'}
            </Text>
          </View>
          <View style={styles.icon_container}>
            <Pressable
              disabled={timerState === 'pause'}
              onPress={() => timerHandler('pause')}
            >
              <View
                style={[
                  styles.timer_button,
                  {
                    backgroundColor: buttonColors.pauseColor.background
                  }
                ]}
              >
                <Ion
                  name="pause"
                  size={24}
                  color={buttonColors.pauseColor.font}
                />
              </View>
            </Pressable>
            <Text
              style={[
                styles.time_text,
                {
                  color:
                    buttonColors.pauseColor.background !== 'transparent'
                      ? buttonColors.pauseColor.background
                      : themeColors.disabled
                }
              ]}
            >
              Pause
            </Text>
          </View>
          <View style={styles.icon_container}>
            <Pressable
              onPress={() => timerHandler('end')}
              disabled={timerState !== 'clock'}
            >
              <View
                style={[
                  styles.timer_button,
                  {
                    backgroundColor: buttonColors.endColor.background
                  }
                ]}
              >
                <Ion name="stop" size={24} color={buttonColors.endColor.font} />
              </View>
            </Pressable>
            <Text
              style={[
                styles.time_text,
                {
                  color:
                    buttonColors.endColor.background !== 'transparent'
                      ? buttonColors.endColor.background
                      : themeColors.disabled
                }
              ]}
            >
              Ende
            </Text>
          </View>
        </View>
      </View>
      {endValue && (
        <Modal
          isVisible={!!end}
          setIsVisible={() => setEnd(undefined)}
          title="Arbeitszeit hinzufügen"
          dataHasChanged={true}
        >
          <CreateTime
            initialTime={endValue}
            date={formatISO9075(new Date(endValue?.start ?? ''), {
              representation: 'date'
            })}
            afterSaveHandler={async success => {
              setStart(undefined);
              setTimerState(undefined);
              setBreaks([]);
              setEnd(undefined);
              setEndValue(undefined);
              hasUserStartedRef.current = false;
              if (success) {
                await clearTimerStorage();
              }
            }}
            discardTimeHandler={async () => {
              setDiscardTimeModalVisible(true);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Timer;
