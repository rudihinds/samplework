'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class IncomeSchema extends Schema {
  up() {
    this.create('incomes', (table) => {
      table.increments();
      table.decimal('myself', 20, 2).nullable().defaultTo(0);
      table.decimal('partner', 20, 2).nullable().defaultTo(0);
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('incomes');
  }
}

module.exports = IncomeSchema;
