const User = use('App/Models/User');
const Plan = use('App/Models/Plan');
const slugify = require('slugify');

const { omit } = require('lodash');

const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const GraphQLJSON = require('graphql-type-json');
const { ApolloServerPluginUsageReportingFromLegacyOptions } = require('apollo-server-core/dist/plugin/usageReporting');

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    async fetchPlan(_, { id }, { auth }) {
      const plan = await Plan.find(id);
      if (plan.user_id !== auth.user.id) {
        throw new Error('Not authorized to fetch this plan');
      }
      return plan.toJSON();
    },
    async me(_obj, _args, { auth }) {
      const user = await User.find(auth.user.id);
      return user.toJSON();
    }
  },
  Mutation: {
    // Add a new post
    async createPlan(_, { input }, { auth }) {
      try {
        const user = await auth.user;
        const rootFields = omit(input, ['leave_items', 'return_items', 'childcare_items']);
        const { id: insertId } = await Plan.create({
          ...rootFields,
          user_id: user.id
        });
        const plan = await Plan.find(insertId);

        if (input.leave_items && input.leave_items.length > 0) {
          await plan.leave_items().createMany(input.leave_items);
        }
        if (input.return_items && input.return_items.length > 0) {
          await plan.return_items().createMany(input.return_items);
        }
        if (input.childcare_items && input.childcare_items.length > 0) {
          await plan.childcare_items().createMany(input.childcare_items);
        }

        return plan;
      } catch (error) {
        throw new Error(`Error creating plan ${error.message}`);
      }
    },
    async updatePlan(_, { id, input }, { auth }) {
      try {
        const user = await auth.user;
        const rootFields = omit(input, Plan.relationships);
        const plan = await Plan.find(id);
        if (plan.user_id !== user.id) {
          throw new Error('Not authorized to update this plan');
        }
        plan.merge(rootFields);

        if (input.leave_items && input.leave_items.length > 0) {
          await Promise.all(
            input.leave_items.map(
              async (item) =>
                await plan
                  .leave_items()
                  .where('id', item.id)
                  .update(omit(item, ['id']))
            )
          );
        }

        if (input.return_items && input.return_items.length > 0) {
          await Promise.all(
            input.return_items.map(
              async (item) =>
                await plan
                  .return_items()
                  .where('id', item.id)
                  .update(omit(item, ['id']))
            )
          );
        }

        if (input.childcare_items && input.childcare_items.length > 0) {
          await Promise.all(
            input.childcare_items.map(
              async (item) =>
                await plan
                  .childcare_items()
                  .where('id', item.id)
                  .update(omit(item, ['id']))
            )
          );
        }

        await plan.save();
        return plan.toJSON();
      } catch (error) {
        throw new Error(`Error updating plan: ${error.message}`);
      }
    },
    async deletePlan(_, { id }, { auth }) {
      try {
        const plan = await Plan.find(id);
        if (plan.user_id !== auth.user.id) {
          throw new Error('Not authorized to delete this plan');
        }
        await plan.leave_items().delete();
        await plan.return_items().delete();
        await plan.childcare_items().delete();
        await plan.delete();
        return plan.toJSON();
      } catch (error) {
        throw new Error(`Error deleting plan: ${error.message}`);
      }
    },
    async clearPlan(_, { id }, { auth }) {
      try {
        const plan = await Plan.find(id);
        if (plan.user_id !== auth.user.id) {
          throw new Error('Not authorized to delete this plan');
        }
        plan.clear();
        await plan.save();
        return plan.toJSON();
      } catch (error) {
        throw new Error(`Error clearing plan: ${error.message}`);
      }
    },
    async duplicatePlan(_, { id }, { auth }) {
      try {
        const plan = await Plan.find(id);
        if (plan.user_id !== auth.user.id) {
          throw new Error('Not authorized to copy this plan');
        }
        const newPlan = plan.duplicate();
        await newPlan.save();
        return newPlan.toJSON();
      } catch (error) {
        throw new Error(`Error copying plan: ${error.message}`);
      }
    },
    async update_current_user(_, { input }, { auth }) {
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
    }
  },
  Plan: {
    async leave_items(obj, { orderBy = [] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const leave_items = await plan.leave_items().orderBy(orderBy).fetch();
      return leave_items.toJSON();
    },
    async return_items(obj, { orderBy = [] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const return_items = await plan.return_items().orderBy(orderBy).fetch();
      return return_items.toJSON();
    },
    async childcare_items(obj, { orderBy = [] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const childcare_items = await plan.childcare_items().orderBy(orderBy).fetch();
      return childcare_items.toJSON();
    }
  }
};

const isAuthenticated = () => (next) => async (root, args, context, info) => {
  try {
    await context.auth.check();
    return next(root, args, context, info);
  } catch {
    throw new Error('Not authenticated');
  }
};

const resolversComposition = {
  'Query.me': [isAuthenticated()],
  'Mutation.createPlan': [isAuthenticated()],
  'Mutation.updatePlan': [isAuthenticated()]
};

module.exports = composeResolvers(resolvers, resolversComposition);
