import { differenceInDays, isToday, isYesterday } from 'date-fns';

const getDate = (date: string | undefined) => {
  if (date === undefined) {
    return;
  }
  if (date === null) {
    return 'Kein Datum';
  }

  const dateObj = new Date(date);
  if (isToday(dateObj)) {
    return 'Heute';
  }
  if (isYesterday(dateObj)) {
    return 'Gestern';
  }
  if (differenceInDays(new Date(), dateObj) === 2) {
    return 'Vorgestern';
  }
  return dateObj.toLocaleDateString('de-DE');
};

export default getDate;
