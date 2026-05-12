import { useCallback, useEffect, useMemo, useState } from 'react';
import { FindRecordsObject } from '../types';
import { useParse } from '@provider';

const REFETCH_INTERVAL = 1000 * 60 * 10; // 10 minutes

const useFindRecords = ({ userId, year }: { userId: string; year: number }) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any>(undefined);
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
        setRecord(results[0].toJSON());
      } else {
        setRecord(undefined);
      }
      setLastFetch(new Date().getTime());
      console.log('Loaded record:', results.length > 0 ? 'found' : 'not found');
    } catch (error) {
      console.error('Error loading record:', error);
      setRecord(undefined);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, userId, year]);

  // Auto-refetch based on lastFetch timestamp
  useEffect(() => {
    if (!isReady) return;

    const checkAndRefetch = () => {
      const hasData = record !== undefined;

      // If timestamp is NaN but we have data, skip (data just loaded)
      if (Number.isNaN(lastFetch) && hasData) {
        console.log(
          'Record data exists but timestamp not set yet, skipping refetch'
        );
        return;
      }

      // If timestamp is NaN and no data, initial load
      if (Number.isNaN(lastFetch) && !hasData) {
        console.log('No record data - initial load');
        loadRecord();
        return;
      }

      // If timestamp is older than 10 minutes, refetch
      const tenMinutesAgo = new Date().getTime() - REFETCH_INTERVAL;
      if (lastFetch < tenMinutesAgo) {
        console.log('Record data is stale (>10 minutes old), refetching');
        loadRecord();
      }
    };

    // Check immediately
    checkAndRefetch();

    // Set up interval to check periodically
    const intervalId = setInterval(checkAndRefetch, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [isReady, lastFetch, record, loadRecord]);

  const returnValue: FindRecordsObject = useMemo(() => {
    return {
      loading,
      record,
      refetch: loadRecord,
    };
  }, [loading, record, loadRecord]);

  return returnValue;
};

export default useFindRecords;
