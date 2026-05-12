import { DefaultDay } from '@types';
import { formatISO9075 } from 'date-fns';

const getDefaultDay: (date: string) => DefaultDay = date => ({
  objectId: '',
  month: new Date(date).getMonth(),
  year: new Date(date).getFullYear(),
  date: formatISO9075(new Date(date), { representation: 'date' }),
  is_working_day: true,
  absence: null,
  saldo: 0,
  type: 'initial',
  default_time: null,
  record: null,
  time: {
    type: 'regular',
    start: '',
    end: '',
    pause: 0,
    comment: '',
    duration: 0,
    state: 'initial'
  }
});

export default getDefaultDay;
