'use strict';

const fetch = require('node-fetch');
const { validateAll } = use('Validator');

class ChildcarePredictionController {
  async index({ request, response }) {
    const rules = {
      zip: 'required|integer',
      numOfInfants: 'required|integer'
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const careResponse = await fetch(
      'https://www.care.com/platform/spi/rates/jobRateByZip?' +
        new URLSearchParams({
          zip: request.input('zip'),
          numOfInfants: request.input('numOfInfants'),
          apiKey: 'cmtux62opFFZ8Aov8J0aoJ1zRonczZyqP60pTTURdfIx'
        })
    );

    const careJSON = await careResponse.json();

    return response.status(careJSON.statusCode).json(careJSON.data);
  }
}

module.exports = ChildcarePredictionController;
