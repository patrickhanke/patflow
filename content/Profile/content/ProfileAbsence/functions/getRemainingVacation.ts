import { Day, Record } from '@types';

const getRemainingVacation: (
  startDate: string,
  endDate: string,
  record: Record,
  days: Day[]
) => {
  remainingVacation: number;
  takenVacation: number;
  initialVacation: number;
  formerVacation: number;
} = (startDate, endDate, record, days) => {
  const former_vacation = record?.time_settings.vacation || 0;
  const initial_vacation = 0 + former_vacation;

  let takenVacation = 0;
  let remainingVacation = initial_vacation;
  days.forEach(day => {
    const date = new Date(day.date).getTime();

    if (
      date >= new Date(startDate).getTime() &&
      date <= new Date(endDate).getTime() &&
      day.type === 'absence' &&
      day?.absence?.type === 'vacation'
    ) {
      if (day?.default_time?.type === 'regular') {
        remainingVacation -= 1;
        takenVacation += 1;
      }
    }
  });

  return {
    remainingVacation,
    takenVacation,
    initialVacation: initial_vacation,
    formerVacation: former_vacation
  };
};

export default getRemainingVacation;
