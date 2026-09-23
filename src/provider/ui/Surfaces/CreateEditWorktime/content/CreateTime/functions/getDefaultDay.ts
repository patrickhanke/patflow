import { DefaultDay } from '@types';
import { absoluteDateKey } from '../../../functions/absoluteTime';

const getDefaultDay: (date: string) => DefaultDay = date => {
  const day = absoluteDateKey(date) || date;
  const [yearText, monthText] = day.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  return {
    objectId: '',
    month: Number.isNaN(month) ? new Date().getMonth() : month - 1,
    year: Number.isNaN(year) ? new Date().getFullYear() : year,
    date: day,
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
  };
};

export default getDefaultDay;
