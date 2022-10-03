'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RemoveFertilityFieldsFromPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.dropColumn('fertility_type_id');
      table.dropColumn('alternative_family_type_id');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RemoveFertilityFieldsFromPlansSchema;
