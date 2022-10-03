'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddViewTypeEnumToPlansSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.enu('view_type', ['self', 'partner', 'joint']).notNullable().defaultTo('self');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddViewTypeEnumToPlansSchema;
