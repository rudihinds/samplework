import differenceInYears from 'date-fns/differenceInYears';

const mapLeave = ({ num_weeks, salary_fraction }) =>
  num_weeks ? { num_weeks, salary_fraction: salary_fraction || 0 } : null;

const mapChildcare = ({ childcare_type, cost_per_month, days_per_week }) =>
  childcare_type
    ? {
        childcare_type,
        cost_per_month: cost_per_month || 0,
        days_per_week: days_per_week || 0
      }
    : null;

export const mapSelf = (plan, user) => {
  const age = differenceInYears(Date.now(), new Date(user.birthdate));
  return {
    is_partner: false, // For debugging in network tab
    age,
    zip_code: parseInt(plan.zip_code, 10),
    gender: user.gender === 'male' ? 'Man' : 'Woman',
    salary: plan.self_annual_income,
    share_of_expenses:
      plan.self_annual_income /
      (plan.self_annual_income + plan.partner_annual_income),
    hasPartner: false,
    career_begin_age: user.career_begin_age,
    childbirth_year: plan.childbirth_year,
    leave: plan.self_leave_items.map(mapLeave).filter((i) => i !== null),
    isPCG: false,
    current_weekly_hours: plan.self_hours_per_week,
    childcare: plan.childcare_items.map(mapChildcare).filter((i) => i !== null),
    childcare_early_years_essentials:
      plan.childcare_early_years_essentials || 0,
    expenses_mortgage_rent: plan.expenses_mortgage_rent || 0,
    expenses_healthcare: plan.expenses_healthcare || 0,
    expenses_student_loan: plan.expenses_student_loan || 0,
    expenses_other: plan.expenses_other || 0
  };
};

export const mapPartner = (plan, user) => {
  const age = differenceInYears(Date.now(), new Date(user.partner_birthdate));
  return {
    is_partner: true, // For debugging in network tab
    age,
    zip_code: parseInt(plan.zip_code, 10),
    gender: user.partner_gender === 'male' ? 'Man' : 'Woman',
    salary: plan.partner_annual_income,
    share_of_expenses:
      plan.partner_annual_income /
      (plan.self_annual_income + plan.partner_annual_income),
    hasPartner: false,
    career_begin_age: user.partner_career_begin_age,
    childbirth_year: plan.childbirth_year,
    leave: plan.partner_leave_items.map(mapLeave).filter((i) => i !== null),
    isPCG: true,
    current_weekly_hours: plan.partner_hours_per_week,
    childcare: plan.childcare_items.map(mapChildcare).filter((i) => i !== null),
    childcare_early_years_essentials:
      plan.childcare_early_years_essentials || 0,
    expenses_mortgage_rent: plan.expenses_mortgage_rent || 0,
    expenses_healthcare: plan.expenses_healthcare || 0,
    expenses_student_loan: plan.expenses_student_loan || 0,
    expenses_other: plan.expenses_other || 0
  };
};
