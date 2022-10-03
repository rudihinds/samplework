'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CreateNotifyMeSchema extends Schema {
  up() {
    this.create('notify_users', (table) => {
      table.increments();
      table.bigInteger('user_id').references('id').inTable('users').notNullable().index();
      table.string('type').notNullable().index();
      table.boolean('sent').index();
      table.timestamps();
    });
  }

  down() {
    this.drop('notify_users');
  }
}

module.exports = CreateNotifyMeSchema;
