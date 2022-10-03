'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RenameChildbirthYearIndexToChildbirthYearSchema extends Schema {
  up() {
    this.table('plans', (table) => {
      table.renameColumn('childbirth_year_index', 'childbirth_year');
    });
  }

  down() {
    this.table('plans', (table) => {
      // reverse alternations
    });
  }
}

module.exports = RenameChildbirthYearIndexToChildbirthYearSchema;
