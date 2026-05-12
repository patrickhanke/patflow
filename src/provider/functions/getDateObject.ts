import { months } from '../constants';

const getDateObject = (
  date?: string
): { date: string; time: string; string: string } => {
  if (!date) {
    return {
      date: '-',
      time: '-',
      string: '-'
    };
  }

  const dateObject: Date = new Date(date);

  if (dateObject.toString() !== 'Invalid Date') {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const monthObject = months.find(m => m.id === dateObject.getMonth());

    const hours = dateObject.getHours();
    const minutes =
      dateObject.getMinutes() < 10
        ? `0${dateObject.getMinutes()}`
        : dateObject.getMinutes();
    return {
      date: `${day}.${month}.${year}`,
      time: `${hours}:${minutes}`,
      string: `${day}. ${monthObject ? monthObject.label : month.toString()} ${year}`
    };
  }

  return {
    date: '',
    time: '',
    string: ''
  };
};

export default getDateObject;
