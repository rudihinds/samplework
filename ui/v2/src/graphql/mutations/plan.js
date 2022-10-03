import { gql } from '@apollo/client';
import { PLAN_FIELDS } from '@graphql/queries/plans';

export const SET_VIEW_TYPE = gql`
  mutation updatePlan($id: Int!, $view_type: String!) {
    updatePlan(id: $id, input: { view_type: $view_type }) {
      id
      view_type
    }
  }
`;

export const SET_VIEW_YEARS = gql`
  mutation updatePlan($id: Int!, $view_years: String!) {
    updatePlan(id: $id, input: { view_years: $view_years }) {
      id
      view_years
    }
  }
`;

export const SET_CHILDBIRTH_YEAR = gql`
  mutation updatePlan($id: Int!, $year: Int!) {
    updatePlan(id: $id, input: { childbirth_year: $year }) {
      id
      childbirth_year
    }
  }
`;

export const DELETE_PLAN = gql`
  mutation deletePlan($id: Int!) {
    deletePlan(id: $id) {
      id
    }
  }
`;

export const CLEAR_PLAN = gql`
  mutation clearPlan($id: Int!) {
    clearPlan(id: $id) {
      ...PlanFields
    }
  }
  ${PLAN_FIELDS}
`;

export const ADD_PLAN = gql`
  mutation createPlan($title: String) {
    createPlan(
      input: {
        title: $title
        childcare_items: [{}]
        self_leave_items: [{}]
        partner_leave_items: [{}]
        self_return_items: [{}]
        partner_return_items: [{}]
      }
    ) {
      ...PlanFields
    }
  }
  ${PLAN_FIELDS}
`;

export const DUPLICATE_PLAN = gql`
  mutation duplicatePlan($id: Int!) {
    duplicatePlan(id: $id) {
      ...PlanFields
    }
  }
  ${PLAN_FIELDS}
`;

export const UPDATE_PLAN = gql`
  mutation updatePlan($id: Int!, $input: PlanInput!) {
    updatePlan(id: $id, input: $input) {
      ...PlanFields
    }
  }
  ${PLAN_FIELDS}
`;
