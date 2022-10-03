'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class OccupationSchema extends Schema {
  up() {
    this.create('occupations', (table) => {
      table.increments();
      table.string('name');
      table.timestamps();
    });
  }

  down() {
    this.drop('occupations');
  }
}

module.exports = OccupationSchema;
