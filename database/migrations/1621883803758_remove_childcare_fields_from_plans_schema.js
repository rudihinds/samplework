'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RemoveChildcareFieldsFromPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      // alter table
      table.dropColumn('childcare_type_id');
      table.dropColumn('childcare_monthly_cost');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RemoveChildcareFieldsFromPlansSchema;
