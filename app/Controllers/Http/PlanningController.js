'use strict';

/** @type {import('../../Services/PlanningService')} */
const PlanningService = use('App/Services/PlanningService');

class PlanningController {
  /**
   * Create an income projection to some years based on
   * the user income information and calculating the compound increment
   * over the years
   */
  async income({ auth, request, response }) {
    const years = request.input('years_in_future', 5);
    const plan = new PlanningService({ user: auth.user, years });
    const { selfIncome, partnerIncome, totalLoss } = await plan.calculateIncomePlan(request.all());

    return response.json({
      self: selfIncome,
      partner: partnerIncome,
      totalLoss: totalLoss
    });
  }

  /**
   * Create an expenses projection based on the user expenses information over the years
   */
  async expenses({ auth, request, response }) {
    const years = request.input('years_in_future', 5);
    const plan = new PlanningService({ user: auth.user, years });
    const expenses = await plan.calculateExpenses(request.all());

    return response.json({ expenses });
  }
}

module.exports = PlanningController;
