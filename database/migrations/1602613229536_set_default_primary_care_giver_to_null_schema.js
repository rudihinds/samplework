'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SetDefaultPrimaryCareGiverToNullSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.boolean('is_primary_care_giver').nullable().defaultTo(null).alter();
    });
  }

  down() {
    this.table('users', (table) => {
      table.boolean('is_primary_care_giver').nullable().defaultTo(true).alter();
    });
  }
}

module.exports = SetDefaultPrimaryCareGiverToNullSchema;
