'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddAlternativeFamilyTypeToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('alternative_family_type', [null, 'adoption', 'surrogacy']);
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddAlternativeFamilyTypeToPlansSchema;
