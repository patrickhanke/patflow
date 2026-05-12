const getUpcomingDates = (dates: string[]) => {
  const dateArray: string[] = [];
  dates.forEach(date => {
    const dateObject = new Date(date);
    if (dateObject.getTime() > new Date().getTime()) {
      dateArray.push(date);
    }
  });

  return dateArray;
};

export default getUpcomingDates;
