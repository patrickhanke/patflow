import { Day } from '@types';

const getSaldo: (
  time: Day['time'],
  default_time?: Day['default_time']
) => number = (time, default_time) => {
  let saldo = 0;

  if (time && time.duration && default_time?.duration) {
    const timeSpan = time.duration - time.pause;
    const defaultTimeSpan = default_time.duration - default_time.pause;
    saldo = timeSpan - defaultTimeSpan;
  } else if (time && time.duration) {
    saldo = time.duration - time.pause;
  } else if (default_time?.duration) {
    saldo = 0 - (default_time.duration - default_time.pause);
  }

  return saldo;
};

export default getSaldo;
