'use strict';

const Model = use('Model');

class NotifyUser extends Model {
  user() {
    this.belongsTo('App/Models/User');
  }
}

module.exports = NotifyUser;
