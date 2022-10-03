'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AllowNullOnChildcareTypeCheckConstraintSchema extends Schema {
  up() {
    this.table('childcare_items', (table) => {
      // alter table
      this.raw(`
        ALTER TABLE childcare_items
          DROP CONSTRAINT IF EXISTS "childcare_items_childcare_type_check",
          ADD CONSTRAINT "childcare_items_childcare_type_check" CHECK (childcare_type IN (null, 'daycare'::text, 'nanny'::text, 'family_or_friend'::text, 'newborn_care_specialist'::text, 'nanny_share'::text, 'childcare_pool'::text))
      `);
    });
  }

  down() {
    this.table('childcare_items', (table) => {
      // reverse alternations
    });
  }
}

module.exports = AllowNullOnChildcareTypeCheckConstraintSchema;
