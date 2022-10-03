const isAuthenticated = require('../../utils/isAuthenticated');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');

const NotifyUser = use('App/Models/NotifyUser');

const resolvers = {
  Query: {
    async fetchNotifyUser(_, { notification_type }, { auth }) {
      const notifyUser = await NotifyUser.findBy({ notification_type, user_id: auth.user.id });
      if (!notifyUser) {
        throw new Error('NotifyUser not found');
      }
      return notifyUser.toJSON();
    }
  },
  Mutation: {
    async createNotifyUser(_, { input }, { auth }) {
      try {
        console.log('auth', auth);
        const user = auth.user;
        const record = await NotifyUser.findOrCreate(
          {
            notification_type: input.notification_type,
            user_id: user.id
          },
          {
            notification_type: input.notification_type,
            user_id: user.id
          }
        );
        return record.toJSON();
      } catch (error) {
        throw new Error(`Error creating plan ${error.message}`);
      }
    }
  }
};

const resolversComposition = {
  'Mutation.createNotifyUser': [isAuthenticated()]
};

module.exports = composeResolvers(resolvers, resolversComposition);
