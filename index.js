/**
 * @format
 */

// Polyfills for Parse SDK (must be imported before anything else)
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import process from 'process';
global.process = process;

import { AppRegistry } from 'react-native';

// Must be registered before AppRegistry.registerComponent so FCM can invoke it
// when the app is in a killed/quit state.
import './src/provider/gcm/backgroundMessageHandler';

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
