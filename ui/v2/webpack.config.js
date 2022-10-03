const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const hq = require('alias-hq');
const sass = require('sass');

// Production config
// Merged into webpack.dev.js for local development

module.exports = {
  entry: path.resolve(__dirname, './src/index.jsx'),
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|css)$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            // First we transform SASS to standard CSS
            loader: 'sass-loader',
            options: {
              implementation: sass
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              namedExport: 'SVG'
            }
          },
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: hq.get('webpack')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        '../../resources/views/v2.edge.template'
      ),
      filename: path.resolve(__dirname, '../../resources/views/v2.edge'),
      inject: 'body',
      minify: false
    }),
    new CleanWebpackPlugin()
  ],
  output: {
    path: path.resolve(__dirname, '../../public/v2'),
    filename: 'bundle.v2.[contenthash].js',
    publicPath: '/v2/'
  }
};
