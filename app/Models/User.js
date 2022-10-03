'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const moment = require('moment');

class User extends Model {
  static boot() {
    super.boot();

    this.addHook('beforeSave', async (userInstance) => {
      /**
       * A hook to hash the user password before saving
       * it to the database.
       */
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }

      if (userInstance.dirty.currency) {
        userInstance.currency = userInstance.currency.toUpperCase();
      }
    });
  }

  static get hidden() {
    return ['password'];
  }

  static get computed() {
    return ['age', 'partner_age'];
  }

  static get dates() {
    return super.dates.concat(['birthdate', 'partner_birthdate']);
  }

  static castDates(field, value) {
    if (field === 'birthdate' || field === 'partner_birthdate') {
      return value.format('YYYY-MM-DD');
    }
    return super.formatDates(field, value);
  }

  getAge({ birthdate }) {
    const age = moment().diff(birthdate, 'years');
    if (isNaN(age)) return null;
    return age;
  }

  getPartnerAge({ partner_birthdate }) {
    const age = moment().diff(partner_birthdate, 'years');
    if (isNaN(age)) return null;
    return age;
  }

  get age() {
    return this.getAge(this.$attributes);
  }

  get partner_age() {
    return this.getPartnerAge(this.$attributes);
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  income() {
    return this.hasOne('App/Models/Income');
  }

  benefit() {
    return this.hasOne('App/Models/Benefit');
  }

  expense() {
    return this.hasOne('App/Models/Expense');
  }

  location() {
    return this.hasOne('App/Models/Location');
  }

  plans() {
    return this.hasMany('App/Models/Plan');
  }

  default_plan() {
    return this.belongsTo('App/Models/Plan', 'default_plan_id', 'id');
  }
}

module.exports = User;
