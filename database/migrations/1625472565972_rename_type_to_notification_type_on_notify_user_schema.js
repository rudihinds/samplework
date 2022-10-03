'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RenameTypeToNotificationTypeOnNotifyUserSchema extends Schema {
  up() {
    this.table('notify_users', (table) => {
      table.renameColumn('type', 'notification_type');
    });
  }

  down() {
    this.table('notify_users', (table) => {});
  }
}

module.exports = RenameTypeToNotificationTypeOnNotifyUserSchema;
