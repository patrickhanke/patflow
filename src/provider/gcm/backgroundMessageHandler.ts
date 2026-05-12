import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { displayNotification } from './displayNotification';
import dispatchNotificationIntent from '../hooks/dispatchNotificationIntent';

/**
 * Registers background handlers for FCM messages and notifee interactions.
 *
 * IMPORTANT: This module must be imported from `index.js` BEFORE
 * `AppRegistry.registerComponent` is called. If it is registered later
 * (e.g. inside a component's `useEffect`), FCM will not invoke the handler
 * when the app is in a killed/quit state.
 *
 * Handles:
 *  - FCM messages arriving while the app is backgrounded or killed.
 *    Displays a local notification via notifee so the user sees it.
 *  - User interactions with notifications while the app is backgrounded
 *    (alive but not in the foreground). Dispatching the intent here works
 *    because the app's JS context is still the same one the UI will read
 *    from when it resumes.
 *
 * NOTE: Taps from a killed state are NOT handled here — they are picked up
 * via `notifee.getInitialNotification()` on app mount in App.tsx.
 */

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM background]', remoteMessage);

  const messageId = (remoteMessage.messageId ?? `${Date.now()}`) as string;
  const data = (remoteMessage.data ?? {}) as {
    [key: string]: string | number | object;
  };

  const title =
    remoteMessage.notification?.title ??
    (typeof data.title === 'string' ? data.title : '') ??
    '';
  const body =
    remoteMessage.notification?.body ??
    (typeof data.body === 'string' ? data.body : '') ??
    '';

  if (!title && !body) {
    return;
  }

  await displayNotification(title, body, 'default', data, messageId);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  const isPress =
    type === EventType.PRESS ||
    (type === EventType.ACTION_PRESS && pressAction?.id === 'default');

  if (isPress) {
    console.log('[notifee background] notification pressed', notification);
    dispatchNotificationIntent(
      notification?.data as { [key: string]: unknown } | undefined
    );
  }
});
