'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddViewTypeToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('view_type', ['self', 'partner', 'joint']);
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddViewTypeToPlansSchema;
