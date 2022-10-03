'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddFamilyPlansToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('family_plans').default(null);
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('family_plans');
    });
  }
}

module.exports = AddFamilyPlansToUsersSchema;
