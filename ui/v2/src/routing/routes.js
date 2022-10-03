import Dashboard from '@pages/Dashboard';
import PlanCreator from '@pages/PlanCreator';
import ChildcareQuiz from '@pages/ChildcareQuiz';

import AuthRedirect from '@components/auth/AuthRedirect';
import GraphQLTest from '@pages/GraphQLTest';
import Product from '../Product';

// Heavily inspired by: https://www.ryanjyost.com/react-routing/

const ROUTES = [
  {
    path: '/',
    key: 'ROOT',
    exact: true,
    component: AuthRedirect
  },
  {
    path: ['/dashboard', '/plan-creator', '/childcare-quiz', '/graphql-test'],
    key: 'PRODUCT',
    component: Product,
    routes: [
      // These routes are passed into Product component, which uses RenderRoutes to render the subroutes
      {
        path: '/dashboard',
        key: 'DASHBOARD',
        component: Dashboard
      },
      {
        path: '/plan-creator',
        key: 'PLAN_CREATOR',
        component: PlanCreator
      },
      {
        path: '/childcare-quiz',
        key: 'CHILDCARE_QUIZ',
        component: ChildcareQuiz
      },
      {
        path: '/graphql-test',
        key: 'GRAPHQL_TEST',
        component: GraphQLTest
      }
    ]
  }
];

export default ROUTES;
