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
          '@provider': './src/provider',
          '@types': './src/types',
          '@content': './content'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};

// https://www.reactnativeschool.com/how-to-setup-path-alias-in-a-react-native-typescript-app
