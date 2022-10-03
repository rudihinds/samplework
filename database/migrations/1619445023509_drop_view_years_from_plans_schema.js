'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropViewYearsFromPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.dropColumn('view_years');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = DropViewYearsFromPlansSchema;
