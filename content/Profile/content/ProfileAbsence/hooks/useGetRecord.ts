import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter } from '@types';
import { GetRecordObject } from '../types';
import { useParse } from '@provider';

const paramsHandler = (filters?: Filter[]) => {
  if (filters && filters?.length > 0) {
    const filterObject = filters?.reduce(
      (acc: { [key: string]: { [op: string]: any } }, filter: Filter) => {
        acc[filter.key] = { [filter.operator]: filter.value };
        return acc;
      },
      {}
    );
    return filterObject;
  }
  return undefined;
};

const useGetRecord = ({ filters }: { filters: Filter[] }) => {
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any>(undefined);

  const loadRecord = useCallback(async () => {
    if (!isReady) {
      console.log('Parse not ready yet, skipping query');
      return;
    }

    setLoading(true);
    try {
      const RecordClass = Parse.Object.extend('Record');
      const query = new Parse.Query(RecordClass);

      const params = paramsHandler(filters);
      if (params) {
        Object.entries(params).forEach(([key, value]: [string, any]) => {
          const operator = Object.keys(value)[0];
          const val = value[operator];

          switch (operator) {
            case '_eq':
              query.equalTo(key, val);
              break;
            case '_ne':
              query.notEqualTo(key, val);
              break;
            case '_lt':
              query.lessThan(key, val);
              break;
            case '_lte':
              query.lessThanOrEqualTo(key, val);
              break;
            case '_gt':
              query.greaterThan(key, val);
              break;
            case '_gte':
              query.greaterThanOrEqualTo(key, val);
              break;
            case '_in':
              query.containedIn(key, val);
              break;
            case '_nin':
              query.notContainedIn(key, val);
              break;
            case '_regex':
              query.matches(key, new RegExp(val));
              break;
          }
        });
      }

      const results = await query.find();
      if (results.length > 0) {
        setRecord(results[0].toJSON());
      } else {
        setRecord(undefined);
      }
    } catch (error) {
      console.error('Error loading record:', error);
      setRecord(undefined);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, filters]);

  useEffect(() => {
    if (isReady) {
      loadRecord();
    }
  }, [isReady, loadRecord]);

  const returnValue: GetRecordObject = useMemo(() => {
    return {
      loading,
      record,
      refetch: loadRecord
    } as GetRecordObject;
  }, [loading, record, loadRecord]);

  return returnValue;
};

export default useGetRecord;
