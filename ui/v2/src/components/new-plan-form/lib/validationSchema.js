import { object, array, number, string } from 'yup';

const mustBeNumber = 'Must be a number';
const nearestDollar = 'Please round to the nearest dollar';
const nearestHour = 'Please round to the nearest whole hour';
const nearestDay = 'Please round to the nearest whole day';
const nearestWeek = 'Please round to the nearest whole week';
const zeroOrGreater = 'Must be 0 or greater';
const validZipCode = 'Please enter a valid 5-digit ZIP code';

const validationSchema = object({
  country_id: number().integer().nullable(),
  zip_code: string()
    .typeError(validZipCode)
    .min(5, validZipCode)
    .max(5, validZipCode),
  self_annual_income: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  self_hours_per_week: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  self_industry_id: number().typeError().integer().nullable(),
  partner_annual_income: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  partner_hours_per_week: number()
    .typeError(mustBeNumber)
    .integer(nearestHour)
    .nullable(),
  partner_industry_id: number().integer().nullable(),
  expenses_mortgage_rent: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  expenses_healthcare: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  expenses_student_loan: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  expenses_other: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  childcare_early_years_essentials: number()
    .typeError(mustBeNumber)
    .integer(nearestDollar)
    .nullable(),
  childcare_items: array().of(
    object({
      cost_per_month: number(mustBeNumber).integer(nearestDollar).nullable(),
      days_per_week: number(mustBeNumber).integer(nearestDay).nullable()
    })
  ),
  self_leave_items: array().of(
    object({
      num_weeks: number(mustBeNumber).integer(nearestWeek).nullable(),
      salary_fraction: number(mustBeNumber)
        .min(0, zeroOrGreater)
        .max(100, 'Must be 100 or less')
        .nullable()
    })
  ),
  partner_leave_items: array().of(
    object({
      num_weeks: number(mustBeNumber).integer(nearestWeek).nullable(),
      salary_fraction: number(mustBeNumber)
        .min(0, zeroOrGreater)
        .max(100, 'Must be 100 or less')
        .nullable()
    })
  ),
  self_return_items: array().of(
    object({
      num_weeks: number().min(0, zeroOrGreater).integer(nearestWeek).nullable(),
      num_hours: number().min(0, zeroOrGreater).integer(nearestHour).nullable()
    })
  ),
  partner_return_items: array().of(
    object({
      num_weeks: number().min(0, zeroOrGreater).integer(nearestWeek).nullable(),
      num_hours: number().min(0, zeroOrGreater).integer(nearestHour).nullable()
    })
  )
});

export default validationSchema;
