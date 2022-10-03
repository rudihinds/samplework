'use strict';

const Occupation = use('App/Models/Occupation');

class OccupationController {
  async index({ response }) {
    const occupations = await Occupation.query().orderBy('name').fetch();

    return response.json(occupations);
  }
}

module.exports = OccupationController;
