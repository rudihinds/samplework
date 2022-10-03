const custom = require('../webpack.config.js');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5'
  },
  webpackFinal: (config) => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
      resolve: custom.resolve
    };
  }
};
