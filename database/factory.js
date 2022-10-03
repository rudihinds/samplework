'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', (faker, _, data) => {
  const gender = data.gender || faker.gender().toLowerCase();
  const partner_gender = gender === 'female' ? 'male' : 'female';

  return {
    name: data.name || faker.name({ gender: ['male', 'female'].includes(gender) ? gender : 'male' }),
    email: data.email || faker.email({ domain: 'example.com' }),
    password: 'user123',
    birthdate: data.birthdate || faker.birthday(),
    partner_birthdate: data.partner_birthdate || faker.birthday(),
    career_begin_age: data.career_begin_age || faker.age({ type: 'adult' }),
    partner_career_begin_age: data.partner_career_begin_age || faker.age({ type: 'adult' }),
    gender: gender,
    partner_gender: data.partner_gender || partner_gender,
    has_partner: true,
    is_primary_care_giver: data.is_primary_care_giver,
    onboarding_finished_at: new Date(),
    family_plans: 'thinking_about',
    partner_name: data.partner_name || null
  };
});

Factory.blueprint('App/Models/Income', (faker, _, data) => {
  return {
    myself: data.myself || faker.floating({ min: 0, max: 1000, fixed: 2 }),
    partner: data.partner || faker.floating({ min: 0, max: 1000, fixed: 2 }),
    full_time_hrs: data.full_time_hrs || faker.integer({ min: 0, max: 100 }),
    full_time_hrs_partner: data.full_time_hrs_partner || faker.integer({ min: 0, max: 100 }),
    occupation_id: data.occupation_id,
    partner_occupation_id: data.partner_occupation_id
  };
});

Factory.blueprint('App/Models/Benefit', (faker, _, data) => {
  return {
    parental_leave: data.parental_leave || faker.integer({ min: 0, max: 100 }),
    parental_leave_partner: data.parental_leave_partner || faker.integer({ min: 0, max: 100 }),
    unpaid_parental_leave: data.unpaid_parental_leave || faker.integer({ min: 0, max: 100 }),
    unpaid_parental_leave_partner: data.unpaid_parental_leave_partner || faker.integer({ min: 0, max: 100 }),
    parental_leave_percentage: data.parental_leave_percentage || 100,
    parental_leave_percentage_partner: data.parental_leave_percentage_partner || 100,
    return_to_work: data.return_to_work || faker.integer({ min: 0, max: 80 }),
    return_to_work_partner: data.return_to_work_partner || faker.integer({ min: 0, max: 80 }),
    part_time_work: data.part_time_work || faker.integer({ min: 0, max: 80 }),
    part_time_work_partner: data.part_time_work_partner || faker.integer({ min: 0, max: 80 }),
    part_time_length: data.part_time_length || faker.integer({ min: 0, max: 102 }),
    part_time_length_partner: data.part_time_length || faker.integer({ min: 0, max: 102 })
  };
});

Factory.blueprint('App/Models/Expense', (faker, _, data) => {
  return {
    child_care_cost: data.child_care_cost || faker.floating({ min: 0, max: 1000, fixed: 2 }),
    child_care_type: data.child_care_type || 'daycare',
    fertility_treatment_cycles: data.fertility_treatment_cycles || faker.integer({ min: 0, max: 5 }),
    fertility_treatment_type: data.fertility_treatment_type || 'ivf'
  };
});

Factory.blueprint('App/Models/Occupation', (faker, _, data) => {
  return {
    name: data.name || faker.profession()
  };
});

Factory.blueprint('App/Models/Location', (faker, _, data) => {
  return {};
});
