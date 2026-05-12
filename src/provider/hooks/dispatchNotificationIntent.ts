import useNotificationIntentStore, {
  NotificationIntent
} from './useNotificationIntentStore';

/**
 * Reads `data.action` / `data.id` from an arbitrary notification payload and
 * writes the corresponding intent to the Zustand store, so any interested
 * component can react on the next render.
 *
 * Can be safely called from:
 *  - React-tree handlers (`notifee.onForegroundEvent`, cold-start via
 *    `notifee.getInitialNotification()`).
 *  - `notifee.onBackgroundEvent` while the app is alive in the background
 *    (same JS context, the write survives into the resumed foreground).
 *
 * NOTE: Calling it from `messaging().setBackgroundMessageHandler` when the app
 * is killed runs in a throwaway headless JS context — the store write is
 * discarded as soon as the handler returns. For killed-state cold starts,
 * rely on `notifee.getInitialNotification()` on app mount instead.
 */
const dispatchNotificationIntent = (
  data: { [key: string]: unknown } | undefined | null
) => {
  if (!data) return;
  const action = typeof data.action === 'string' ? data.action : undefined;
  const id = typeof data.id === 'string' ? data.id : undefined;

  let intent: NotificationIntent | null = null;
  if (action === 'task_assigned' && id) {
    intent = { action: 'task_assigned', id };
  }

  if (intent) {
    useNotificationIntentStore.getState().setIntent(intent);
  }
};

export default dispatchNotificationIntent;
