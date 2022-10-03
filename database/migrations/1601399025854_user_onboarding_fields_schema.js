'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserOnboardingFieldsSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.boolean('has_partner').default(null);
      table.date('onboarding_finished_at').default(null);
    });
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('has_partner');
      table.dropColumn('onboarding_finished_at');
    });
  }
}

module.exports = UserOnboardingFieldsSchema;
