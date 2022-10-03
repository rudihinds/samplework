'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropOccupationsSchema extends Schema {
  up() {
    this.dropTable('occupations');
  }

  down() {}
}

module.exports = DropOccupationsSchema;
