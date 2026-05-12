import {
  subscribeToQuery,
  useDataStore,
  useFindData,
  useNotificationIntentStore,
  useParse,
  AppContext
} from '@provider';
import { useContext, useEffect, useRef } from 'react';

const TaskSubscription = () => {
  const { Parse, isReady } = useParse();
  const { loadTasks, loadTickets } = useFindData();
  const { tasks } = useDataStore();
  const intent = useNotificationIntentStore(state => state.intent);
  const { user, isConnected } = useContext(AppContext);
  const prevIsConnectedRef = useRef(isConnected);

  // Initial load: fetch tasks and tickets when app starts
  useEffect(() => {
    if (isReady && user && (tasks.length === 0 || !tasks)) {
      loadTasks();
      loadTickets({ userId: user.objectId });
    }
  }, [tasks, isReady, user]);

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
  }, [isConnected, isReady, user, loadTasks, loadTickets]);

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

  useEffect(() => {
    if (!isReady || !Parse) return;

    const TaskClass = Parse.Object.extend('Task');
    const taskQuery = new Parse.Query(TaskClass);
    taskQuery.equalTo('state', 'assigned');

    let subscription: Awaited<ReturnType<typeof subscribeToQuery>> | null =
      null;
    let isMounted = true;

    subscribeToQuery(taskQuery, {
      onCreate: object => {
        console.log('[Task LiveQuery] create:', object.toJSON());
        loadTasks();
      },
      onUpdate: object => {
        console.log('[Task LiveQuery] update:', object.toJSON());
        loadTasks();
      },
      onDelete: object => {
        console.log('[Task LiveQuery] delete:', object.toJSON());
        loadTasks();
      },
      onEnter: object => {
        console.log('[Task LiveQuery] enter:', object.toJSON());
        loadTasks();
      },
      onLeave: object => {
        console.log('[Task LiveQuery] leave:', object.toJSON());
        loadTasks();
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

export default TaskSubscription;
