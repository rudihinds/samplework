'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const GraphqlAdonis = use('ApolloServer');
const schema = require('../app/gql/schema');
const SentryPlugin = require('../providers/ApolloServer/SentryPlugin');

Route.get('/csrf-cookie', 'AuthenticationController.csrfCookie');

// Everything starts with: /api
// These routes have CSRF disabled just for mobile application
Route.group(() => {
  Route.post('/login', 'AuthenticationController.login');
  Route.post('/register', 'RegistrationController.register');
  Route.post('/password/forgot', 'PasswordResetController.forgotPassword');
  Route.post('/password/reset/:token', 'PasswordResetController.updatePasswordByToken');
})
  .prefix('/api')
  .middleware('guest');

// Routes for both authenticated and unauthenticated users
Route.group(() => {
  Route.post('/mailing-list/commitments/subscribe', 'MailingListController.commitmentsSubscribe');
}).prefix('/api');

// API routes with authentication middleware for session and api tokens
Route.group(() => {
  // User information (profile)
  Route.post('/logout', 'AuthenticationController.logout');
  Route.get('/me', 'ProfileController.me');
  Route.put('/me', 'ProfileController.update');
  Route.put('/me/meta/:key?', 'ProfileController.update_meta');
  Route.put('/me/password', 'ProfileController.password');
  Route.get('/location', 'LocationController.show');
  Route.post('/location', 'LocationController.store');
  Route.post('/me/finish-onboarding', 'ProfileController.finishOnboarding');

  Route.get('/income', 'IncomeController.show');
  Route.post('/income', 'IncomeController.store');

  Route.get('/benefits', 'BenefitController.show');
  Route.post('/benefits', 'BenefitController.store');

  Route.get('/expenses', 'ExpenseController.show');
  Route.post('/expenses', 'ExpenseController.store');

  Route.get('/planning/income', 'PlanningController.income');
  Route.get('/planning/expenses', 'PlanningController.expenses');

  Route.get('/occupations', 'OccupationController.index');
  Route.get('/childcare-prediction', 'ChildcarePredictionController.index');
  // Route.get('/auth/hasura', 'AuthenticationController.hasura');
  // Route.post('/auth/hasura', 'AuthenticationController.hasura');
})
  .prefix('/api')
  .middleware('auth:session,api');

Route.route(
  '/graphql',
  ({ request, auth, response }) => {
    response.safeHeader('Content-Type', 'application/json');
    return GraphqlAdonis.graphql({
      options: {
        schema,
        context: { auth },
        plugins: [SentryPlugin]
      },
      request,
      response
    });
  },
  ['GET', 'POST']
);

Route.get('/graphiql', ({ request, response }) => {
  return GraphqlAdonis.graphiql({ endpointURL: '/graphql' }, request, response);
});

// v1 routes (login, signup, onboarding)
Route.on('/intro/:page').render('v1');
Route.on('/signup').render('v1');
Route.on('/login').render('v1');
Route.on('/login').render('v1');
Route.on('/password/forgot').render('v1');
Route.on('/password/reset/:token').render('v1');

// Route anything else routed to v2
Route.on('/').render('v2');
Route.on('*').render('v2');
