'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddPlanningParamsToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.json('planning_params');
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('planning_params');
    });
  }
}

module.exports = AddPlanningParamsToUsersSchema;
