'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Plan extends Model {
  static relationships = [
    'self_leave_items',
    'partner_leave_items',
    'self_return_items',
    'partner_return_items',
    'leave_items',
    'return_items',
    'childcare_items'
  ];
  static async generate_title_for_user(user) {
    const plansCount = await user.plans().getCount();
    return `Plan ${parseInt(plansCount, 10) + 1}`;
  }
  static boot() {
    super.boot();
    this.addHook('beforeCreate', async (instance) => {
      if (!instance.title) {
        const User = use('App/Models/User');
        const planUser = await User.find(instance.user_id);
        const plansCount = await planUser.plans().getCount();
        instance.title = `Plan ${parseInt(plansCount, 10) + 1}`;
      }
    });
  }
  user() {
    return this.hasOne('App/Models/User');
  }
  country() {
    return this.hasOne('App/Models/Country');
  }
  industry() {
    return this.hasOne('App/Models/Occupation');
  }
  leave_items() {
    return this.hasMany('App/Models/LeaveItem');
  }
  return_items() {
    return this.hasMany('App/Models/ReturnItem');
  }
  childcare_items() {
    return this.hasMany('App/Models/ChildcareItem');
  }
  clear() {
    // Sets default values
    this.merge({
      view_type: 'joint',
      view_years: '10',
      zip_code: null,
      self_annual_income: null,
      self_hours_per_week: null,
      self_industry_id: null,
      childbirth_year: null,
      partner_annual_income: null,
      partner_hours_per_week: null,
      partner_industry_id: null,
      expenses_mortgage_rent: null,
      expenses_healthcare: null,
      expenses_student_loan: null,
      expenses_other: null,
      childcare_early_years_essentials: null,
      fertility_type: null,
      alternative_family_type: null
    });
  }
  duplicate() {
    const newPlan = new Plan();
    newPlan.merge({
      user_id: this.user_id,
      country_id: this.country_id,
      zip_code: this.zip_code,
      self_annual_income: this.self_annual_income,
      self_hours_per_week: this.self_hours_per_week,
      self_industry_id: this.self_industry_id,
      childbirth_year: this.childbirth_year_index,
      partner_annual_income: this.partner_annual_income,
      partner_hours_per_week: this.partner_hours_per_week,
      partner_industry_id: this.partner_industry_id,
      expenses_mortgage_rent: this.expenses_mortgage_rent,
      expenses_healthcare: this.expenses_healthcare,
      expenses_student_loan: this.expenses_student_loan,
      expenses_other: this.expenses_other,
      childcare_early_years_essentials: this.childcare_early_years_essentials,
      title: null,
      view_type: this.view_type,
      view_years: this.view_years,
      fertility_type: this.fertility_type,
      alternative_family_type: this.alternative_family_type
    });
    return newPlan;
  }
}

module.exports = Plan;
