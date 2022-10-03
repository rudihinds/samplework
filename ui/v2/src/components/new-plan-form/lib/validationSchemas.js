import { object, string, number } from 'yup';

const validationSchemas = {
  0: object({
    country: string().max(50, 'Character limit: 50'),
    zip_code: string()
      .min(5, 'zip code should be no less than 5 characters')
      .max(11, 'zip code should be no more than 11 characters')
  }),
  1: object({
    self_annual_income: number('Must be a number'),
    self_hours_per_week: number().nullable(),
    self_industry_id: string().nullable(),
    partner_annual_income: number().nullable(),
    partner_hours_per_week: number().nullable(),
    partner_industry_id: string().nullable()
  }),
  2: object({
    expenses_mortgage_rent: number(),
    expenses_healthcare: number(),
    expenses_student_loan: number(),
    expenses_other: number()
  }),
  3: object({
    childcare_type_id: number(),
    childcare_monthly_cost: number(),
    childcare_early_years_essentials: number()
  })
  // leave: {},
  // return: {},
  // fertility: {}
};

export default validationSchemas;
