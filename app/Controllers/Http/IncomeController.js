'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Income = use('App/Models/Income');
const Occupation = use('App/Models/Occupation');
const { validateAll } = use('Validator');

/**
 * Resourceful controller for interacting with incomes
 */
class IncomeController {
  /**
   * Create/update authenticated user's income.
   * POST incomes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const validation = await validateAll(request.all(), {
      myself: 'number|above:-1',
      partner: 'number|above:-1',
      full_time_hrs: 'integer|above:-1',
      full_time_hrs_partner: 'integer|above:-1',
      occupation_id: 'integer',
      partner_occupation_id: 'integer'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const income = await Income.findOrNew({ user_id: auth.user.id });
    income.merge(request.only(['myself', 'partner', 'full_time_hrs', 'full_time_hrs_partner']));
    await auth.user.income().save(income);
    const { occupation_id, partner_occupation_id } = request.only(['occupation_id', 'partner_occupation_id']);
    if (occupation_id != null) {
      const occupation = await Occupation.find(occupation_id);
      if (occupation) {
        await income.occupation().associate(occupation);
      } else {
        await income.occupation().dissociate();
      }
    }
    if (partner_occupation_id != null) {
      const occupation = await Occupation.find(partner_occupation_id);
      if (occupation) {
        await income.partner_occupation().associate(occupation);
      } else {
        await income.partner_occupation().dissociate();
      }
    }
    await income.loadMany(['occupation', 'partner_occupation']);

    return response.json(income);
  }

  /**
   * Display authenticated user's income.
   * GET incomes/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, response }) {
    try {
      const income = await auth.user.income().with('occupation').with('partner_occupation').first();

      return response.json(income);
    } catch (e) {
      return response.status(404).json({
        error: 'Income not found'
      });
    }
  }
}

module.exports = IncomeController;
