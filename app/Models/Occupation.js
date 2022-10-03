'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Occupation extends Model {
  income() {
    return this.hasMany('App/Models/Income');
  }
}

module.exports = Occupation;
