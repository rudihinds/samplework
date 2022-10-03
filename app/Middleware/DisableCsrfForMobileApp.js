'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Config = use('Config');

/**
 * NOTE: This middleware needs to be registered BEFORE Adonis/Middleware/Shield
 */
class DisableCsrfForMobileApp {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const fromMirzaApp = request.fromMobileApp();
    const routeIsApi = this._fromApiRoutes(request.url());
    const isValidatedMethod = this._fallsUnderValidationMethod(request.method());
    if (routeIsApi && fromMirzaApp && isValidatedMethod) {
      Config.set('shield.csrf.enable', false); // disable csrf in this request
    }
    await next();
  }

  _fallsUnderValidationMethod(method) {
    method = method.toLowerCase();
    return !!Config.get('shield.csrf.methods', []).find((definedMethod) => {
      return definedMethod.toLowerCase() === method;
    });
  }

  _fromApiRoutes(path) {
    return path.startsWith('/api');
  }
}

module.exports = DisableCsrfForMobileApp;
