'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropLocationsSchema extends Schema {
  up() {
    this.dropTable('locations');
  }

  down() {}
}

module.exports = DropLocationsSchema;
