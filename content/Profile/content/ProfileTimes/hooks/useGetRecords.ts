import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentRecord, useParse } from '@provider';
import { Record } from '@types';
import { GetRecordObject } from '../types';

const useFindRecords = ({
  userId,
  year,
  date
}: {
  userId: string;
  year: number;
  date: string;
}) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);

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
    } catch (error) {
      console.error('Error loading record:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, userId, year]);

  useEffect(() => {
    if (isReady) {
      loadRecord();
    }
  }, [isReady, loadRecord]);

  const returnValue: GetRecordObject = useMemo(() => {
    return {
      loading,
      records,
      record: getCurrentRecord(records, date),
      refetch: loadRecord
    };
  }, [loading, records, loadRecord, date]);

  return returnValue;
};

export default useFindRecords;
