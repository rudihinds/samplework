'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropIncomesSchema extends Schema {
  up() {
    this.dropTable('incomes');
  }

  down() {}
}

module.exports = DropIncomesSchema;
