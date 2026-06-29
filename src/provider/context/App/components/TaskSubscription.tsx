import {
  subscribeToQuery,
  useFindData,
  useNotificationIntentStore,
  useParse,
  AppContext
} from '@provider';
import { useContext, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const TaskSubscription = () => {
  const { Parse, isReady } = useParse();
  const { loadTasks, loadTickets } = useFindData();
  const intent = useNotificationIntentStore(state => state.intent);
  const { user, isConnected } = useContext(AppContext);
  const prevIsConnectedRef = useRef(isConnected);
  const appState = useRef(AppState.currentState);
  const subscriptionRef = useRef<Awaited<
    ReturnType<typeof subscribeToQuery>
  > | null>(null);
  const subscriptionStateRef = useRef<'connected' | 'disconnected' | 'error'>(
    'disconnected'
  );
  const lastEventTimeRef = useRef<number>(Date.now());
  const reconnectAttemptsRef = useRef<number>(0);

  // Initial load: fetch tasks and tickets when app starts
  // Always fetch on mount to ensure fresh data, regardless of cached data
  useEffect(() => {
    if (isReady && user) {
      console.log(
        '[TaskSubscription] Initial load - fetching tasks and tickets'
      );
      loadTasks();
      loadTickets({ userId: user.objectId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user]);

  // Refetch when transitioning from offline to online
  useEffect(() => {
    const wasOffline = !prevIsConnectedRef.current;
    const isNowOnline = isConnected;

    if (wasOffline && isNowOnline && isReady && user) {
      console.log(
        '[TaskSubscription] App came online - refetching tasks and tickets'
      );
      loadTasks();
      loadTickets({ userId: user.objectId });
    }

    prevIsConnectedRef.current = isConnected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isReady, user]);

  // When a task_assigned notification intent arrives, the local data store
  // may not yet contain the assignment (push can outrun the LiveQuery /
  // initial load). Force a refetch so Tasks.tsx can find the task and switch
  // to the correct week tab, and Task.tsx can open its slide-in.
  useEffect(() => {
    if (!isReady) return;
    if (intent?.action === 'task_assigned') {
      loadTasks();
    }
  }, [intent, isReady]);

  // Reload data when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log(
            '[TaskSubscription] App came to foreground - refreshing data'
          );
          if (isReady && user) {
            loadTasks();
            loadTickets({ userId: user.objectId });
          }
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user]);

  // LiveQuery subscription setup with health monitoring
  useEffect(() => {
    if (!isReady || !Parse) return;

    let isMounted = true;

    const setupSubscription = async () => {
      try {
        const TaskClass = Parse.Object.extend('Task');
        const taskQuery = new Parse.Query(TaskClass);
        taskQuery.equalTo('state', 'assigned');

        console.log('[TaskSubscription] Setting up LiveQuery subscription...');

        const subscription = await subscribeToQuery(taskQuery, {
          onOpen: () => {
            console.log('[Task LiveQuery] Connection opened');
            subscriptionStateRef.current = 'connected';
            lastEventTimeRef.current = Date.now();
            reconnectAttemptsRef.current = 0;
          },
          onCreate: object => {
            console.log('[Task LiveQuery] create:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onUpdate: object => {
            console.log('[Task LiveQuery] update:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onDelete: object => {
            console.log('[Task LiveQuery] delete:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onEnter: object => {
            console.log('[Task LiveQuery] enter:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onLeave: object => {
            console.log('[Task LiveQuery] leave:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onClose: () => {
            console.warn('[Task LiveQuery] Connection closed');
            subscriptionStateRef.current = 'disconnected';
          },
          onError: error => {
            console.error('[Task LiveQuery] Error:', error);
            subscriptionStateRef.current = 'error';
          }
        });

        if (isMounted) {
          subscriptionRef.current = subscription;
          console.log('[TaskSubscription] LiveQuery subscription established');
        } else {
          subscription.unsubscribe();
        }
      } catch (error) {
        console.error(
          '[TaskSubscription] Failed to setup LiveQuery subscription:',
          error
        );
        subscriptionStateRef.current = 'error';
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        console.log('[TaskSubscription] Unsubscribing from LiveQuery');
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, Parse]);

  // Health check: Monitor subscription every 60 seconds and reconnect if needed
  useEffect(() => {
    if (!isReady || !Parse) return;

    const healthCheckInterval = setInterval(() => {
      if (AppState.currentState !== 'active') {
        return; // Skip health check when app is in background
      }

      const state = subscriptionStateRef.current;
      const timeSinceLastEvent = Date.now() - lastEventTimeRef.current;
      const reconnectAttempts = reconnectAttemptsRef.current;

      console.log('[TaskSubscription] Health check:', {
        state,
        timeSinceLastEvent: `${Math.round(timeSinceLastEvent / 1000)}s`,
        reconnectAttempts
      });

      // If subscription is disconnected or errored, attempt reconnection
      if (state === 'disconnected' || state === 'error') {
        console.warn(
          `[TaskSubscription] Subscription is ${state}, attempting reconnection...`
        );

        // Unsubscribe from old subscription if it exists
        if (subscriptionRef.current) {
          try {
            subscriptionRef.current.unsubscribe();
          } catch (error) {
            console.error(
              '[TaskSubscription] Error unsubscribing old subscription:',
              error
            );
          }
          subscriptionRef.current = null;
        }

        // Setup new subscription
        reconnectAttemptsRef.current += 1;
        const TaskClass = Parse.Object.extend('Task');
        const taskQuery = new Parse.Query(TaskClass);
        taskQuery.equalTo('state', 'assigned');

        subscribeToQuery(taskQuery, {
          onOpen: () => {
            console.log('[Task LiveQuery] Reconnection successful');
            subscriptionStateRef.current = 'connected';
            lastEventTimeRef.current = Date.now();
            reconnectAttemptsRef.current = 0;
            // Refresh data after reconnection
            loadTasks();
          },
          onCreate: object => {
            console.log('[Task LiveQuery] create:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onUpdate: object => {
            console.log('[Task LiveQuery] update:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onDelete: object => {
            console.log('[Task LiveQuery] delete:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onEnter: object => {
            console.log('[Task LiveQuery] enter:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onLeave: object => {
            console.log('[Task LiveQuery] leave:', object.toJSON());
            lastEventTimeRef.current = Date.now();
            loadTasks();
          },
          onClose: () => {
            console.warn('[Task LiveQuery] Connection closed');
            subscriptionStateRef.current = 'disconnected';
          },
          onError: error => {
            console.error('[Task LiveQuery] Error:', error);
            subscriptionStateRef.current = 'error';
          }
        })
          .then(sub => {
            subscriptionRef.current = sub;
          })
          .catch(error => {
            console.error('[TaskSubscription] Reconnection failed:', error);
            subscriptionStateRef.current = 'error';
          });
      } else if (state === 'connected') {
        // If connected but no events for 5 minutes, do a fallback refresh
        const FIVE_MINUTES = 5 * 60 * 1000;
        if (timeSinceLastEvent > FIVE_MINUTES && reconnectAttempts === 0) {
          console.warn(
            '[TaskSubscription] No events for 5 minutes, doing fallback refresh'
          );
          loadTasks();
          lastEventTimeRef.current = Date.now();
        }
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(healthCheckInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, Parse]);

  return null;
};

export default TaskSubscription;
