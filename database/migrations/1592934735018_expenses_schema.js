'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ExpensesSchema extends Schema {
  up() {
    this.create('expenses', (table) => {
      table.increments();
      table.integer('child_care_type').defaultTo(0);
      table.decimal('child_care_cost', 20, 2).nullable().defaultTo(0);
      table.integer('fertility_treatment_type').defaultTo(0);
      table.decimal('fertility_treatment_cost', 20, 2).nullable().defaultTo(0);
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('expenses');
  }
}

module.exports = ExpensesSchema;
