'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddDefaultPlanIdToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.integer('default_plan_id').references('id').inTable('plans');
    });
  }

  down() {
    this.table('users', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddDefaultPlanIdToUsersSchema;
