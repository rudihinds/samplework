'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FertilityOptionsLowercaseSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      this.raw(`
        ALTER TABLE plans
          DROP CONSTRAINT IF EXISTS "plans_fertility_type_check",
          ADD CONSTRAINT "plans_fertility_type_check" CHECK (fertility_type IN (null, 'ivf'::text, 'other'::text))
      `);
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = FertilityOptionsLowercaseSchema;
