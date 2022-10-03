'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PlansSchema extends Schema {
  up() {
    this.create('plans', (table) => {
      table.increments();
      table.integer('user_id').references('id').inTable('users');
      table.integer('country_id'); // reference table
      table.string('zip_code');
      table.integer('self_annual_income');
      table.integer('self_hours_per_week');
      table.integer('self_industry_id'); // reference table
      table.integer('childbirth_year_index');
      table.integer('partner_annual_income');
      table.integer('partner_hours_per_week');
      table.integer('partner_industry_id');
      table.integer('expenses_mortgage_rent');
      table.integer('expenses_healthcare');
      table.integer('expenses_student_loan');
      table.integer('expenses_other');
      table.integer('childcare_type_id'); // enum
      table.integer('childcare_monthly_cost');
      table.integer('childcare_early_years_essentials');
      table.integer('fertility_type_id'); // enum
      table.integer('alternative_family_type_id'); // enum
      table.timestamps();
    });
  }

  down() {
    this.drop('plans');
  }
}

module.exports = PlansSchema;
