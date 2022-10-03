'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropExpensesSchema extends Schema {
  up() {
    this.dropTable('expenses');
  }

  down() {}
}

module.exports = DropExpensesSchema;
