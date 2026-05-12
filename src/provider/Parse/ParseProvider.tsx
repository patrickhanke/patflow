/**
 * Parse Context Provider
 * Provides Parse SDK access throughout the app
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback
} from 'react';
import Parse from 'parse/react-native';
import { initializeParse, isParseInitialized } from './config';

interface ParseUser {
  objectId: string;
  username: string;
  email: string;
  sessionToken: string;
  [key: string]: any;
}

interface ParseContextType {
  isReady: boolean;
  currentUser: ParseUser | null;
  login: (username: string, password: string) => Promise<ParseUser>;
  logout: () => Promise<void>;
  signUp: (
    username: string,
    password: string,
    email: string,
    additionalData?: Record<string, any>
  ) => Promise<ParseUser>;
  refreshUser: () => Promise<ParseUser | null>;
  Parse: typeof Parse;
}

const ParseContext = createContext<ParseContextType | undefined>(undefined);

interface ParseProviderProps {
  children: ReactNode;
}

export const ParseProvider: React.FC<ParseProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<ParseUser | null>(null);

  // Initialize Parse SDK
  useEffect(() => {
    const init = async () => {
      try {
        if (!isParseInitialized()) {
          await initializeParse();
        }

        // Check for existing session
        const user = await Parse.User.currentAsync();
        if (user) {
          setCurrentUser(user.toJSON() as ParseUser);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Parse initialization failed:', error);
        setIsReady(true); // Still set ready to show error state
      }
    };

    init();
  }, []);

  // Login function
  const login = useCallback(
    async (username: string, password: string): Promise<ParseUser> => {
      try {
        const user = await Parse.User.logIn(username, password);
        const userData = user.toJSON() as ParseUser;
        setCurrentUser(userData);
        return userData;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  // Sign up function
  const signUp = useCallback(
    async (
      username: string,
      password: string,
      email: string,
      additionalData?: Record<string, any>
    ): Promise<ParseUser> => {
      try {
        const user = new Parse.User();
        user.set('username', username);
        user.set('password', password);
        user.set('email', email);

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            user.set(key, value);
          });
        }

        await user.signUp();
        const userData = user.toJSON() as ParseUser;
        setCurrentUser(userData);
        return userData;
      } catch (error) {
        console.error('Sign up failed:', error);
        throw error;
      }
    },
    []
  );

  // Refresh current user data
  const refreshUser = useCallback(async (): Promise<ParseUser | null> => {
    try {
      const user = await Parse.User.currentAsync();
      if (user) {
        await user.fetch();
        const userData = user.toJSON() as ParseUser;
        setCurrentUser(userData);
        return userData;
      }
      setCurrentUser(null);
      return null;
    } catch (error) {
      console.error('Refresh user failed:', error);
      setCurrentUser(null);
      return null;
    }
  }, []);

  const value: ParseContextType = {
    isReady,
    currentUser,
    login,
    logout,
    signUp,
    refreshUser,
    Parse
  };

  return (
    <ParseContext.Provider value={value}>{children}</ParseContext.Provider>
  );
};

/**
 * Hook to access Parse context
 */
export const useParse = (): ParseContextType => {
  const context = useContext(ParseContext);
  if (!context) {
    throw new Error('useParse must be used within a ParseProvider');
  }
  return context;
};

export default ParseProvider;
