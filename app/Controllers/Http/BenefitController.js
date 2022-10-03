'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const { validateAll } = use('Validator');
const Benefit = use('App/Models/Benefit');
/**
 * Resourceful controller for interacting with benefits
 */
class BenefitController {
  /**
   * Create/save a new benefit.
   * POST benefits
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const validation = await validateAll(request.all(), {
      parental_leave: 'integer|above:-1',
      parental_leave_partner: 'integer|above:-1',
      parental_leave_percentage: 'integer|above:0|under:101',
      parental_leave_percentage_partner: 'integer|above:0|under:101',
      unpaid_parental_leave: 'integer|above:-1',
      unpaid_parental_leave_partner: 'integer|above:-1',
      return_to_work: 'integer|above:-1',
      return_to_work_partner: 'integer|above:-1',
      part_time_work: 'integer|above:-1',
      part_time_length: 'integer|above:-1',
      part_time_work_partner: 'integer|above:-1',
      part_time_length_partner: 'integer|above:-1'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const benefit = await Benefit.findOrNew({ user_id: auth.user.id });
    benefit.merge(
      request.only([
        'parental_leave',
        'parental_leave_partner',
        'parental_leave_percentage',
        'parental_leave_percentage_partner',
        'unpaid_parental_leave',
        'unpaid_parental_leave_partner',
        'return_to_work',
        'return_to_work_partner',
        'part_time_work',
        'part_time_length',
        'part_time_work_partner',
        'part_time_length_partner'
      ])
    );
    await auth.user.benefit().save(benefit);

    return response.json(benefit);
  }

  /**
   * Display a single benefit.
   * GET benefits/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, response }) {
    try {
      const benefit = await auth.user.benefit().first();

      return response.json(benefit);
    } catch (error) {
      return response.status(404).json({
        error: 'Benefits not found'
      });
    }
  }
}

module.exports = BenefitController;
