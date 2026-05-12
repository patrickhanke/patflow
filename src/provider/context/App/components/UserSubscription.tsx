import {
  subscribeToQuery,
  useDataStore,
  useFindData,
  useParse
} from '@provider';
import { useEffect } from 'react';

const UserSubscription = () => {
  const { Parse, isReady } = useParse();
  const { loadUsers } = useFindData();
  const { users } = useDataStore();

  useEffect(() => {
    if (isReady && (users.length === 0 || !users)) {
      loadUsers();
    }
  }, [users, isReady]);

  useEffect(() => {
    if (!isReady || !Parse) return;

    const userQuery = new Parse.Query(Parse.User);
    let subscription: Awaited<ReturnType<typeof subscribeToQuery>> | null =
      null;
    let isMounted = true;

    subscribeToQuery(userQuery, {
      onCreate: object => {
        console.log('[User LiveQuery] create:', object.toJSON());
        loadUsers();
      },
      onUpdate: object => {
        console.log('[User LiveQuery] update:', object.toJSON());
        loadUsers();
      },
      onDelete: object => {
        console.log('[User LiveQuery] delete:', object.toJSON());
        loadUsers();
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
  }, [isReady, Parse]);
  return null;
};

export default UserSubscription;
