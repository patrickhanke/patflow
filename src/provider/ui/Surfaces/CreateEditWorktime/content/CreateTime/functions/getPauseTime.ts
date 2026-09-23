import { DayTimeBreak } from '@types';
import { absoluteDiffMs } from '../../../functions/absoluteTime';

export const getPauseTime = (breaks: DayTimeBreak[]): number => {
  let pause = 0;
  if (!breaks || breaks.length === 0) {
    return pause;
  }
  breaks.forEach(breakItem => {
    const duration = absoluteDiffMs(breakItem.end, breakItem.start);
    if (Number.isNaN(duration)) {
      return;
    }
    pause += duration;
  });
  return pause;
};
