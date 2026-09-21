/**
 * Parse SDK Configuration
 * This module initializes and exports the Parse SDK instance
 */

import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SASHIDO_API_URL,
  SASHIDO_APP_ID,
  SASHIDO_JAVASCRIPT_KEY,
  SASHIDO_MASTER_KEY
} from '@env';

// Parse configuration from environment variables
export const PARSE_CONFIG = {
  APP_ID: SASHIDO_APP_ID,
  JS_KEY: SASHIDO_JAVASCRIPT_KEY,
  MASTER_KEY: SASHIDO_MASTER_KEY,
  SERVER_URL: SASHIDO_API_URL
};

let isInitialized = false;
let initPromise: Promise<void> | null = null;

const assertParseConfig = () => {
  if (!PARSE_CONFIG.APP_ID || !PARSE_CONFIG.JS_KEY || !PARSE_CONFIG.SERVER_URL) {
    throw new Error(
      'Missing Parse configuration. Check .env and @env imports in config.ts.'
    );
  }
};

/**
 * Initialize Parse SDK with AsyncStorage for React Native
 * Should be called once at app startup before any Parse operations
 */
export const initializeParse = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    assertParseConfig();

    try {
      Parse.setAsyncStorage(AsyncStorage);
      Parse.initialize(PARSE_CONFIG.APP_ID, PARSE_CONFIG.JS_KEY);
      Parse.serverURL = PARSE_CONFIG.SERVER_URL;
      Parse.enableLocalDatastore();

      isInitialized = true;
      console.log('Parse SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Parse SDK:', error);

      if (
        error instanceof Error &&
        (error.message?.includes('SQLITE_FULL') ||
          error.message?.includes('database or disk is full'))
      ) {
        console.log('Database full during initialization, attempting cleanup...');
        try {
          await Parse.Object.unPinAllObjects();
        } catch (cleanupError) {
          console.error('Failed to unpin all objects:', cleanupError);
        }
      }

      throw error;
    } finally {
      if (!isInitialized) {
        initPromise = null;
      }
    }
  })();

  return initPromise;
};

/**
 * Check if Parse is initialized
 */
export const isParseInitialized = (): boolean => isInitialized;

/**
 * Get the Parse instance
 */
export const getParse = (): typeof Parse => {
  if (!isInitialized) {
    console.warn('Parse SDK not initialized. Call initializeParse() first.');
  }
  return Parse;
};

export default Parse;
