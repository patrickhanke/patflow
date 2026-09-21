import {
  useFindData,
  useNotificationIntentStore,
  useParse,
  AppContext,
  useDataStore
} from '@provider';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const POLL_INTERVAL_MS = 60_000;

const TaskSubscription = () => {
  const { isReady } = useParse();
  const {
    loadTasks,
    loadTickets,
    loadUsers,
    loadProperties,
    loadRecords,
    loadAbsences
  } = useFindData();
  const intent = useNotificationIntentStore(state => state.intent);
  const { user, isConnected } = useContext(AppContext);
  const prevIsConnectedRef = useRef(isConnected);
  const appState = useRef(AppState.currentState);
  const loadTasksRef = useRef(loadTasks);
  const loadTicketsRef = useRef(loadTickets);
  const loadUsersRef = useRef(loadUsers);
  const loadPropertiesRef = useRef(loadProperties);
  const loadRecordsRef = useRef(loadRecords);
  const loadAbsencesRef = useRef(loadAbsences);

  loadTasksRef.current = loadTasks;
  loadTicketsRef.current = loadTickets;
  loadUsersRef.current = loadUsers;
  loadPropertiesRef.current = loadProperties;
  loadRecordsRef.current = loadRecords;
  loadAbsencesRef.current = loadAbsences;

  const refreshAll = useCallback(() => {
    if (!isReady || !user) {
      return;
    }
    console.log('[DataPolling] Refreshing app data');
    loadTasksRef.current();
    loadTicketsRef.current({ userId: user.objectId });
    loadUsersRef.current();
    loadPropertiesRef.current();
    loadRecordsRef.current({ userId: user.objectId });
    loadAbsencesRef.current({ userId: user.objectId });
  }, [isReady, user]);

  useEffect(() => {
    if (!isReady || !user) {
      return;
    }

    const refreshAfterHydration = () => {
      refreshAll();
    };

    if (useDataStore.persist.hasHydrated()) {
      refreshAfterHydration();
      return;
    }

    return useDataStore.persist.onFinishHydration(() => {
      refreshAfterHydration();
    });
  }, [isReady, user, refreshAll]);

  useEffect(() => {
    const wasOffline = !prevIsConnectedRef.current;
    const isNowOnline = isConnected;

    if (wasOffline && isNowOnline) {
      console.log('[DataPolling] App came online - refetching data');
      refreshAll();
    }

    prevIsConnectedRef.current = isConnected;
  }, [isConnected, refreshAll]);

  useEffect(() => {
    if (!isReady) return;
    if (intent?.action === 'task_assigned') {
      loadTasksRef.current();
    }
  }, [intent, isReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('[DataPolling] App came to foreground - refreshing data');
          refreshAll();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [refreshAll]);

  useEffect(() => {
    if (!isReady || !user) return;

    const intervalId = setInterval(() => {
      if (AppState.currentState !== 'active') {
        return;
      }
      console.log('[DataPolling] 60s background poll');
      refreshAll();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isReady, user, refreshAll]);

  return null;
};

export default TaskSubscription;
