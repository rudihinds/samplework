const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const PlanFields = `
  title: String
  country_id: Int
  zip_code: String
  self_annual_income: Int
  self_hours_per_week: Int
  self_industry_id: Int
  childbirth_year_index: Int
  partner_annual_income: Int
  partner_hours_per_week: Int
  partner_industry_id: Int
  expenses_mortgage_rent: Int
  expenses_healthcare: Int
  expenses_student_loan: Int
  expenses_other: Int
  childcare_type_id: Int
  childcare_monthly_cost: Int
  childcare_early_years_essentials: Int
  fertility_type_id: Int
  alternative_family_type_id: Int
  view_type: String
  view_years: String
  created_at: String
  updated_at: String
`;

// Define our schema using the GraphQL schema language
const typeDefs = `

  scalar JSON
  scalar JSONObject

  enum Direction {
    ASC
    DESC
  }
  
  input OrderBy {
    column: String!
    order: Direction!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    gender: String
    partner_gender: String
    default_plan_id: Int
    plans(orderBy: [OrderBy]): [Plan]
  }
  input UserInput{
    name: String
    gender: String
    partner_gender: String
    birthdate: String
    partner_birthdate: String
    career_begin_age: Int
    partner_career_begin_age: Int
    is_primary_care_giver: Boolean
    has_partner: Boolean
    family_plans: String
    partner_name: String
    default_plan_id: Int
  }
  input PlanInput {
    ${PlanFields}
    leave_items: [LeaveItemInput]
    return_items: [ReturnItemInput]
    childcare_items: [ChildcareItemInput]
  }
  input LeaveItemInput{
    id: Int
    num_weeks: Int
    salary_fraction: Float
    is_partner: Boolean
  }
  input ReturnItemInput{
    id: Int
    num_hours: Int
    num_weeks: Int
    is_partner: Boolean
  }
  input ChildcareItemInput{
    id: Int
    childcare_type: String
    cost_per_month: Int
  }
  type Plan {
    id: Int!
    user: User!
    ${PlanFields}
    leave_items: [LeaveItem]
    return_items: [ReturnItem]
    childcare_items: [ChildcareItem]
  }

  type LeaveItem{
    id: Int!
    plan: Plan!
    num_weeks: Int!
    salary_fraction: Float!
    is_partner: Boolean!
    created_at: String!
    updated_at: String!
  }
  type ReturnItem{
    id: Int!
    plan: Plan!
    num_hours: Int!
    num_weeks: Int!
    is_partner: Boolean!
    created_at: String!
    updated_at: String!
  }
  type ChildcareItem{
    id: Int!
    plan: Plan!
    childcare_type: String!
    cost_per_month: Int!
    created_at: String!
    updated_at: String!
  }

  type Query {
    fetchPlan(id: Int!): Plan
    me: User
  }
  type Mutation {
    createPlan(input: PlanInput): Plan
    updatePlan(id: Int!, input: PlanInput): Plan
    deletePlan(id: Int!): Plan
    clearPlan(id: Int!): Plan
    duplicatePlan(id: Int!): Plan
    update_current_user(input: UserInput): User
  }

`;

module.exports = { typeDefs, resolvers };
