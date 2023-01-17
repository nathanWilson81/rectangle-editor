module.exports = {
  extends: [
    'plugin:prettier/recommended'
  ],
  plugins: ['react'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {},
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        semi: false
      },
    ],
  },
};
