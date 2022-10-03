const User = use('App/Models/User');
const Plan = use('App/Models/Plan');
const { omit } = require('lodash');
const isAuthenticated = require('../../utils/isAuthenticated');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');

const resolvers = {
  Query: {
    async me(_obj, _args, { auth }) {
      const user = await User.find(auth.user.id);
      return user.toJSON();
    }
  },
  Mutation: {
    async updateCurrentUser(_, { input }, { auth }) {
      try {
        const userId = auth.user.id;
        const user = await User.find(userId);
        user.merge(input);
        await user.save();
        return user.toJSON();
      } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
      }
    }
  },
  User: {
    async plans(userInJson, { orderBy = [] }) {
      // Convert JSON to model instance
      const user = new User();
      user.newUp(userInJson);

      const plans = await user.plans().orderBy(orderBy).fetch();
      return plans.toJSON();
    },
    async default_plan(obj) {
      try {
        const user = new User();
        user.newUp(obj);
        // Sets default plan if null
        if (user.default_plan_id === null) {
          // If no plans, then create a blank plan
          const plansCount = await user.plans().getCount();
          if (plansCount <= 0) {
            await Plan.create({ user_id: user.id });
          }
          const latestPlan = await user
            .plans()
            .orderBy([{ column: 'created_at', order: 'DESC' }])
            .first();
          if (latestPlan) {
            user.default_plan_id = latestPlan.id;
          }
          await user.save();
        }
        const plan = await user.default_plan().fetch();
        return plan.toJSON();
      } catch (error) {
        throw new Error(`Error finding default_plan ${error.message}`);
      }
    }
  }
};

const resolversComposition = {
  'Query.me': [isAuthenticated()],
  'Mutation.updateCurrentUser': [isAuthenticated()]
};

module.exports = composeResolvers(resolvers, resolversComposition);
