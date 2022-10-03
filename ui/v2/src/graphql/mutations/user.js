import { gql } from '@apollo/client';
import { PLAN_FIELDS } from '@graphql/queries/plans';

/* eslint-disable import/prefer-default-export */

export const SET_DEFAULT_PLAN = gql`
  mutation setDefaultPlan($plan_id: Int!) {
    updateCurrentUser(input: { default_plan_id: $plan_id }) {
      id
      default_plan_id
      default_plan {
        ...PlanFields
      }
    }
  }
  ${PLAN_FIELDS}
`;
