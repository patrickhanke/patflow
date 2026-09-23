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

const resolveProjectId = (result: unknown): string | undefined => {
  if (typeof result === 'string' && result.length > 0) {
    return result;
  }
  if (result && typeof result === 'object' && 'objectId' in result) {
    const id = (result as { objectId?: unknown }).objectId;
    if (typeof id === 'string' && id.length > 0) {
      return id;
    }
  }
  return undefined;
};

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null as unknown as User);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const axiosclient = useAxiosClient();
  const [appState, setAppState] = useState(AppState.currentState);
  const { getUser, userLoggedInHandler } = useUser();

  const [loading, setLoading] = useState(true);
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

  const fetchProjectId = useCallback(
    async (userId: string, sessionToken?: string | null) => {
      const response = await axiosclient().post(
        '/functions/get-project',
        { userId },
        sessionToken
          ? { headers: { 'X-Parse-Session-Token': sessionToken } }
          : undefined
      );
      return resolveProjectId(response.data?.result);
    },
    [axiosclient]
  );

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (user) {
        return;
      }

      setLoading(true);
      try {
        const stored = await getUser();
        if (!stored.token) {
          return;
        }

        const loggedIn = await userLoggedInHandler();
        if (cancelled) {
          return;
        }

        if (!loggedIn.user?.objectId) {
          return;
        }

        const pid = await fetchProjectId(
          loggedIn.user.objectId,
          loggedIn.token || stored.token
        );
        if (cancelled) {
          return;
        }

        if (!pid) {
          return;
        }

        setProjectId(pid);
        setUser(loggedIn.user);
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [user, fetchProjectId, getUser, userLoggedInHandler]);

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
