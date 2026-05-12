import { getDateString } from '@provider';
import { TaskSection } from '../types';
import { formatISO9075, getWeek, getYear } from 'date-fns';
import { Task } from '@types';
import { cloneDeep } from 'lodash';

const sortTasksForList = (array: Array<Task>) => {
  const taskList: TaskSection = [];

  const arrayCopy = [...array];

  const sortedArray = arrayCopy.sort((a, b) => {
    if (a.dates.length === 0) {
      return 1;
    }
    if (b.dates.length === 0) {
      return -1;
    }
    if (new Date(a.dates[0]).getTime() > new Date(b.dates[0]).getTime()) {
      return 1;
    }
    if (new Date(a.dates[0]).getTime() < new Date(b.dates[0]).getTime()) {
      return -1;
    }
    return 0;
  });

  for (let i = 0; i < sortedArray.length; i += 1) {
    if (sortedArray[i].dates.length > 0) {
      sortedArray[i].dates.forEach((arrayDate: string) => {
        let date: string | undefined;
        let titleDate: string | undefined;
        let id: TaskSection[number]['id'] | undefined = 'this_week';

        if (sortedArray[i].time?.category?.value === 'opportunity') {
          const week = getWeek(new Date(arrayDate), {
            weekStartsOn: 1
          });
          const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
          const year = getYear(new Date(arrayDate));
          const currentYear = getYear(new Date());

          // Calculate week difference accounting for year boundary
          let weekDifference: number;
          if (year === currentYear) {
            weekDifference = week - currentWeek;
          } else if (year === currentYear + 1) {
            // If it's next year, assume current year has ~52 weeks
            // Week 1 of next year comes after week 52 of current year
            weekDifference = 52 - currentWeek + week;
          } else if (year < currentYear) {
            // Past year
            weekDifference = -999; // Mark as overdue
          } else {
            // More than 1 year in the future
            weekDifference = 999;
          }

          if (weekDifference === 0) {
            date = formatISO9075(new Date(), {
              representation: 'date'
            });
            id = 'this_week';
            titleDate = 'Diese Woche';
          } else if (weekDifference === 1) {
            titleDate = 'Nächste Woche';
            id = 'next_week';
            date = arrayDate;
          } else if (weekDifference === 2) {
            titleDate = 'Übernächste Woche';
            id = 'after_next_week';
            date = arrayDate;
          } else if (weekDifference < 0) {
            titleDate = 'Überfällig';
            id = 'overdue';
            date = arrayDate;
          }
        } else {
          const timeCopy = cloneDeep(sortedArray[i].time);
          date = timeCopy?.dates?.find(
            (dateToFind: string) =>
              formatISO9075(dateToFind, { representation: 'date' }) ===
              arrayDate
          );

          if (date) {
            const timeDate = date.length > 10 ? date : `${date}T23:59`;

            if (new Date(timeDate).getTime() < new Date().getTime()) {
              titleDate = 'Überfällig';
              id = 'overdue';
              date = timeDate;
            } else if (new Date(timeDate).getDate() === new Date().getDate()) {
              titleDate = 'Heute';
              id = 'today';
              date = timeDate;
            } else if (date) {
              // Check if date is within 7 days from next Monday
              const taskDate = new Date(timeDate);
              const now = new Date();

              // Find next Monday
              const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
              const nextMonday = new Date(now);
              nextMonday.setDate(now.getDate() + daysUntilMonday);
              nextMonday.setHours(0, 0, 0, 0);

              // Calculate 7 days from next Monday
              const nextMondayPlus7 = new Date(nextMonday);
              nextMondayPlus7.setDate(nextMonday.getDate() + 7);

              if (taskDate.getTime() < nextMonday.getTime()) {
                titleDate = 'Diese Woche';
                id = 'this_week';
                date = arrayDate;
              } else if (
                taskDate.getTime() >= nextMonday.getTime() &&
                taskDate.getTime() < nextMondayPlus7.getTime()
              ) {
                titleDate = 'Nächste Woche';
                id = 'next_week';
                date = arrayDate;
              } else {
                titleDate = getDateString(arrayDate);
                id = 'future';
                date = arrayDate;
              }
            }
          }
        }

        const taskListIndex = taskList.findIndex(
          task => task.title === titleDate
        );

        const taskWidthDate = {
          ...sortedArray[i],
          date: date || arrayDate,
          id: `${sortedArray[i].objectId}-${arrayDate}`
        };

        if (titleDate && date && taskListIndex === -1) {
          taskList.push({
            title: titleDate,
            date: date,
            id: id,
            data: [taskWidthDate]
          });
        } else if (date && taskListIndex !== -1) {
          taskList[taskListIndex].data.push(taskWidthDate);
        }
      });
    }
  }

  console.log('taskList', taskList);

  const idOrder: Record<TaskSection[number]['id'], number> = {
    overdue: 0,
    today: 1,
    this_week: 2,
    next_week: 3,
    after_next_week: 4,
    future: 5
  };

  const sortedTaskList = taskList.sort((a, b) => idOrder[a.id] - idOrder[b.id]);

  return sortedTaskList;
};

export default sortTasksForList;
