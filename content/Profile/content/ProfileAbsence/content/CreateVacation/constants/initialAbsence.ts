import { Absence } from '@types';
import { addDays, formatISO9075 } from 'date-fns';

const initialAbsence: (year: number) => Absence = year => {
  let start_date = '';
  let end_date = '';

  if (year === new Date().getFullYear()) {
    start_date = formatISO9075(new Date(), { representation: 'date' });
    end_date = formatISO9075(addDays(new Date(), 3), {
      representation: 'date'
    });
  }

  if (year !== new Date().getFullYear()) {
    start_date = formatISO9075(new Date(year, 0, 1), {
      representation: 'date'
    });
    end_date = formatISO9075(new Date(year, 0, 4), { representation: 'date' });
  }

  if (new Date(end_date).getFullYear() !== year) {
    end_date = formatISO9075(new Date(year, 11, 31), {
      representation: 'date'
    });
  }

  return {
    objectId: '',
    user: '',
    start_date,
    end_date,
    state: 'submitted',
    comment: '',
    type: 'vacation'
  };
};

export default initialAbsence;
