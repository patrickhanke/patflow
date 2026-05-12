/**
 * useParseAuth - Hook for Parse authentication
 * Provides authentication methods and current user state
 */

import { useState, useCallback, useEffect } from 'react';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFcmToken } from '../../gcm';

export interface ParseUserData {
  objectId: string;
  username: string;
  email: string;
  sessionToken: string;
  first_name?: string;
  last_name?: string;
  portrait?: any;
  role?: any;
  isWorker?: boolean;
  [key: string]: any;
}

export interface UseParseAuthReturn {
  /** Current authenticated user */
  user: ParseUserData | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Login with username and password */
  login: (username: string, password: string) => Promise<ParseUserData>;
  /** Logout current user */
  logout: () => Promise<void>;
  /** Sign up new user */
  signUp: (
    username: string,
    password: string,
    email: string,
    additionalData?: Record<string, any>
  ) => Promise<ParseUserData>;
  /** Reset password */
  requestPasswordReset: (email: string) => Promise<void>;
  /** Refresh current user data from server */
  refreshUser: () => Promise<ParseUserData | null>;
  /** Get current session token */
  getSessionToken: () => Promise<string | null>;
  /** Become a user with session token */
  become: (sessionToken: string) => Promise<ParseUserData>;
}

/**
 * Hook for Parse authentication
 */
function useParseAuth(): UseParseAuthReturn {
  const [user, setUser] = useState<ParseUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser) {
          // Fetch latest user data with role
          await currentUser.fetch();
          const userData = currentUser.toJSON() as ParseUserData;
          setUser(userData);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login
  const login = useCallback(
    async (username: string, password: string): Promise<ParseUserData> => {
      setLoading(true);
      setError(null);

      try {
        console.log('Attempting login for:', username);
        const loggedInUser = await Parse.User.logIn(username, password);
        console.log('Login successful, user:', loggedInUser.id);

        // Store session token for compatibility with existing code
        const sessionToken = loggedInUser.getSessionToken();
        if (sessionToken) {
          await AsyncStorage.setItem('token', sessionToken);
        }

        // Store installation ID
        const installationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('installation_id', installationId);

        // Fetch user with relations
        console.log('Fetching user data...');
        await loggedInUser.fetch();
        console.log('User data fetched successfully');
        const userData = loggedInUser.toJSON() as ParseUserData;

        // Store user data for compatibility
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            objectId: userData.objectId,
            username: userData.username,
            email: userData.email,
            portrait: userData.portrait,
            first_name: userData.first_name,
            last_name: userData.last_name,
            isWorker: userData.isWorker
          })
        );

        // Create/Update installation for push notifications
        try {
          console.log('Getting FCM token...');
          const fcmToken = await getFcmToken();
          console.log('FCM token:', fcmToken ? 'obtained' : 'null');
          if (fcmToken) {
            console.log('Creating installation...');
            await Parse.Cloud.run('create-installation', {
              deviceType: 'android',
              deviceToken: fcmToken,
              channels: [],
              appIdentifier: process.env.FIREBASE_APP_ID,
              appName: 'patflow_web',
              appVersion: '0.8.2',
              parseVersion: '5.3.0',
              localeIdentifier: 'de-DE',
              timeZone: 'GMT',
              user: userData.objectId,
              GCMSenderId: process.env.GCMS_SENDER_ID,
              pushType: 'gcm',
              installationId: installationId
            });
          }
        } catch (installError) {
          console.warn('Installation creation failed:', installError);
        }

        setUser(userData);
        return userData;
      } catch (err: any) {
        console.log('Login error:', err);
        console.log('Error code:', err?.code);
        console.log('Error message:', err?.message);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await Parse.User.logOut();

      // Clear stored data
      await AsyncStorage.multiRemove(['token', 'user', 'installation_id']);

      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign up
  const signUp = useCallback(
    async (
      username: string,
      password: string,
      email: string,
      additionalData?: Record<string, any>
    ): Promise<ParseUserData> => {
      setLoading(true);
      setError(null);

      try {
        const newUser = new Parse.User();
        newUser.set('username', username);
        newUser.set('password', password);
        newUser.set('email', email);

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            newUser.set(key, value);
          });
        }

        await newUser.signUp();

        const sessionToken = newUser.getSessionToken();
        if (sessionToken) {
          await AsyncStorage.setItem('token', sessionToken);
        }

        const userData = newUser.toJSON() as ParseUserData;
        setUser(userData);
        return userData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await Parse.User.requestPasswordReset(email);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<ParseUserData | null> => {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        await currentUser.fetch();
        const userData = currentUser.toJSON() as ParseUserData;
        setUser(userData);
        return userData;
      }
      setUser(null);
      return null;
    } catch (err) {
      console.error('Refresh user failed:', err);
      setUser(null);
      return null;
    }
  }, []);

  // Get session token
  const getSessionToken = useCallback(async (): Promise<string | null> => {
    const currentUser = await Parse.User.currentAsync();
    return currentUser?.getSessionToken() || null;
  }, []);

  // Become a user with session token
  const become = useCallback(
    async (sessionToken: string): Promise<ParseUserData> => {
      setLoading(true);
      setError(null);

      try {
        const becameUser = await Parse.User.become(sessionToken);
        await becameUser.fetch();
        const userData = becameUser.toJSON() as ParseUserData;
        setUser(userData);
        return userData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    requestPasswordReset,
    refreshUser,
    getSessionToken,
    become
  };
}

export default useParseAuth;
