import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext, useParse } from '@provider';
import { Record } from '@types';

const REFETCH_INTERVAL = 1000 * 60 * 10; // 10 minutes

const useFindRecordForDate: (D: { date: string }) => Record | undefined = ({
  date
}) => {
  const { user } = useContext(AppContext);
  const { Parse, isReady } = useParse();
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [lastFetch, setLastFetch] = useState<number>(NaN);

  const loadRecords = useCallback(async () => {
    if (!isReady || !user?.objectId) return;

    try {
      const RecordClass = Parse.Object.extend('Record');
      const query = new Parse.Query(RecordClass);
      query.equalTo('user', user.objectId);

      const results = await query.find();
      setAllRecords(results.map(r => r.toJSON()));
      setLastFetch(new Date().getTime());
      console.log('Loaded records for date:', results.length);
    } catch (error) {
      console.error('Error loading records:', error);
      setAllRecords([]);
    }
  }, [isReady, Parse, user?.objectId]);

  // Auto-refetch based on lastFetch timestamp
  useEffect(() => {
    if (!isReady || !user?.objectId) return;

    const checkAndRefetch = () => {
      const hasData = allRecords.length > 0;

      // If timestamp is NaN but we have data, skip (data just loaded)
      if (Number.isNaN(lastFetch) && hasData) {
        console.log(
          'Records data exists but timestamp not set yet, skipping refetch'
        );
        return;
      }

      // If timestamp is NaN and no data, initial load
      if (Number.isNaN(lastFetch) && !hasData) {
        console.log('No records data - initial load');
        loadRecords();
        return;
      }

      // If timestamp is older than 10 minutes, refetch
      const tenMinutesAgo = new Date().getTime() - REFETCH_INTERVAL;
      if (lastFetch < tenMinutesAgo) {
        console.log('Records data is stale (>10 minutes old), refetching');
        loadRecords();
      }
    };

    // Check immediately
    checkAndRefetch();

    // Set up interval to check periodically
    const intervalId = setInterval(checkAndRefetch, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [isReady, user?.objectId, lastFetch, allRecords.length, loadRecords]);

  useEffect(() => {
    if (allRecords.length > 0 && date) {
      // Find all records where day is between record.start_date and record.end_date
      const filteredRecords = allRecords.filter((rec: any) => {
        const start = new Date(rec.start_date);
        const end = new Date(rec.end_date);
        const check = new Date(date);
        return check >= start && check <= end;
      });
      setRecords(filteredRecords);
    } else {
      setRecords([]);
    }
  }, [allRecords, date]);

  return records?.length > 0 ? records[0] : undefined;
};

export default useFindRecordForDate;
