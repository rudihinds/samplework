import { object, number, string, boolean } from 'yup';

const selfSchema = object({
  plan: object({
    self_annual_income: number().required(),
    zip_code: number().required()
  }),
  me: object({
    birthdate: string().required(),
    gender: string().required(),
    career_begin_age: string().required()
  })
});

const partnerSchema = object({
  plan: object({
    partner_annual_income: number().required(),
    zip_code: number().required()
  }),
  me: object({
    has_partner: boolean().test(
      'is-true',
      'has_partner is not true',
      (value) => value === true
    ),
    partner_birthdate: string().required(),
    partner_gender: string().required(),
    partner_career_begin_age: number().integer().required()
  })
});

export const selfIsValid = (input) => selfSchema.isValidSync(input);
export const partnerIsValid = (input) => partnerSchema.isValidSync(input);
