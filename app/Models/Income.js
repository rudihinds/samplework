'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Income extends Model {
  user() {
    return this.belongsTo('App/Models/User');
  }

  occupation() {
    return this.belongsTo('App/Models/Occupation', 'occupation_id');
  }

  partner_occupation() {
    return this.belongsTo('App/Models/Occupation', 'partner_occupation_id');
  }
}

module.exports = Income;
