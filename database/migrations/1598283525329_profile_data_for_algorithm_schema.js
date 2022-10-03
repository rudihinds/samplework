'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProfileDataForAlgorithmSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('gender').nullable();
      table.string('partner_gender').nullable();
      table.date('birthdate').nullable();
      table.date('partner_birthdate').nullable();
      table.integer('career_begin_age').nullable();
      table.integer('partner_career_begin_age').nullable();
      table.boolean('is_primary_care_giver').defaultTo(true);
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('gender');
      table.dropColumn('partner_gender');
      table.dropColumn('birthdate');
      table.dropColumn('partner_birthdate');
      table.dropColumn('career_begin_age');
      table.dropColumn('partner_career_begin_age');
      table.dropColumn('is_primary_care_giver');
    });
  }
}

module.exports = ProfileDataForAlgorithmSchema;
