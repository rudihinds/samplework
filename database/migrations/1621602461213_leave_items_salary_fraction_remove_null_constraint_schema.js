'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LeaveItemsSalaryFractionRemoveNullConstraintSchema extends Schema {
  up() {
    this.table('leave_items', (table) => {
      this.raw(`
        ALTER TABLE leave_items
        ALTER COLUMN salary_fraction DROP NOT NULL,
        ALTER COLUMN salary_fraction DROP DEFAULT;
      `);
    });
  }

  down() {
    this.table('leave_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = LeaveItemsSalaryFractionRemoveNullConstraintSchema;
