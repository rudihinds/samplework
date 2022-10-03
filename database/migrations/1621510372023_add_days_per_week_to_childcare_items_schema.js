'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddDaysPerWeekToChildcareItemsSchema extends Schema {
  up() {
    this.table('childcare_items', (table) => {
      // alter table
      table.integer('days_per_week').nullable();
    });
  }

  down() {
    this.table('childcare_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddDaysPerWeekToChildcareItemsSchema;
