const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.setPublicPath('../../public').setResourceRoot('resources');

mix
  .webpackConfig({
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    }
  })
  .override((config) => {
    config.module.rules.find((rule) => rule.test.test('.svg')).exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: 'html-loader' }]
    });

    config.module.rules.find((rule) => {
      return (
        rule.test.test('.woff2') ||
        rule.test.test('.woff') ||
        rule.test.test('.ttf') ||
        rule.test.test('.eot') ||
        rule.test.test('.otf')
      );
    }).exclude = /\.(otf|ttf|eot|woff|woff2)$/;
    config.module.rules.push({
      test: /\.(otf|ttf|eot|woff|woff2)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'v1/fonts/[name].[ext]'
          }
        }
      ]
    });
  });

mix
  .react('js/application.js', 'v1/js')
  .sass('sass/application.scss', 'v1/css')
  .sourceMaps();

if (mix.inProduction()) {
  mix.version();
}

// mix.browserSync({
//   host: 'localhost',
//   port: 5000,
//   files: ['resources/views/**/*', 'app/Controllers/**/*'],
//   open: false,
//   proxy: {
//     target: 'http://localhost:3333/',
//     proxyReq: [
//       (proxyReq) => {
//         proxyReq.setHeader('X-Forwarded-Host', 'localhost:5000');
//       }
//     ]
//   }
// });
