'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddCurrencyToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('currency').default('USD');
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('currency');
    });
  }
}

module.exports = AddCurrencyToUsersSchema;
