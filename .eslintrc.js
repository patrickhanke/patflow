module.exports = {
  root: true,
  extends: ['@react-native'],
  plugins: ['jest', 'prettier'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'react-hooks/exhaustive-deps': 'off',
    'comma-dangle': ['error', 'never'],
    'react/no-unstable-nested-components': 'off',
    'react-native/no-inline-styles': 'off',
    '@react-native/no-deep-imports': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'none'
      }
    ]
  },
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
};
