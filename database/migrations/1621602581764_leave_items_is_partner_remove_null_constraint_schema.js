'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LeaveItemsIsPartnerRemoveNullConstraintSchema extends Schema {
  up() {
    this.table('leave_items_is_partner_remove_null_constraints', (table) => {
      this.raw(`
        ALTER TABLE leave_items
        ALTER COLUMN is_partner DROP NOT NULL,
        ALTER COLUMN is_partner DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('leave_items_is_partner_remove_null_constraints', (table) => {
      // reverse alternations
    });
  }
}

module.exports = LeaveItemsIsPartnerRemoveNullConstraintSchema;
