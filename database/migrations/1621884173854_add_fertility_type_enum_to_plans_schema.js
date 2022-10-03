'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddFertilityTypeEnumToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('fertility_type', [null, 'IVF', 'Other']);
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddFertilityTypeEnumToPlansSchema;
