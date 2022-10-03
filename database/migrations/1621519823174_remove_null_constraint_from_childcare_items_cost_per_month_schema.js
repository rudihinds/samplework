'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RemoveNullConstraintFromChildcareItemsCostPerMonthSchema extends Schema {
  up() {
    this.table('childcare_items', (table) => {
      // alter table
      this.raw(`
        ALTER TABLE childcare_items
        ALTER COLUMN cost_per_month DROP NOT NULL,
        ALTER COLUMN cost_per_month DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('childcare_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RemoveNullConstraintFromChildcareItemsCostPerMonthSchema;
