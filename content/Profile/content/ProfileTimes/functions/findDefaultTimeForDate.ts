import { Record, TimeObject } from '@types';

const findDefaultTimeForDate: (
  date: string,
  records: Record[]
) => TimeObject = (date, records) => {
  let default_time: TimeObject = {
    date,
    is_working_day: false,
    default_time: null,
    time: null,
    absence: null,
    type: null
  };

  records.forEach(record => {
    const rec_default_time = record.default_times?.find(
      day => day.date === date
    );
    if (rec_default_time) {
      default_time = rec_default_time;
    }
  });

  return default_time;
};

export default findDefaultTimeForDate;
