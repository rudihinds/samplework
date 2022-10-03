'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RenameNightNurseToNewbornCareSpecialistSchema extends Schema {
  up() {
    this.raw(`
      ALTER TABLE childcare_items
        DROP CONSTRAINT IF EXISTS "childcare_items_childcare_type_check",
        ADD CONSTRAINT "childcare_items_childcare_type_check" CHECK (childcare_type IN ('daycare'::text, 'nanny'::text, 'family_or_friend'::text, 'newborn_care_specialist'::text, 'nanny_share'::text, 'childcare_pool'::text))
    `);
  }

  down() {
    this.table('childcare_items', (table) => {});
  }
}

module.exports = RenameNightNurseToNewbornCareSpecialistSchema;
