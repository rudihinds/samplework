import { object, string, number, array } from 'yup';

const percentageTransform = (_, originalValue) => {
  if (originalValue === null) {
    return '';
  }
  if (originalValue === '') {
    return '';
  }
  return String(originalValue * 100);
};

const schema = object({
  zip_code: string(),
  country_id: string(),
  self_annual_income: string(),
  self_hours_per_week: string(),
  self_industry_id: string(),
  partner_annual_income: string(),
  partner_hours_per_week: string(),
  partner_industry_id: string(),
  expenses_mortgage_rent: string(),
  expenses_healthcare: string(),
  expenses_student_loan: string(),
  expenses_other: string(),
  fertility_type: string(),
  alternative_family_type: string(),
  childcare_early_years_essentials: string(),
  childcare_items: array().of(
    object({
      id: number(),
      childcare_type: string(),
      cost_per_month: string(),
      days_per_week: string()
    }).noUnknown()
  ),
  self_leave_items: array().of(
    object({
      id: number(),
      num_weeks: string(),
      salary_fraction: string().transform(percentageTransform)
    }).noUnknown()
  ),
  partner_leave_items: array().of(
    object({
      id: number(),
      num_weeks: string(),
      salary_fraction: string().transform(percentageTransform)
    }).noUnknown()
  ),
  self_return_items: array().of(
    object({
      id: number(),
      num_weeks: string(),
      num_hours: string()
    }).noUnknown()
  ),
  partner_return_items: array().of(
    object({
      id: number(),
      num_weeks: string(),
      num_hours: string()
    }).noUnknown()
  )
}).noUnknown();

export default (plan) => schema.cast(plan, { assert: false });
