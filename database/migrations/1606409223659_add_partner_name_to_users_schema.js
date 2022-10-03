'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddPartnerNameToUsersSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('partner_name').default(null);
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('partner_name');
    });
  }
}

module.exports = AddPartnerNameToUsersSchema;
