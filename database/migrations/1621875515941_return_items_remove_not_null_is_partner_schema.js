'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReturnItemsRemoveNotNullIsPartnerSchema extends Schema {
  up() {
    this.table('return_items', (table) => {
      // alter table
      this.raw(`
        ALTER TABLE return_items
        ALTER COLUMN is_partner DROP NOT NULL,
        ALTER COLUMN is_partner DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('return_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = ReturnItemsRemoveNotNullIsPartnerSchema;
