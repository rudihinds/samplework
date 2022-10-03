'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChildcareItemsSchema extends Schema {
  up () {
    this.create('childcare_items', (table) => {
      table.increments();
      table.integer('plan_id').notNullable().references('id').inTable('plans');
      table.enum('childcare_type', ['daycare', 'nanny', 'family_or_friend', 'night_nurse', 'nanny_share']).notNullable();
      table.integer('cost_per_month').notNullable().defaultTo(0);
      table.timestamps();
    })
  }

  down () {
    this.drop('childcare_items')
  }
}

module.exports = ChildcareItemsSchema
