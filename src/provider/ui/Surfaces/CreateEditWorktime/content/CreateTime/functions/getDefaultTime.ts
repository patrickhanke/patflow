import { DefaultWorkingDay } from '@types';
import { absoluteDateKey } from '../../../functions/absoluteTime';

const getDefaultTime: (date: string) => DefaultWorkingDay = date => {
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
    type: 'work',
    default_time: null,
    surcharges: [],
    time: {
      type: 'regular',
      start: `${day}T08:00:00`,
      end: `${day}T16:30:00`,
      pause: 0,
      comment: '',
      duration: 0,
      state: 'initial',
      breaks: [
        {
          start: `${day}T14:00:00`,
          end: `${day}T14:30:00`,
          id: new Date().toISOString()
        }
      ]
    }
  };
};

export default getDefaultTime;
