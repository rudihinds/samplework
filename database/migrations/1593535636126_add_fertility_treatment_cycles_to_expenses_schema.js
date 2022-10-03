'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddFertilityTreatmentCyclesToExpensesSchema extends Schema {
  up() {
    this.table('expenses', (table) => {
      table.integer('fertility_treatment_cycles').defaultTo(0);
    });
  }

  down() {
    this.table('expenses', (table) => {
      table.dropColumn('fertility_treatment_cycles');
    });
  }
}

module.exports = AddFertilityTreatmentCyclesToExpensesSchema;
