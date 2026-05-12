/**
 * Parse SDK Configuration
 * This module initializes and exports the Parse SDK instance
 */

import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Parse configuration from environment variables
export const PARSE_CONFIG = {
  APP_ID: process.env.SASHIDO_APP_ID || '',
  JS_KEY: process.env.SASHIDO_JAVASCRIPT_KEY || '',
  MASTER_KEY: process.env.SASHIDO_MASTER_KEY || '',
  SERVER_URL: process.env.SASHIDO_API_URL || ''
};

let isInitialized = false;

/**
 * Initialize Parse SDK with AsyncStorage for React Native
 * Should be called once at app startup before any Parse operations
 */
export const initializeParse = async (): Promise<void> => {
  if (isInitialized) {
    console.log('Parse already initialized');
    return;
  }

  try {
    // Set AsyncStorage for React Native before initializing
    Parse.setAsyncStorage(AsyncStorage);

    // Initialize Parse with your credentials
    Parse.initialize(PARSE_CONFIG.APP_ID, PARSE_CONFIG.JS_KEY);
    Parse.serverURL = PARSE_CONFIG.SERVER_URL;

    // Enable local datastore for offline capabilities
    Parse.enableLocalDatastore();

    isInitialized = true;
    console.log('Parse SDK initialized successfully');

    // Check if database cleanup is needed (async, don't block initialization)
    // checkAndCleanupIfNeeded()
    //   .then(cleanedUp => {
    //     if (cleanedUp) {
    //       console.log('Database cleanup completed during initialization');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error during database cleanup check:', error);
    //   });
  } catch (error) {
    console.error('Failed to initialize Parse SDK:', error);

    // If initialization fails due to full database, try cleanup and retry
    if (
      error instanceof Error &&
      (error.message?.includes('SQLITE_FULL') ||
        error.message?.includes('database or disk is full'))
    ) {
      console.log('Database full during initialization, attempting cleanup...');
      try {
        await Parse.Object.unPinAllObjects();
      } catch (error) {
        console.error('Failed to unpin all objects:', error);
      }
    }

    throw error;
  }
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
