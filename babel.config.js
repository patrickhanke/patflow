const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx'
        ],
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@provider': path.resolve(__dirname, 'src/provider'),
          '@types': path.resolve(__dirname, 'src/types'),
          '@content': path.resolve(__dirname, 'content')
        }
      }
    ]
  ]
};
// https://www.reactnativeschool.com/how-to-setup-path-alias-in-a-react-native-typescript-app
