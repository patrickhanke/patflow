import { DayTime } from '@types';

export type TimerStates = 'clock' | 'pause' | 'continue' | 'stop';

export type Break = DayTime['breaks'][number];

export type Pause = {
  start: string;
  end?: string;
}[];

export type TimerProps = {
  resetTimer: boolean;
  disabled: boolean;
};

export type DisplayTimeProps = {
  timerState?: TimerStates;
  start?: Date;
  end?: Date;
  duration?: number;
  breaks: Break[];
};

export type UseButtonColors = (T: {
  timerState?: TimerStates;
  buttonStates: ('start' | 'pause' | 'end')[];
  start?: Date;
  breaks: Break[];
  end?: Date;
  disabled: boolean;
}) => {
  startColor: {
    font: string;
    background: string;
  };
  pauseColor: {
    font: string;
    background: string;
  };
  endColor: {
    font: string;
    background: string;
  };
};
