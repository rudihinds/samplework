'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddViewYearsToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('view_years', ['5', '10', '15', '25']).defaultTo('10');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddViewYearsToPlansSchema;
