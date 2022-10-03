const Plan = use('App/Models/Plan');
const ReturnItem = use('App/Models/ReturnItem');
const ChildcareItem = use('App/Models/ChildcareItem');
const LeaveItem = use('App/Models/LeaveItem');

const { omit } = require('lodash');

const isAuthenticated = require('../../utils/isAuthenticated');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const { upsertArray } = require('./helpers');

const resolvers = {
  Query: {
    async fetchPlan(_, { id }, { auth }) {
      const plan = await Plan.find(id);
      if (!plan) {
        throw new Error('Plan not found');
      }
      if (plan.user_id !== auth.user.id) {
        throw new Error('Not authorized to fetch this plan');
      }
      return plan.toJSON();
    }
  },
  Mutation: {
    async createPlan(_, { input }, { auth }) {
      try {
        const user = await auth.user;
        const rootFields = omit(input, Plan.relationships);

        const { id: insertId } = await Plan.create({
          ...rootFields,
          country_id: 237, // hard coded to USA for now
          user_id: user.id
        });
        const plan = await Plan.find(insertId);

        if (input.self_leave_items && input.self_leave_items.length > 0) {
          await plan.leave_items().createMany(input.self_leave_items.map((item) => ({ ...item, is_partner: false })));
        }

        if (input.partner_leave_items && input.partner_leave_items.length > 0) {
          await plan.leave_items().createMany(input.partner_leave_items.map((item) => ({ ...item, is_partner: true })));
        }

        if (input.self_return_items && input.self_return_items.length > 0) {
          await plan.return_items().createMany(input.self_return_items.map((item) => ({ ...item, is_partner: false })));
        }

        if (input.partner_return_items && input.partner_return_items.length > 0) {
          await plan
            .return_items()
            .createMany(input.partner_return_items.map((item) => ({ ...item, is_partner: true })));
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

        // await new Promise((resolve) => setTimeout(resolve, 500));

        plan.merge(rootFields);

        if (input.self_leave_items) {
          await upsertArray({
            parentInstance: plan,
            foreignKey: 'plan_id',
            inputArray: input.self_leave_items,
            relationshipName: 'leave_items',
            ItemModel: LeaveItem,
            filter: { is_partner: false }
          });
        }

        if (input.partner_leave_items) {
          await upsertArray({
            parentInstance: plan,
            foreignKey: 'plan_id',
            inputArray: input.partner_leave_items,
            relationshipName: 'leave_items',
            ItemModel: LeaveItem,
            filter: { is_partner: true }
          });
        }

        if (input.self_return_items) {
          await upsertArray({
            parentInstance: plan,
            foreignKey: 'plan_id',
            inputArray: input.self_return_items,
            relationshipName: 'return_items',
            ItemModel: ReturnItem,
            filter: { is_partner: false }
          });
        }

        if (input.partner_return_items) {
          await upsertArray({
            parentInstance: plan,
            foreignKey: 'plan_id',
            inputArray: input.partner_return_items,
            relationshipName: 'return_items',
            ItemModel: ReturnItem,
            filter: { is_partner: true }
          });
        }

        if (input.childcare_items) {
          await upsertArray({
            parentInstance: plan,
            foreignKey: 'plan_id',
            inputArray: input.childcare_items,
            relationshipName: 'childcare_items',
            ItemModel: ChildcareItem,
            filter: {}
          });
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
    }
  },
  Plan: {
    async self_leave_items(obj, { orderBy = [{ column: 'created_at', order: 'ASC' }] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const leave_items = await plan
        .leave_items()
        .where('is_partner', null)
        .orWhere('is_partner', false)
        .orderBy(orderBy)
        .fetch();
      return leave_items.toJSON();
    },
    async partner_leave_items(obj, { orderBy = [{ column: 'created_at', order: 'ASC' }] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const leave_items = await plan.leave_items().where('is_partner', true).orderBy(orderBy).fetch();
      return leave_items.toJSON();
    },
    async self_return_items(obj, { orderBy = [{ column: 'created_at', order: 'ASC' }] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const return_items = await plan
        .return_items()
        .where('is_partner', null)
        .orWhere('is_partner', false)
        .orderBy(orderBy)
        .fetch();
      return return_items.toJSON();
    },
    async partner_return_items(obj, { orderBy = [{ column: 'created_at', order: 'ASC' }] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const return_items = await plan.return_items().where('is_partner', true).orderBy(orderBy).fetch();
      return return_items.toJSON();
    },
    async childcare_items(obj, { orderBy = [{ column: 'created_at', order: 'ASC' }] }) {
      const plan = new Plan();
      plan.newUp(obj);
      const childcare_items = await plan.childcare_items().orderBy(orderBy).fetch();
      return childcare_items.toJSON();
    }
  }
};

const resolversComposition = {
  'Query.fetchPlan': [isAuthenticated()],
  'Mutation.createPlan': [isAuthenticated()],
  'Mutation.updatePlan': [isAuthenticated()],
  'Mutation.deletePlan': [isAuthenticated()],
  'Mutation.clearPlan': [isAuthenticated()],
  'Mutation.duplicatePlan': [isAuthenticated()]
};

module.exports = composeResolvers(resolvers, resolversComposition);
