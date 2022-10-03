'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DropBenefitsSchema extends Schema {
  up() {
    this.dropTable('benefits');
  }

  down() {}
}

module.exports = DropBenefitsSchema;
