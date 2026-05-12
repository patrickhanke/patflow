import { useCallback, useEffect, useMemo, useState } from 'react';
import { FindRecordsObject } from '../types';
import { useParse } from '@provider';
import { Record } from '@types';

const REFETCH_INTERVAL = 1000 * 60 * 10; // 10 minutes

const useFindRecords = ({ userId, year }: { userId: string; year: number }) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [lastFetch, setLastFetch] = useState<number>(NaN);

  const loadRecord = useCallback(async () => {
    if (!isReady) {
      console.log('Parse not ready yet, skipping query');
      return;
    }

    setLoading(true);
    try {
      const RecordClass = Parse.Object.extend('Record');
      const query = new Parse.Query(RecordClass);

      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(userId);

      query.equalTo('user', userPointer);
      query.equalTo('year', year);

      const results = await query.find();
      if (results.length > 0) {
        setRecords(results.map(r => r.toJSON() as unknown as Record));
      } else {
        setRecords([]);
      }
      setLastFetch(new Date().getTime());
      console.log('Loaded records:', results.length);
    } catch (error) {
      console.error('Error loading record:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, userId, year]);

  // Auto-refetch based on lastFetch timestamp
  useEffect(() => {
    if (!isReady) return;

    const checkAndRefetch = () => {
      const hasData = records.length > 0;

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
        loadRecord();
        return;
      }

      // If timestamp is older than 10 minutes, refetch
      const tenMinutesAgo = new Date().getTime() - REFETCH_INTERVAL;
      if (lastFetch < tenMinutesAgo) {
        console.log('Records data is stale (>10 minutes old), refetching');
        loadRecord();
      }
    };

    // Check immediately
    checkAndRefetch();

    // Set up interval to check periodically
    const intervalId = setInterval(checkAndRefetch, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [isReady, lastFetch, records.length, loadRecord]);

  const returnValue: FindRecordsObject = useMemo(() => {
    return {
      loading,
      records,
      refetch: loadRecord,
    };
  }, [loading, records, loadRecord]);

  return returnValue;
};

export default useFindRecords;
