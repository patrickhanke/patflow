import {
  AppContext,
  subscribeToQuery,
  useDataStore,
  useFindData,
  useParse
} from '@provider';
import { useContext, useEffect } from 'react';

const RecordSubscription = () => {
  const { user } = useContext(AppContext);
  const { Parse, isReady } = useParse();
  const { loadRecords } = useFindData();
  const { records } = useDataStore();

  useEffect(() => {
    if (isReady && user && (records.length === 0 || !records)) {
      loadRecords({ userId: user.objectId });
    }
  }, [records, isReady, user]);

  useEffect(() => {
    if (!isReady || !Parse || !user) return;

    const RecordClass = Parse.Object.extend('Record');
    const recordQuery = new Parse.Query(RecordClass);

    const UserClass = Parse.Object.extend('_User');
    const userPointer = UserClass.createWithoutData(user.objectId);
    const currentYear = new Date().getFullYear();

    recordQuery.equalTo('user', userPointer);
    recordQuery.equalTo('year', currentYear);

    let subscription: Awaited<ReturnType<typeof subscribeToQuery>> | null =
      null;
    let isMounted = true;

    subscribeToQuery(recordQuery, {
      onCreate: object => {
        console.log('[Record LiveQuery] create:', object.toJSON());
        loadRecords({ userId: user.objectId });
      },
      onUpdate: object => {
        console.log('[Record LiveQuery] update:', object.toJSON());
        loadRecords({ userId: user.objectId });
      },
      onDelete: object => {
        console.log('[Record LiveQuery] delete:', object.toJSON());
        loadRecords({ userId: user.objectId });
      }
    }).then(sub => {
      if (isMounted) {
        subscription = sub;
      } else {
        sub.unsubscribe();
      }
    });

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isReady, Parse, user]);

  return null;
};

export default RecordSubscription;
