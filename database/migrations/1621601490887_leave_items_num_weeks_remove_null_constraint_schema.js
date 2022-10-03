'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LeaveItemsNumWeeksRemoveNullConstraintSchema extends Schema {
  up() {
    this.table('leave_items', (table) => {
      this.raw(`
        ALTER TABLE leave_items
        ALTER COLUMN num_weeks DROP NOT NULL,
        ALTER COLUMN num_weeks DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('leave_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = LeaveItemsNumWeeksRemoveNullConstraintSchema;
