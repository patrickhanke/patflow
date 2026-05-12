import { convertMillisecondsToString, ThemeContext } from '@provider';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Text, View } from 'react-native';
import { DisplayTimeProps } from '../types';
import styles from '../styles';

const DisplayTime = ({ timerState, start, breaks }: DisplayTimeProps) => {
  const [duration, setDuration] = useState(0);
  const { themeColors } = useContext(ThemeContext);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      if (timerState === 'pause' || timerState === 'clock') {
        setDuration(prevSeconds => prevSeconds + 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  const getCurrentTimer = useCallback(() => {
    let currentDuration = 0;
    let pauseDuration = 0;
    let pauseTime = 0;

    if (start) {
      if (breaks.length > 0) {
        pauseDuration = breaks.reduce((acc, cur) => {
          if (cur.end) {
            return (
              acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
            );
          }
          return acc;
        }, 0);

        pauseTime = breaks.reduce((acc, cur) => {
          if (cur.end) {
            return (
              acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
            );
          } else if (!cur.end) {
            return acc + new Date().getTime() - new Date(cur.start).getTime();
          }
          return acc;
        }, 0);
      }
      const lastIndex = breaks.length - 1;
      if (lastIndex >= 0 && !breaks[lastIndex].end && breaks[lastIndex].start) {
        currentDuration =
          new Date(breaks[lastIndex].start).getTime() -
          new Date(start).getTime();
      } else {
        currentDuration = new Date().getTime() - new Date(start).getTime();
      }
    }

    return {
      time: currentDuration - pauseDuration || 0,
      pause: pauseTime || 0
    };
  }, [timerState, start, JSON.stringify(breaks), duration]);

  const textColor = useMemo(() => {
    return {
      timer: timerState !== 'clock' ? themeColors.light_font : themeColors.text,
      pause: timerState === 'pause' ? themeColors.text : themeColors.light_font
    };
  }, [timerState, themeColors]);

  return (
    <View style={styles.timer_display}>
      <Text
        style={[styles.timer_display_time_text, { color: textColor.timer }]}
      >
        {start
          ? convertMillisecondsToString(getCurrentTimer().time, true, true)
          : '00:00:00'}
      </Text>
      <Text
        style={[styles.timer_display_pause_text, { color: textColor.pause }]}
      >
        {breaks
          ? convertMillisecondsToString(getCurrentTimer().pause, true, true)
          : '00:00:00'}
      </Text>
    </View>
  );
};

export default DisplayTime;
