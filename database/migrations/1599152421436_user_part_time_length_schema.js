'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserPartTimeLengthSchema extends Schema {
  up() {
    this.table('benefits', (table) => {
      table.integer('part_time_length').default(0);
      table.integer('part_time_length_partner').default(0);
    });
  }

  down() {
    this.table('benefits', (table) => {
      table.dropColumn('part_time_length');
      table.dropColumn('part_time_length_partner');
    });
  }
}

module.exports = UserPartTimeLengthSchema;
