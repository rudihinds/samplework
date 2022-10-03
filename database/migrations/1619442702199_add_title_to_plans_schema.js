'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddTitleToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      // alter table
      table.string('title').after('user_id');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddTitleToPlansSchema;
