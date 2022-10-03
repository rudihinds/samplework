'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ChangeViewTypeDefaultOnPlansSchema extends Schema {
  up() {
    this.raw(`
      ALTER TABLE plans
      ALTER COLUMN view_type
      SET DEFAULT 'joint';
    `);
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = ChangeViewTypeDefaultOnPlansSchema;
