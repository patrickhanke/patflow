import { ApplicationTypes, DateTypes } from '@repo/types';
import { formatISO9075 } from 'date-fns';
import { isArray } from 'lodash-es';

const errorHandler = (date: DateTypes.DateObjectWithNextDates) => {
  const errorArray: ApplicationTypes.ErrorMessage[] = [];
  if (date.type.value === 'single') {
    if (!date.dates[0]) {
      errorArray.push({
        message: 'Bitte ein Datum angeben',
        key: 'date',
        id: 'date'
      });
    }
  }
  if (date.type.value === 'multi') {
    if (!date.dates[0]) {
      errorArray.push({
        message: 'Bitte mindestens ein Datum angeben',
        key: 'date',
        id: 'date'
      });
    }
  }
  if (date.type.value === 'weekly' || date.type.value === 'monthly') {
    if (!date.start_date) {
      errorArray.push({
        message: 'Bitte eine Startwoche angeben',
        key: 'start_date',
        id: 'start_date'
      });
    }
  }
  function hasDuplicates(array: string[]) {
    const valuesSoFar = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] !== '') {
        const value = formatISO9075(new Date(array[i]), {
          representation: 'date'
        });
        if (valuesSoFar.indexOf(value) !== -1) {
          return true;
        }
        valuesSoFar.push(value);
      }
    }
    return false;
  }
  if (isArray(date.dates) && hasDuplicates(date.dates)) {
    errorArray.push({
      message: 'Bitte keine doppelten Daten angeben',
      key: 'date',
      id: 'date'
    });
  }

  return errorArray;
};

export default errorHandler;
