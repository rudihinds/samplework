'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BenefitsSchema extends Schema {
  up() {
    this.create('benefits', (table) => {
      table.increments();
      table.integer('parental_leave').unsigned().defaultTo(0);
      table.integer('parental_leave_partner').unsigned().defaultTo(0);
      table.integer('return_to_work').unsigned().defaultTo(0);
      table.integer('return_to_work_partner').unsigned().defaultTo(0);
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('benefits');
  }
}

module.exports = BenefitsSchema;
