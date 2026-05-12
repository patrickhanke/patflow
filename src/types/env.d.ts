/**
 * Environment variable type definitions
 */

declare module '@env' {
  export const SASHIDO_APP_ID: string;
  export const SASHIDO_JS_KEY: string;
  export const SASHIDO_REST_KEY: string;
  export const SASHIDO_MASTER_KEY: string;
  export const SASHIDO_SERVER_URL: string;
  export const SASHIDO_API_URL: string;
  export const FIREBASE_APP_ID: string;
  export const GCMS_SENDER_ID: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SASHIDO_APP_ID: string;
      SASHIDO_JS_KEY: string;
      SASHIDO_REST_KEY: string;
      SASHIDO_MASTER_KEY: string;
      SASHIDO_SERVER_URL: string;
      SASHIDO_API_URL: string;
      FIREBASE_APP_ID: string;
      GCMS_SENDER_ID: string;
    }
  }
}

export {};
