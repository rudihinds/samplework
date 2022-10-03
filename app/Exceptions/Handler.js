'use strict';

const BaseExceptionHandler = use('BaseExceptionHandler');
const sentry = use('Sentry');

const noReportCodes = ['E_ROUTE_NOT_FOUND'];

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return response.status(404).send('Not found');
    }
    response.status(error.status).send(error.message);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    // Ignore specific error codes. Mainly for 404s from being scanned by bots
    // Avoids clogging up the Sentry quota
    if (noReportCodes.includes(error.code)) {
      return;
    }
    sentry.captureException(error);
  }
}

module.exports = ExceptionHandler;
