import React, { useCallback, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import {
  GlobalModal,
  useDataHandler,
  useDataStore,
  useNotificationIntentStore
} from '@provider';
import { Task as TaskType } from '@types';
import TaskSlideIn from '../content/Task/content/TaskSlideIn';

/**
 * Opens a TaskSlideIn for a task referenced by an incoming notification
 * intent. The task is looked up directly from the data store by id, ignoring
 * any week / user filters in the surrounding Tasks panel, so it works no
 * matter which week tab the user is currently on.
 *
 * Closing the modal clears the intent and returns the user to whatever
 * `siteState` they had in Tasks before the notification arrived.
 */
const DisplayTask = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const intent = useNotificationIntentStore(state => state.intent);
  const clearIntent = useNotificationIntentStore(state => state.clearIntent);
  const tasks = useDataStore(state => state.tasks);
  const { updateData } = useDataHandler();

  const intentTask: TaskType | undefined = useMemo(() => {
    if (intent?.action !== 'task_assigned') return undefined;
    return tasks.find((t: TaskType) => t.objectId === intent.id);
  }, [intent, tasks]);

  const closeIntentSlideIn = useCallback(() => {
    clearIntent();
  }, [clearIntent]);

  const completeIntentTask = useCallback(async () => {
    if (!intentTask) return;
    const nextDates = cloneDeep(intentTask.dates);
    nextDates.splice(0, 1);
    await updateData({
      className: 'Task',
      objectId: intentTask.objectId,
      updateObject: { dates: nextDates },
      feedback: 'Aufgabe erfolgreich als erledigt markiert'
    });
    clearIntent();
  }, [intentTask, updateData, clearIntent]);

  if (!intentTask) return null;

  return (
    <GlobalModal
      title={intentTask.title}
      isVisible={true}
      dataHasChanged={false}
      backHandler={closeIntentSlideIn}
    >
      <TaskSlideIn
        task={intentTask}
        date={intentTask.dates[0] ?? ''}
        completeTask={completeIntentTask}
        refetch={() => Promise.resolve([])}
        isAdmin={isAdmin}
      />
    </GlobalModal>
  );
};

export default DisplayTask;
