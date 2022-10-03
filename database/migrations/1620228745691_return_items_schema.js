'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReturnItemsSchema extends Schema {
  up () {
    this.create('return_items', (table) => {
      table.increments();
      table.integer('plan_id').notNullable().references('id').inTable('plans');
      table.integer('num_hours').notNullable().defaultTo(0);
      table.integer('num_weeks').notNullable().defaultTo(0);
      table.boolean('is_partner').notNullable().defaultTo(false);
      table.timestamps();
    })
  }

  down () {
    this.drop('return_items')
  }
}

module.exports = ReturnItemsSchema
