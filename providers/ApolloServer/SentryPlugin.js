const Sentry = use('Sentry');
const apolloServerSentryPlugin = {
  // For plugin definition see the docs: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          // scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, rc.context.req));

          // // public user email
          // const userEmail = rc.context.req?.session?.userId;
          // if (userEmail) {
          //   scope.setUser({
          //     // id?: string;
          //     ip_address: rc.context.req?.ip,
          //     email: userEmail
          //   });
          // }

          let operationTag = 'parse_err';
          if (rc.operation) {
            operationTag = rc.operation.operation;
          }

          scope.setTags({
            graphql: operationTag,
            graphqlName: rc.operationName || rc.request.operationName
          });

          rc.errors.forEach((error) => {
            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      }
    };
  }
};

module.exports = apolloServerSentryPlugin;
