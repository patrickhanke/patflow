import { Record } from '@types';

const getCurrentRecord = (records: Record[], date?: string): Record | null => {
  if (!records || records.length === 0) {
    return null;
  }
  const currentDate = date ? new Date(date) : new Date();
  for (const record of records) {
    const start = new Date(record.start_date);
    const end = new Date(record.end_date);
    if (currentDate >= start && currentDate <= end) {
      return record;
    }
  }
  return null;
};

export default getCurrentRecord;
