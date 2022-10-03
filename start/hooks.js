const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Request = use('Adonis/Src/Request');
  const Config = use('Config');
  const Env = use('Env');

  Request.macro('wantsJson', function () {
    return this.accepts(['json']) === 'json';
  });

  Request.macro('fromMobileApp', function () {
    return this.header('x-requested-from') === Config.get('app.mobileAppName');
  });

  const View = use('View');
  const Helpers = use('Helpers');
  const fs = require('fs');

  View.global('to_JSON', (obj) => JSON.stringify(obj));
  View.global('env', (key) => Env.get(key));
  // Creating the mix function in edge views
  View.global('mix', function (asset) {
    if (!asset.startsWith('/')) {
      asset = `/${asset}`;
    }

    const isHRMOn = fs.existsSync(Helpers.publicPath('hot'));
    if (isHRMOn) {
      let url = fs.readFileSync(Helpers.publicPath('hot'), { encoding: 'utf8', flag: 'r' });
      url = url.trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        url = url.substring(url.indexOf(':') + 1);
        return `${url}${asset}`;
      }
      return `//localhost:8080${asset}`;
    }

    const manifest = require('../public/mix-manifest');
    if (!manifest[asset]) {
      throw new Error(`Unable to locate Mix file: ${asset}.`);
    }

    return manifest[asset];
  });

  // global to create urls to app
  View.global('appUrl', (path) => {
    const APP_URL = Env.get('APP_URL');

    return path ? `${APP_URL}/${path}` : APP_URL;
  });
});
