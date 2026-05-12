import { create } from 'zustand';

/**
 * Known notification intents that can drive navigation inside the app.
 *
 * Extend this union when adding support for new `data.action` values from
 * server-sent FCM messages.
 */
export type NotificationIntent =
  | { action: 'task_assigned'; id: string }
  | { action: 'unknown'; id?: string };

type NotificationIntentState = {
  intent: NotificationIntent | null;
  setIntent: (intent: NotificationIntent | null) => void;
  clearIntent: () => void;
};

/**
 * Stores a pending notification intent that components can react to.
 *
 * Flow:
 *  1. The FCM background / foreground handler reads `data.action` and
 *     `data.id` from the remote message and calls `setIntent`.
 *  2. Interested components subscribe to this store (e.g. the tab navigator
 *     switches to the correct screen, the matching `Task` opens its modal)
 *     and call `clearIntent` once they have handled it.
 */
const useNotificationIntentStore = create<NotificationIntentState>(set => ({
  intent: null,
  setIntent: intent => set({ intent }),
  clearIntent: () => set({ intent: null })
}));

export default useNotificationIntentStore;
