'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SetDefaultChildbirthYearSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      this.raw(`
        ALTER TABLE plans
        ALTER COLUMN childbirth_year
        SET DEFAULT (date_part('year', current_date) + 1)
      `);
    });
  }

  down() {
    this.table('plans', (table) => {});
  }
}

module.exports = SetDefaultChildbirthYearSchema;
