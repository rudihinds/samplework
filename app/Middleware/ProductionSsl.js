'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env');

class ProductionSsl {
  /**
   * Redirects every request that comes from http to https protocol. This only works on production
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
   */
  async handle({ request, response }, next) {
    if (Env.get('NODE_ENV', 'local') === 'production' && request.header('x-forwarded-proto') !== 'https') {
      const resourceUrl = new URL(`${request.protocol()}://${request.hostname()}${request.originalUrl()}`);
      resourceUrl.protocol = 'https';
      return response.redirect(resourceUrl.href);
    }

    await next();
  }
}

module.exports = ProductionSsl;
