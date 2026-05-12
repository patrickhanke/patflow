export { default as getFcmToken } from './getFcmToken';
export { default as listenForMessages } from './listenForMessages';
export * from './requestUserPermission';
export * from './displayNotification';
// Side-effect import: do NOT import from this barrel to register the handler.
// Register it from `index.js` via `./backgroundMessageHandler` directly so it
// runs before AppRegistry.registerComponent.
