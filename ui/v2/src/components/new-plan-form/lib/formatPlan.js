import { pick, set, get, cloneDeep } from 'lodash';

/* eslint-disable no-param-reassign */

const formFields = [
  'zip_code',
  'country_id',
  'self_annual_income',
  'self_hours_per_week',
  'self_industry_id',
  'partner_annual_income',
  'partner_hours_per_week',
  'partner_industry_id',
  'expenses_mortgage_rent',
  'expenses_healthcare',
  'expenses_student_loan',
  'expenses_other',
  'childcare_items',
  'leave_items',
  'return_items'
];

export const toFormik = (plan) => {
  const traverse = (obj) => {
    Object.keys(obj).forEach((k) => {
      if (obj[k] && typeof obj[k] === 'object') {
        traverse(obj[k]);
      } else {
        // Remove __typename
        if (k === '__typename') {
          delete obj[k];
        }
        // Convert null to empty string
        // Required for form fields
        if (obj[k] === null) {
          obj[k] = '';
        }
        // Convert number to string
        // Required for form fields
        if (typeof obj[k] === 'number') {
          obj[k] = String(obj[k]);
        }
      }
    });
  };
  // Apollo responses are frozen with Object.freeze
  // So needs to be deep cloned before mutating
  const _plan = cloneDeep(plan);
  // The form only cares about some fields in the plan
  // So pick() filters un-needed fields
  const picked = pick(_plan, formFields);
  // Traverse recursively loops through all fields in object and arrays
  // Removes __typename, converts null to "" and converts numbers to Strings for the form
  traverse(picked);
  return picked;
};

const integerValues = [
  'country_id',
  'self_annual_income',
  'self_hours_per_week',
  'self_industry_id',
  'partner_annual_income',
  'partner_hours_per_week',
  'partner_industry_id',
  'expenses_mortgage_rent',
  'expenses_healthcare',
  'expenses_student_loan',
  'expenses_other',
  'childcare_items[].id',
  'childcare_items[].cost_per_month',
  'childcare_items[].days_per_week',
  'leave_items[].id',
  'leave_items[].num_weeks',
  'leave_items[].salary_fraction'
];

// Converts values that should be integers into integers
// Converts empty strings to null for the DB
// All keys inside an array can be set with []
export const toApollo = (plan) => {
  const _plan = cloneDeep(plan);

  integerValues.forEach((key) => {
    if (key.includes('[].')) {
      const arrayKey = key.split('[].')[0];
      const objectKey = key.split('[].')[1];
      _plan[arrayKey] = _plan[arrayKey].map((o) =>
        set(o, objectKey, parseInt(get(o, objectKey), 10))
      );
    } else if (Object.prototype.hasOwnProperty.call(_plan, key)) {
      if (_plan[key] === '') {
        set(_plan, key, null);
      } else {
        set(_plan, key, parseInt(get(_plan, key), 10));
      }
    }
  });

  return _plan;
};
