'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddOccupationsToIncomesSchema extends Schema {
  up() {
    this.table('incomes', (table) => {
      table.integer('occupation_id').nullable().unsigned().references('id').inTable('occupations');
      table.integer('partner_occupation_id').nullable().unsigned().references('id').inTable('occupations');
    });
  }

  down() {
    this.table('incomes', (table) => {
      table.dropColumn('occupation_id');
      table.dropColumn('partner_occupation_id');
    });
  }
}

module.exports = AddOccupationsToIncomesSchema;
