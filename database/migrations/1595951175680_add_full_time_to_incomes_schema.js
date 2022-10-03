'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddFullTimeToIncomesSchema extends Schema {
  up() {
    this.table('incomes', (table) => {
      table.integer('full_time_hrs').nullable().default(0);
      table.integer('full_time_hrs_partner').nullable().default(0);
    });
  }

  down() {
    this.table('incomes', (table) => {
      table.dropColumn('full_time_hrs');
      table.dropColumn('full_time_hrs_partner');
    });
  }
}

module.exports = AddFullTimeToIncomesSchema;
