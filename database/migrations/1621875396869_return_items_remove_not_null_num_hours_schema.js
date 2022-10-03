'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReturnItemsRemoveNotNullNumHoursSchema extends Schema {
  up() {
    this.table('return_items', (table) => {
      this.raw(`
        ALTER TABLE return_items
        ALTER COLUMN num_hours DROP NOT NULL,
        ALTER COLUMN num_hours DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('return_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = ReturnItemsRemoveNotNullNumHoursSchema;
