import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetAbsenceObject } from '../types';
import { useParse } from '@provider';

const useGetAbsence = ({ userId, year }: { userId: string; year: number }) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [absences, setAbsences] = useState<any[]>([]);

  const loadAbsences = useCallback(async () => {
    if (!isReady || !userId || !year) {
      console.log('Parse not ready or no filters, skipping query');
      return;
    }

    setLoading(true);
    try {
      const AbsenceClass = Parse.Object.extend('Absence');
      const query = new Parse.Query(AbsenceClass);

      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(userId);

      query.equalTo('user', userPointer);
      query.equalTo('year', year);

      const results = await query.find();
      setAbsences(results.map(r => r.toJSON()));
    } catch (error) {
      console.error('Error loading absences:', error);
      setAbsences([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, userId, year]);

  useEffect(() => {
    if (isReady && userId && year) {
      loadAbsences();
    }
  }, [isReady, loadAbsences, userId, year]);

  const returnValue: GetAbsenceObject = useMemo(() => {
    return {
      loading,
      absences,
      refetch: loadAbsences
    } as GetAbsenceObject;
  }, [loading, absences, loadAbsences]);

  return returnValue;
};

export default useGetAbsence;
