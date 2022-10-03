'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddPartTimeWorkToBenefitsSchema extends Schema {
  up() {
    this.table('benefits', (table) => {
      table.integer('part_time_work').default(0);
      table.integer('part_time_work_partner').default(0);
    });
  }

  down() {
    this.table('benefits', (table) => {
      table.dropColumn('part_time_work');
      table.dropColumn('part_time_work_partner');
    });
  }
}

module.exports = AddPartTimeWorkToBenefitsSchema;
