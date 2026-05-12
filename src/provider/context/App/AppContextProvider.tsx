import { IndicatorElement, User } from '@types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useUser } from '../../User';
import { IndicatorElementWithType, IndicatorType } from './types';
import verifyFcmToken from '../../gcm/verifyFcmToken';
import { cloneDeep } from 'lodash';
import { useAxiosClient } from '../Axios';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface MyContextProps {
  user: User;
  indicatorHandler: (content: IndicatorElement, type: IndicatorType) => void;
  indicatorContent: IndicatorElementWithType[];
  loading: boolean;
  projectId: string | undefined;
  isConnected: boolean;
  appState: AppStateStatus;
  setIsConnected: (value: boolean) => void;
}

export const AppContext = createContext(undefined as unknown as MyContextProps);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null as unknown as User);
  const [projectId, setProjectId] = useState<string | undefined>('');
  const [isConnected, setIsConnected] = useState(false);
  const axiosclient = useAxiosClient();
  const [appState, setAppState] = useState(AppState.currentState);
  const { getUser, userLoggedInHandler } = useUser();

  const [loading, setLoading] = useState(false);
  const [indicatorContent, setIndicatorContent] = useState(
    [] as IndicatorElementWithType[]
  );

  // Initialize all data fetching at the top level
  // This ensures data is loaded once and available via useDataStore throughout the app

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      // setIsConnected(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setLoading(true);
        const lg = await getUser();

        if (lg && lg.user && lg.user.role) {
          const response = await axiosclient().post('/functions/get-project', {
            userId: lg.user.objectId
          });

          const pid = response.data.result;
          setProjectId(pid);
          setUser(lg.user);
        } else {
          const loggedInUser = await userLoggedInHandler();
          if (loggedInUser && loggedInUser.user) {
            const response = await axiosclient().post(
              '/functions/get-project',
              {
                userId: loggedInUser.user.objectId
              }
            );

            const pid = response.data.result;
            setProjectId(pid);
            setUser(loggedInUser.user);
          }
        }
        setLoading(false);
      }
    };
    check();
  }, [user]);

  const indicatorHandler = useCallback(
    (content: IndicatorElement, type: IndicatorType) => {
      if (type === 'loading') {
        setIndicatorContent([
          ...indicatorContent,
          { ...content, type, timestamp: new Date().getTime() }
        ]);
      } else if (type === 'error') {
        setIndicatorContent([
          ...indicatorContent,
          { ...content, type, timestamp: new Date().getTime() }
        ]);
        setTimeout(() => {
          const indicatorContenCopy = [...indicatorContent];
          const index = indicatorContenCopy.findIndex(
            contentTotFind => contentTotFind.id === content.id
          );
          const newIndicatorContent = indicatorContent.slice(index, 1);
          setIndicatorContent(newIndicatorContent || []);
        }, 4000);
      } else {
        setIndicatorContent([
          ...indicatorContent,
          { ...content, type, timestamp: new Date().getTime() }
        ]);
        setTimeout(() => {
          const indicatorContenCopy = [...indicatorContent];
          const index = indicatorContenCopy.findIndex(
            contentTotFind => contentTotFind.id === content.id
          );
          const newIndicatorContent = indicatorContent.slice(index, 1);
          setIndicatorContent(newIndicatorContent || []);
        }, 4000);
      }
    },
    [indicatorContent]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const indicatorContentCopy: IndicatorElementWithType[] =
        cloneDeep(indicatorContent);
      const now = new Date().getTime();
      const filteredIndicatorContent = indicatorContentCopy.filter(
        item => now - item.timestamp < 2 * 60 * 1000
      );
      if (filteredIndicatorContent.length !== indicatorContentCopy.length) {
        setIndicatorContent(filteredIndicatorContent);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [indicatorContent]);

  useEffect(() => {
    verifyFcmToken();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        projectId,
        indicatorHandler,
        indicatorContent,
        loading,
        isConnected,
        appState,
        setIsConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
