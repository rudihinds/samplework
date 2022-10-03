'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class LeaveItem extends Model {
  plan() {
    return this.hasOne('App/Models/Plan');
  }
}

module.exports = LeaveItem;
