import {
  subscribeToQuery,
  useDataStore,
  useFindData,
  useParse,
  AppContext
} from '@provider';
import { useContext, useEffect, useRef } from 'react';

const AbsenceSubscription = () => {
  const { Parse, isReady } = useParse();
  const { loadAbsences } = useFindData();
  const { absences } = useDataStore();
  const { user, isConnected } = useContext(AppContext);
  const prevIsConnectedRef = useRef(isConnected);

  // Initial load: fetch absences when app starts
  useEffect(() => {
    if (isReady && user && (absences.length === 0 || !absences)) {
      loadAbsences({ userId: user.objectId });
    }
  }, [absences, isReady, user]);

  // Refetch when transitioning from offline to online
  useEffect(() => {
    const wasOffline = !prevIsConnectedRef.current;
    const isNowOnline = isConnected;

    if (wasOffline && isNowOnline && isReady && user) {
      console.log(
        '[AbsenceSubscription] App came online - refetching absences'
      );
      loadAbsences({ userId: user.objectId });
    }

    prevIsConnectedRef.current = isConnected;
  }, [isConnected, isReady, user, loadAbsences]);

  useEffect(() => {
    if (!isReady || !Parse || !user) return;

    const AbsenceClass = Parse.Object.extend('Absence');
    const absenceQuery = new Parse.Query(AbsenceClass);
    const UserClass = Parse.Object.extend('_User');
    absenceQuery.equalTo('user', UserClass.createWithoutData(user.objectId));

    let subscription: Awaited<ReturnType<typeof subscribeToQuery>> | null =
      null;
    let isMounted = true;

    subscribeToQuery(absenceQuery, {
      onCreate: object => {
        console.log('[Absence LiveQuery] create:', object.toJSON());
        loadAbsences({ userId: user.objectId });
      },
      onUpdate: object => {
        console.log('[Absence LiveQuery] update:', object.toJSON());
        loadAbsences({ userId: user.objectId });
      },
      onDelete: object => {
        console.log('[Absence LiveQuery] delete:', object.toJSON());
        loadAbsences({ userId: user.objectId });
      },
      onEnter: object => {
        console.log('[Absence LiveQuery] enter:', object.toJSON());
        loadAbsences({ userId: user.objectId });
      },
      onLeave: object => {
        console.log('[Absence LiveQuery] leave:', object.toJSON());
        loadAbsences({ userId: user.objectId });
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

export default AbsenceSubscription;
