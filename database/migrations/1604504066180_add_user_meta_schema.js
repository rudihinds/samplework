'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddUserMetaSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.json('meta').default('{}');
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('meta');
    });
  }
}

module.exports = AddUserMetaSchema;
