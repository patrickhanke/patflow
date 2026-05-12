import { useContext, useMemo } from 'react';
import { UseButtonColors } from '../types';
import { ThemeContext } from '@provider';

const useButtonColors: UseButtonColors = ({
  timerState,
  buttonStates,
  start,
  breaks,
  end,
  disabled
}) => {
  const { themeColors, theme } = useContext(ThemeContext);

  const buttonColors = useMemo(() => {
    if (!timerState) {
      return {
        startColor: {
          font: theme === 'light' ? themeColors.white : themeColors.dark,
          background: theme === 'light' ? themeColors.dark : themeColors.white
        },
        pauseColor: {
          font: themeColors.disabled,
          background: 'transparent'
        },
        endColor: {
          font: themeColors.disabled,
          background: 'transparent'
        }
      };
    }
    const startColor =
      theme === 'light'
        ? {
            font:
              timerState === 'clock' || timerState === 'pause'
                ? themeColors.white
                : themeColors.disabled,
            background:
              timerState === 'clock'
                ? themeColors.primary
                : buttonStates.includes('start')
                  ? themeColors.dark
                  : timerState === 'pause'
                    ? themeColors.dark
                    : 'transparent'
          }
        : {
            font:
              timerState === 'clock' || timerState === 'pause'
                ? themeColors.dark
                : themeColors.disabled,
            background:
              timerState === 'clock'
                ? themeColors.primary
                : buttonStates.includes('start')
                  ? themeColors.white
                  : timerState === 'pause'
                    ? themeColors.white
                    : 'transparent'
          };

    const pauseColor =
      theme === 'light'
        ? {
            font:
              timerState === 'pause'
                ? themeColors.white
                : buttonStates.includes('pause')
                  ? themeColors.white
                  : themeColors.disabled,

            background:
              timerState === 'pause' ? themeColors.primary : themeColors.dark
          }
        : {
            font:
              timerState === 'pause'
                ? themeColors.white
                : buttonStates.includes('pause')
                  ? themeColors.dark
                  : themeColors.disabled,

            background:
              timerState === 'pause' ? themeColors.primary : themeColors.white
          };

    const endColor =
      theme === 'light'
        ? {
            font: buttonStates.includes('end')
              ? themeColors.white
              : themeColors.disabled,
            background: buttonStates.includes('end')
              ? themeColors.dark
              : 'transparent'
          }
        : {
            font: buttonStates.includes('end')
              ? themeColors.dark
              : themeColors.disabled,
            background: buttonStates.includes('end')
              ? themeColors.white
              : 'transparent'
          };

    return { startColor, pauseColor, endColor };
  }, [themeColors, timerState, buttonStates, start, breaks, end, disabled]);

  return buttonColors;
};

export default useButtonColors;
