'use strict';

const { JsonDB } = require('node-json-db/dist/JsonDB');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const { validateAll } = use('Validator');
const Helpers = use('Helpers');
const Location = use('App/Models/Location');

class LocationController {
  async show({ auth, response }) {
    const location = (await auth.user.location().fetch()) || {};

    return response.json(location);
  }

  async store({ auth, request, response }) {
    const validation = await validateAll(request.all(), {
      zip_code: 'required|min:5'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }
    try {
      const zipCodesDB = new JsonDB(new Config(Helpers.databasePath('zipcodes.json')));
      const zip_code = request.input('zip_code');
      const { city, state } = zipCodesDB.getData(`/${zip_code}`);
      const location = await Location.findOrNew({ user_id: auth.user.id });
      location.merge({ zip_code, city, state });
      await auth.user.location().save(location);
      return response.json(location);
    } catch (error) {
      return response.status(422).json([
        {
          field: 'zip_code',
          message: `${request.input('zip_code')} is not a valid zip code in US`
        }
      ]);
    }
  }
}

module.exports = LocationController;
