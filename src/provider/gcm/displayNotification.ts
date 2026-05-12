import notifee, { AndroidImportance } from '@notifee/react-native';

// Remove badge count function
export const removeBadgeCount = async () => {
  await notifee.setBadgeCount(0);
  await notifee.cancelAllNotifications();
};

// Add badge count function
export const addBadgeCount = async (count = 1) => {
  await notifee.setBadgeCount(count);
};

export const setupNotifications = async () => {
  await notifee.createChannel({
    id: 'hgs_app',
    name: 'HGS App',
    importance: AndroidImportance.LOW
  });
};

export const displayNotification = async (
  title: string,
  body: string,
  categoryId: string,
  data: { [key: string]: string | number | object },
  id: string
) => {
  const channel = await notifee.getChannel('hgs_app');

  if (channel?.id) {
    const notifications = await notifee.getDisplayedNotifications();

    if (!notifications.find(notification => notification.id === id)) {
      await notifee
        .displayNotification({
          id,
          title,
          body,
          data,
          android: {
            channelId: channel.id,
            onlyAlertOnce: true,
            smallIcon: 'ic_launcher', // Ensure the icon exists in your project
            largeIcon: 'ic_launcher', // Ensure the icon exists in your project
            pressAction: { id: 'default' }
          },
          ios: {
            categoryId,
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true
            }
          }
        })
        .then(() => {
          console.log('notification displayed');
        })
        .catch(() => {
          console.log('error displaying notification');
        });
    }
  }
};
