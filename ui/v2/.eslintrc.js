const hq = require('alias-hq');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  ignorePatterns: ['.storybook/*', 'storybook-static/*', 'src/stories/*'],
  rules: {
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: Object.entries(hq.get('webpack')),
        extensions: ['.js', '.jsx']
      }
    }
  }
};

// console.log(Object.entries(hq.get('webpack')));
