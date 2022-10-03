'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddParentalLeavePercentageToBenefitsSchema extends Schema {
  up() {
    this.table('benefits', (table) => {
      table.integer('parental_leave_percentage').defaultTo(100);
      table.integer('parental_leave_percentage_partner').defaultTo(100);
    });
  }

  down() {
    this.table('benefits', (table) => {
      table.dropColumn('parental_leave_percentage');
      table.dropColumn('parental_leave_percentage_partner');
    });
  }
}

module.exports = AddParentalLeavePercentageToBenefitsSchema;
