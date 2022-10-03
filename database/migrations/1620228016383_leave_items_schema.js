'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeaveItemsSchema extends Schema {
  up () {
    this.create('leave_items', (table) => {
      table.increments();
      table.integer('plan_id').notNullable().references('id').inTable('plans');
      table.integer('num_weeks').notNullable().defaultTo(0);
      table.decimal('salary_fraction', 4, 2).notNullable().defaultTo(0.0);
      table.boolean('is_partner').notNullable().defaultTo(false);
      table.timestamps();
    })
  }

  down () {
    this.drop('leave_items')
  }
}

module.exports = LeaveItemsSchema
