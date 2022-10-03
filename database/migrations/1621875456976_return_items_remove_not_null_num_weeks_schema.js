'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReturnItemsRemoveNotNullNumWeeksSchema extends Schema {
  up() {
    this.table('return_items', (table) => {
      // alter table
      this.raw(`
        ALTER TABLE return_items
        ALTER COLUMN num_weeks DROP NOT NULL,
        ALTER COLUMN num_weeks DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('return_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = ReturnItemsRemoveNotNullNumWeeksSchema;
