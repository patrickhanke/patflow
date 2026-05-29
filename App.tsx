/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Aufgaben: { admin?: boolean };
  Tickets: undefined;
  Arbeiteszeiten: undefined;
  Profil: undefined;
  Admin: { admin?: boolean };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Allow navigation actions to be triggered from outside the React tree (e.g.
// notification tap handlers).
const navigationRef = createNavigationContainerRef<RootTabParamList>();

import { Profile, SignIn, Tasks } from './content';

import {
  AppContext,
  AppContextProvider,
  appStyles,
  dispatchNotificationIntent,
  displayNotification,
  GlobalIndicator,
  PendingUpdates,
  requestNotificationPermissions,
  requestUserPermission,
  setupNotifications,
  AxiosProvider,
  initializeParse,
  ParseProvider,
  UserSubscription,
  PropertySubscription,
  RecordSubscription,
  TaskSubscription,
  useNotificationIntentStore,
  AbsenceSubscription
} from '@provider';
import Fa5 from 'react-native-vector-icons/FontAwesome5';
import Mat from 'react-native-vector-icons/MaterialCommunityIcons';
import Ion from 'react-native-vector-icons/Ionicons';
import Tickets from './content/Tickets';
import Start from './content/Start';
import { ThemeContextProvider } from '@provider';
import { colors } from '@provider';
import TimeRecords from './content/TimeRecords';
import { getWeek } from 'date-fns';

import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Background FCM + notifee handlers are registered in `index.js` via
// `src/provider/gcm/backgroundMessageHandler.ts` so they fire when the app is
// in a killed/quit state. Background taps also populate the intent store
// directly from there.

function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [parseInitialized, setParseInitialized] = useState(false);
  const intent = useNotificationIntentStore(state => state.intent);

  useEffect(() => {
    // Initialize Parse SDK
    initializeParse()
      .then(() => {
        setParseInitialized(true);
      })
      .catch(console.error);

    requestUserPermission();
    requestNotificationPermissions();
    setupNotifications();
    // verifyToken();

    // Foreground FCM messages: show a local notification.
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      displayNotification(
        remoteMessage.notification?.title || '',
        remoteMessage.notification?.body || '',
        'default',
        remoteMessage.data as { [key: string]: string | number | object },
        remoteMessage.messageId || ''
      );
    });

    // Cold start: the app was launched by tapping a notification while
    // terminated. Capture the payload so the intent watcher below can react.
    notifee
      .getInitialNotification()
      .then(initial => {
        if (initial?.notification?.data) {
          dispatchNotificationIntent(
            initial.notification.data as { [key: string]: unknown }
          );
        }
      })
      .catch(() => {
        /* ignore */
      });

    // Tap on a local notifee notification while the app is running.
    const unsubscribeOnForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (
          type === EventType.PRESS ||
          (type === EventType.ACTION_PRESS &&
            detail.pressAction?.id === 'default')
        ) {
          dispatchNotificationIntent(
            detail.notification?.data as { [key: string]: unknown } | undefined
          );
        }
      }
    );

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnForeground();
    };
  }, []);

  // Whenever a `task_assigned` intent lands, jump to the Aufgaben tab. The
  // individual Task component owns the modal and will open itself when its
  // own objectId matches the intent.
  useEffect(() => {
    if (!intent) return;
    if (intent.action === 'task_assigned' && navigationRef.isReady()) {
      navigationRef.navigate('Aufgaben', { admin: false });
    }
  }, [intent]);

  const getColors = colors[colorScheme as 'dark' | 'light'];

  const adminRoles: string[] = ['YbZv7RA1Rp', '0ljodoihj9'];

  if (!parseInitialized) {
    return <Start />;
  }

  return (
    <ParseProvider>
      <AxiosProvider>
        <ThemeContextProvider>
          <AppContextProvider>
            <AppContext.Consumer>
              {({ user, loading, isConnected, setIsConnected }) => {
                if (loading || !parseInitialized) {
                  return <Start />;
                }
                if (!loading && !user) {
                  return <SignIn />;
                }
                console.log('loadApp');

                return (
                  <>
                    <NavigationContainer ref={navigationRef}>
                      <Tab.Navigator
                        initialRouteName="Aufgaben"
                        screenOptions={{
                          header: ({ route }) => {
                            return (
                              <View
                                style={[
                                  appStyles.header,
                                  {
                                    backgroundColor: getColors.light_background
                                  }
                                ]}
                              >
                                <Text
                                  style={[
                                    appStyles.header_title,
                                    { color: getColors.text }
                                  ]}
                                >
                                  {route.name}
                                </Text>
                                <View style={appStyles.head_container}>
                                  <Pressable
                                    onPress={() => {
                                      setIsConnected(!isConnected);
                                    }}
                                    style={[
                                      appStyles.connection_indicator,
                                      {
                                        backgroundColor: isConnected
                                          ? 'green'
                                          : 'red'
                                      }
                                    ]}
                                  />
                                  <Text
                                    style={[
                                      appStyles.header_subtitle,
                                      { color: getColors.text }
                                    ]}
                                  >
                                    KW{' '}
                                    {getWeek(new Date(), { weekStartsOn: 1 })}
                                  </Text>
                                </View>
                              </View>
                            );
                          },
                          tabBarStyle: {
                            paddingVertical: 3,
                            shadowOpacity: 0,
                            borderWidth: 0,
                            elevation: 0,
                            backgroundColor: getColors.background
                          },
                          tabBarActiveTintColor: getColors.primary,
                          tabBarInactiveTintColor: getColors.text
                        }}
                      >
                        <Tab.Screen
                          name="Aufgaben"
                          component={Tasks}
                          initialParams={{ admin: false }}
                          options={{
                            title: 'Aufgaben',
                            tabBarLabel: 'Aufgaben',
                            tabBarIcon: ({ focused }) => (
                              <Text style={{ color: getColors.text }}>
                                <Fa5
                                  name="tasks"
                                  size={18}
                                  color={
                                    focused ? getColors.primary : getColors.text
                                  }
                                />
                              </Text>
                            )
                          }}
                        />
                        <Tab.Screen
                          name="Tickets"
                          component={Tickets}
                          options={{
                            title: 'Tickets',
                            tabBarLabel: 'Tickets',
                            tabBarIcon: ({ focused }) => (
                              <Text>
                                <Mat
                                  name="comment-alert-outline"
                                  size={18}
                                  color={
                                    focused ? getColors.primary : getColors.text
                                  }
                                />
                              </Text>
                            )
                          }}
                        />
                        <Tab.Screen
                          name="Arbeiteszeiten"
                          component={TimeRecords}
                          options={{
                            title: 'Arbeiteszeiten',
                            tabBarLabel: 'Zeiten',
                            tabBarIcon: ({ focused }) => (
                              <Text>
                                <Ion
                                  name="time"
                                  size={18}
                                  color={
                                    focused ? getColors.primary : getColors.text
                                  }
                                />
                              </Text>
                            )
                          }}
                        />
                        <Tab.Screen
                          name="Profil"
                          component={Profile}
                          options={{
                            title: 'Profile',
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({ focused }) => (
                              <Text>
                                <Fa5
                                  name="user"
                                  size={18}
                                  color={
                                    focused ? getColors.primary : getColors.text
                                  }
                                />
                              </Text>
                            )
                          }}
                        />
                        {adminRoles.includes(user.role.objectId) && (
                          <Tab.Screen
                            name="Admin"
                            component={Tasks}
                            initialParams={{ admin: true }}
                            options={{
                              title: 'Admin',
                              tabBarLabel: 'Admin',
                              tabBarIcon: ({ focused }) => (
                                <Text>
                                  <Ion
                                    name="shield-checkmark-outline"
                                    size={18}
                                    color={
                                      focused
                                        ? getColors.primary
                                        : getColors.text
                                    }
                                  />
                                </Text>
                              )
                            }}
                          />
                        )}
                      </Tab.Navigator>
                    </NavigationContainer>
                    <PendingUpdates isConnected={isConnected} />
                    <UserSubscription />
                    <PropertySubscription />
                    <RecordSubscription />
                    <TaskSubscription />
                    <AbsenceSubscription />
                  </>
                );
              }}
            </AppContext.Consumer>
            <GlobalIndicator />
          </AppContextProvider>
        </ThemeContextProvider>
      </AxiosProvider>
    </ParseProvider>
  );
}

export default App;
