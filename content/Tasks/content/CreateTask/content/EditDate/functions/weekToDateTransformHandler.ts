import { formatISO9075, getWeek, startOfWeek } from 'date-fns';

const weekToDateTransformHandler = (
  date: string,
  transform: 'week-to-date' | 'date-to-week'
) => {
  if (transform === 'week-to-date') {
    const newDate = new Date(
      Number(date.slice(0, 4)),
      0,
      1 + (Number(date.slice(-2)) - 1) * 7
    );
    const start = startOfWeek(newDate, { weekStartsOn: 1 });
    return formatISO9075(new Date(start), { representation: 'date' });
  }
  if (transform === 'date-to-week') {
    const week = getWeek(new Date(date), { weekStartsOn: 1 });
    const year = new Date(date).getFullYear();
    return `${year}-W${week < 10 ? '0' : ''}${week}`;
  }
  return '';
};

export default weekToDateTransformHandler;
