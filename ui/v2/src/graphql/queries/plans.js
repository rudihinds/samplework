import { gql } from '@apollo/client';

export const PLAN_FIELDS = gql`
  fragment PlanFields on Plan {
    id
    title
    country_id
    zip_code
    self_annual_income
    self_hours_per_week
    self_industry_id
    childbirth_year
    partner_annual_income
    partner_hours_per_week
    partner_industry_id
    expenses_mortgage_rent
    expenses_healthcare
    expenses_student_loan
    expenses_other
    fertility_type
    alternative_family_type
    view_type
    view_years
    childcare_early_years_essentials
    childcare_items {
      id
      childcare_type
      cost_per_month
      days_per_week
    }
    self_leave_items {
      id
      num_weeks
      salary_fraction
    }
    partner_leave_items {
      id
      num_weeks
      salary_fraction
    }
    self_return_items {
      id
      num_hours
      num_weeks
    }
    partner_return_items {
      id
      num_hours
      num_weeks
    }
  }
`;

export const MY_PLANS = gql`
  ${PLAN_FIELDS}
  query myPlans {
    me {
      id
      default_plan_id
      default_plan {
        ...PlanFields
      }
      plans(orderBy: [{ column: "created_at", order: ASC }]) {
        ...PlanFields
      }
    }
  }
`;

export const FETCH_PLAN = gql`
  ${PLAN_FIELDS}
  query fetchPlan($id: Int!) {
    fetchPlan(id: $id) {
      ...PlanFields
    }
  }
`;
