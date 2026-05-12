function getDateFromWeek(weekNumber: number, dayIndex: number) {
  // Create a new date object for the first day of the year
  let date = new Date(new Date().getFullYear(), 0, 1);

  // Adjust to the first day of the year + week number
  let days = (weekNumber - 1) * 7 + dayIndex;

  // Set the date to the calculated day
  date.setDate(date.getDate() + days);

  return new Date(date);
}

export default getDateFromWeek;
