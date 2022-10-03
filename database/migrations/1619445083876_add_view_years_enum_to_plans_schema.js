'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddViewYearsEnumToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('view_years', ['5', '10', '15', '20']).notNullable().defaultTo('10');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddViewYearsEnumToPlansSchema;
