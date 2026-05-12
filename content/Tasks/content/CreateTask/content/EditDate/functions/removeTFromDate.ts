const removeTimeFromDate = (date: string): string => {
  if (!date.includes('T')) {
    return date;
  }
  return date.split('T')[0];
};

export default removeTimeFromDate;
