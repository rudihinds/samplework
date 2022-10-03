'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropViewTypeFromPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.dropColumn('view_type');
    });
  }

  down() {
    this.table('drop_view_type_from_plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = DropViewTypeFromPlansSchema;
