import { object, array, boolean, number } from 'yup';

const integerTransform = (_, originalValue) => {
  if (originalValue === null) {
    return null;
  }
  if (originalValue === '') {
    return null;
  }
  return parseInt(originalValue, 10);
};

const booleanTransform = (_, originalValue) => {
  if (originalValue === null) {
    return false;
  }
  if (originalValue === '') {
    return false;
  }
  return true;
};

const percentageTransform = (_, originalValue) => {
  if (originalValue === null) {
    return null;
  }
  if (originalValue === '') {
    return null;
  }
  return originalValue / 100.0;
};

const schema = object({
  id: number().integer().transform(integerTransform),
  country_id: number().integer().transform(integerTransform),
  self_annual_income: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  self_hours_per_week: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  self_industry_id: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  partner_annual_income: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  partner_hours_per_week: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  partner_industry_id: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  expenses_mortgage_rent: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  expenses_healthcare: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  expenses_student_loan: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  expenses_other: number().integer().notRequired().transform(integerTransform),
  childcare_early_years_essentials: number()
    .integer()
    .notRequired()
    .transform(integerTransform),
  childcare_items: array().of(
    object({
      id: number().integer().notRequired().transform(integerTransform),
      cost_per_month: number()
        .integer()
        .notRequired()
        .transform(integerTransform),
      days_per_week: number()
        .integer()
        .notRequired()
        .transform(integerTransform)
    })
  ),
  self_leave_items: array().of(
    object({
      id: number().integer().notRequired().transform(integerTransform),
      num_weeks: number().integer().notRequired().transform(integerTransform),
      salary_fraction: number()
        .positive()
        .notRequired()
        .transform(percentageTransform),
      is_partner: boolean().default(false).transform(booleanTransform)
    })
  ),
  partner_leave_items: array().of(
    object({
      id: number().integer().notRequired().transform(integerTransform),
      num_weeks: number().integer().notRequired().transform(integerTransform),
      salary_fraction: number()
        .positive()
        .notRequired()
        .transform(percentageTransform),
      is_partner: boolean().default(true).transform(booleanTransform)
    })
  ),
  self_return_items: array().of(
    object({
      id: number().integer().notRequired().transform(integerTransform),
      num_weeks: number()
        .positive()
        .integer()
        .notRequired()
        .transform(integerTransform),
      num_hours: number()
        .positive()
        .integer()
        .notRequired()
        .transform(integerTransform),
      is_partner: boolean().default(false).transform(booleanTransform)
    })
  ),
  partner_return_items: array().of(
    object({
      id: number().integer().notRequired().transform(integerTransform),
      num_weeks: number()
        .positive()
        .integer()
        .notRequired()
        .transform(integerTransform),
      num_hours: number()
        .positive()
        .integer()
        .notRequired()
        .transform(integerTransform),
      is_partner: boolean().default(true).transform(booleanTransform)
    })
  )
});

export default (plan) => schema.cast(plan, { assert: false });
