const path = require('path');
const { merge } = require('webpack-merge');

const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const production = require('./webpack.config');

module.exports = merge(production, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    contentBase: path.join('__dirname', 'dist'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    hot: true,
    index: '',
    proxy: {
      context: () => true,
      target: 'http://localhost:3333'
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshPlugin()],
  output: {
    path: path.resolve(__dirname, '../../public/v2'),
    filename: 'bundle.v2.development.js',
    publicPath: '/dist/'
  }
});
