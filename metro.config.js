const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts }
} = defaultConfig;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // transformer: {
  //   babelTransformerPath: require.resolve('react-native-svg-transformer'),
  // },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'svg'],
    // Polyfills for Node.js core modules (required for Parse SDK)
    extraNodeModules: {
      stream: require.resolve('readable-stream'),
      events: require.resolve('events'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('./shims/crypto.js'),
      zlib: require.resolve('browserify-zlib'),
      util: require.resolve('util'),
      assert: require.resolve('assert'),
      // Empty mocks for server-only modules
      net: require.resolve('./shims/empty.js'),
      tls: require.resolve('./shims/empty.js'),
      fs: require.resolve('./shims/empty.js'),
      dns: require.resolve('./shims/empty.js')
    }
  },
  watchFolders: [path.resolve(__dirname)]
};

module.exports = mergeConfig(defaultConfig, config);
