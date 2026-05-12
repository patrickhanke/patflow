import { DefaultWorkingDay } from '@types';
import { formatISO9075 } from 'date-fns';

const getDefaultTime: (date: string) => DefaultWorkingDay = date => {
  return {
    objectId: '',
    month: new Date(date).getMonth(),
    year: new Date(date).getFullYear(),
    date: date,
    is_working_day: true,
    absence: null,
    saldo: 0,
    type: 'work',
    default_time: null,
    surcharges: [],
    time: {
      type: 'regular',
      start: `${date}T08:00:00`,
      end: `${date}T16:30:00`,
      pause: 0,
      comment: '',
      duration: 0,
      state: 'initial',
      breaks: [
        {
          start: `${formatISO9075(new Date(date), { representation: 'date' })}T14:00:00`,
          end: `${formatISO9075(new Date(date), { representation: 'date' })}T14:30:00`,
          id: new Date().toISOString()
        }
      ]
    }
  };
};

export default getDefaultTime;
