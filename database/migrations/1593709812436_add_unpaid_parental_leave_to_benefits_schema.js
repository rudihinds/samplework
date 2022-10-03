'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddUnpaidParentalLeaveToBenefitsSchema extends Schema {
  up() {
    this.table('benefits', (table) => {
      table.integer('unpaid_parental_leave').defaultTo(0);
      table.integer('unpaid_parental_leave_partner').defaultTo(0);
    });
  }

  down() {
    this.table('benefits', (table) => {
      table.dropColumn('unpaid_parental_leave');
      table.dropColumn('unpaid_parental_leave_partner');
    });
  }
}

module.exports = AddUnpaidParentalLeaveToBenefitsSchema;
