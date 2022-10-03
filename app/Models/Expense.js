'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const { invert, toString } = require('lodash');

class Expense extends Model {
  static CHILD_CARE_TYPES = Object.freeze({
    off: 0,
    nanny: 1,
    daycare: 2
  });

  static FERTILITY_TREATMENT_TYPES = Object.freeze({
    off: 0,
    ivf: 1
  });

  static IVF_COST_PER_CYCLE = 22000.0;

  static boot() {
    super.boot();
    this.addHook('beforeSave', async (expenseInstance) => {
      if (
        expenseInstance.dirty.fertility_treatment_cycles != null ||
        expenseInstance.dirty.fertility_treatment_type != null
      ) {
        expenseInstance._calculateFertilityTreatmentCost();
      }
    });
  }

  getChildCareType(value) {
    return invert(Expense.CHILD_CARE_TYPES)[toString(value)];
  }

  setChildCareType(value) {
    return Expense.CHILD_CARE_TYPES[value] || 0;
  }

  getFertilityTreatmentType(value) {
    return invert(Expense.FERTILITY_TREATMENT_TYPES)[toString(value)];
  }

  setFertilityTreatmentType(value) {
    return Expense.FERTILITY_TREATMENT_TYPES[value] || 0;
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  _calculateFertilityTreatmentCost() {
    if (this.fertility_treatment_type === 0) {
      this.fertility_treatment_cycles = 0;
    }
    // NOTE: IVF is the only fertility treatment available now, but if this changes
    // We should calculate treatment cost based on treatment type
    this.fertility_treatment_cost = this.fertility_treatment_cycles * Expense.IVF_COST_PER_CYCLE;
  }
}

module.exports = Expense;
