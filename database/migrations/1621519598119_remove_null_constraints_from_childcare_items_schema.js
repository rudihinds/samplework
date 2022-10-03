'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RemoveNullConstraintsFromChildcareItemsSchema extends Schema {
  up() {
    this.table('childcare_items', (table) => {
      this.raw(`
        ALTER TABLE childcare_items
        ALTER COLUMN childcare_type
        DROP NOT NULL;
      `);
    });
  }

  down() {
    this.table('childcare_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RemoveNullConstraintsFromChildcareItemsSchema;
