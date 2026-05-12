import { DayTimeBreak } from '@types';

export const getPauseTime = (breaks: DayTimeBreak[]): number => {
  let pause = 0;
  if (!breaks || breaks.length === 0) {
    return pause;
  }
  breaks.forEach(breakItem => {
    if (!breakItem.start || !breakItem.end) {
      return;
    }
    pause +=
      new Date(breakItem.end).getTime() - new Date(breakItem.start).getTime();
  });
  return pause;
};
