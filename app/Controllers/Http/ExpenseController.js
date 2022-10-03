'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Expense = use('App/Models/Expense');
const { validateAll } = use('Validator');
/**
 * Resourceful controller for interacting with expenses
 */
class ExpenseController {
  /**
   * Create/save a new expense.
   * POST expenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const validation = await validateAll(request.all(), {
      child_care_type: `string|in:${Object.keys(Expense.CHILD_CARE_TYPES)}`,
      child_care_cost: 'number|above:-1',
      fertility_treatment_type: `string|in:${Object.keys(Expense.FERTILITY_TREATMENT_TYPES)}`,
      fertility_treatment_cycles: 'integer|above:-1'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const expense = await Expense.findOrNew({ user_id: auth.user.id });
    expense.merge(
      request.only(['child_care_type', 'child_care_cost', 'fertility_treatment_type', 'fertility_treatment_cycles'])
    );
    await auth.user.expense().save(expense);

    return response.json(expense);
  }

  /**
   * Display a single expense.
   * GET expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, response }) {
    try {
      const expense = await auth.user.expense().first();

      return response.json(expense);
    } catch (error) {
      return response.status(404).json({
        error: 'Expenses not found'
      });
    }
  }
}

module.exports = ExpenseController;
