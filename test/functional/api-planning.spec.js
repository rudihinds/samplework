'use strict';

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Api Planning');
const Factory = use('Factory');
const MockDate = require('mockdate');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');
trait('Session/Client');

beforeEach(() => MockDate.set('2020-06-06'));

afterEach(() => MockDate.reset());

test('No partner breakdown, 10Y-C3Y-U1Y partner=null', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'male',
    birthdate: '1988-03-30',
    career_begin_age: 11,
    is_primary_care_giver: true
  });
  user.has_partner = false;
  user.partner_gender = null;
  user.partner_birthdate = null;
  user.partner_career_begin_age = null;
  await user.save();

  await user.income().create({
    myself: '70000.00',
    partner: '70000.00',
    full_time_hrs: '0'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    unpaid_parental_leave: '30', // 1 year of unpaid leave
    part_time_work: '10',
    part_time_length: '1'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10, // 5?
      childbirth_on_year: 3
    })
    .end();

  response.assertStatus(200);

  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  assert.sameOrderedMembers(selfIncome, [
    '70000.00',
    '70423.70',
    '28577.47',
    '68253.53',
    '68508.92',
    '68680.15',
    '68767.22',
    '68770.14',
    '68688.90',
    '68523.50'
  ]);
  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  const partnerBreakdown = partner.map((estimation) => estimation.breakdown);
  assert.lengthOf(partnerIncome, 10);

  // assert user with no partner receives empty breakdowns
  assert.deepEqual(partnerBreakdown, Array(10).fill([]));
  assert.lengthOf(partnerBreakdown, 10);

  assert.sameOrderedMembers(partnerIncome, Array(10).fill(0.0));
  assert.lengthOf(totalLoss, 10);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);
});

test('infinity issue 2020-11-23, 10Y-C3Y-U1Y, no partner', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'male',
    birthdate: '1988-03-30',
    career_begin_age: 11,
    is_primary_care_giver: true
  });
  user.has_partner = false;
  user.partner_gender = null;
  user.partner_birthdate = null;
  user.partner_career_begin_age = null;
  await user.save();

  await user.income().create({
    myself: '70000.00',
    partner: '70000.00',
    full_time_hrs: '0'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    unpaid_parental_leave: '30', // 1 year of unpaid leave
    part_time_work: '10',
    part_time_length: '1'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 3
    })
    .end();

  response.assertStatus(200);

  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  assert.sameOrderedMembers(selfIncome, [
    '70000.00',
    '70423.70',
    '28577.47',
    '68253.53',
    '68508.92',
    '68680.15',
    '68767.22',
    '68770.14',
    '68688.90',
    '68523.50'
  ]);
  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  assert.sameOrderedMembers(partnerIncome, Array(10).fill(0.0));
  assert.lengthOf(totalLoss, 10);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);
});

test('NaN issue 2020-11-23, 10Y-C3Y-U1Y, no partner', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'male',
    birthdate: '1988-03-30',
    career_begin_age: 11,
    is_primary_care_giver: true
  });
  user.has_partner = false;
  user.partner_gender = null;
  user.partner_birthdate = null;
  user.partner_career_begin_age = null;
  await user.save();

  await user.income().create({
    myself: '70000.00',
    partner: '70000.00',
    full_time_hrs: '0'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    unpaid_parental_leave: '30', // 1 year of unpaid leave
    part_time_work: '0',
    part_time_length: '1'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 3
    })
    .end();

  response.assertStatus(200);

  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  assert.sameOrderedMembers(selfIncome, [
    '70000.00',
    '70423.70',
    '29938.30',
    '68253.53',
    '68508.92',
    '68680.15',
    '68767.22',
    '68770.14',
    '68688.90',
    '68523.50'
  ]);
  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  assert.sameOrderedMembers(partnerIncome, Array(10).fill(0.0));
  assert.lengthOf(totalLoss, 10);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);
});

test('fetch income planning for 10 years', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    unpaid_parental_leave: '52',
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({ years_in_future: 10, childbirth_on_year: 0 })
    .end();

  response.assertStatus(200);

  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104045.38',
    '107928.03',
    '111647.96',
    '115205.15',
    '118599.61',
    '121831.35',
    '124900.35',
    '127806.63',
    '130550.17'
  ]);
  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.lengthOf(totalLoss, 10);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);
});

test('fetch income planning for 5 years', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    unpaid_parental_leave: '52',
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({ years_in_future: 5, childbirth_on_year: 0 })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 5);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 5);

  assert.lengthOf(partner, 5);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 5);

  assert.lengthOf(totalLoss, 5);

  assert.sameOrderedMembers(selfIncome, ['100000.00', '104045.38', '107928.03', '111647.96', '115205.15']);
  assert.sameOrderedMembers(partnerIncome, ['100000.00', '104400.99', '108618.88', '112653.65', '116505.31']);
  assert.sameOrderedMembers(totalLoss, ['0.00', '0.00', '0.00', '0.00', '0.00']);
});

// fetch income planning for 10 years with childbirth on year 4 and 1 year of unpaid leave and 12 weeks of paid leave
test('simulation 10Y-C4Y-U1Y-P12W', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    parental_leave_partner: '0',
    unpaid_parental_leave: '52', // 1 years of unpaid leave
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;

  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);

  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);

  assert.lengthOf(totalLoss, 10);

  // Here we assert that all penalties in breakdown minus the base salary is close to the final income estimation
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104045.38',
    '107928.03',
    '25764.91',
    '82954.05',
    '104297.70',
    '107854.90',
    '111249.36',
    '114481.09',
    '117550.10'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '85883.04',
    '32251.10',
    '14301.91',
    '13976.45',
    '13650.99',
    '13325.53',
    '13000.07'
  ]);
});

// fetch income planning for 10 years with childbirth on year 4
// and 1 year of unpaid leave and 12 weeks of paid leave with 80% of worth
test('simulation 10Y-C4Y-U1Y-P12W-PLP80', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    parental_leave_partner: '0',
    parental_leave_percentage: '80', // 3 months of paid leave after childbirth
    parental_leave_percentage_partner: '100',
    unpaid_parental_leave: '52', // 1 years of unpaid leave
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;

  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);

  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);

  assert.lengthOf(totalLoss, 10);

  // Here we assert that all penalties in breakdown minus the base salary is close to the final income estimation
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104045.38',
    '107928.03',
    '20611.93',
    '82954.05',
    '104297.70',
    '107854.90',
    '111249.36',
    '114481.09',
    '117550.10'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '91036.03',
    '32251.10',
    '14301.91',
    '13976.45',
    '13650.99',
    '13325.53',
    '13000.07'
  ]);
});

test('fetch income for 10 years with unpaid leave of 2.4 years and childbirth on year 4', async ({
  assert,
  client
}) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    unpaid_parental_leave: '125',
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { totalLoss, self, partner } = response.body;
  assert.lengthOf(totalLoss, 10);

  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);

  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);

  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',

    '111647.96',
    '115205.15',
    '56422.14',
    '20811.09',
    '20322.90',
    '19834.71',
    '19346.52'
  ]);

  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104045.38',
    '107928.03',
    '0.00',
    '0.00',
    '62177.48',
    '101020.26',
    '104577.45',
    '107971.92',
    '111203.65'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
});

test('fetch income for 10 years with unpaid leave of 15 weeks and childbirth on year 1', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    unpaid_parental_leave: '15',
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 1
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;

  assert.lengthOf(self, 10);
  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);

  assert.lengthOf(partner, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);

  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.lengthOf(totalLoss, 10);
  assert.sameOrderedMembers(selfIncome, [
    '71153.85',
    '96192.31',
    '100237.69',
    '104120.35',
    '107840.27',
    '111397.46',
    '114791.93',
    '118023.66',
    '121092.66',
    '123998.94'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '28846.15',
    '7853.07',
    '7690.34',
    '7527.61',
    '7364.88',
    '7202.15',
    '7039.42',
    '6876.69',
    '6713.96',
    '6551.23'
  ]);
});

test('fetch income for 10 years with unpaid leave of 105 weeks and childbirth on year 1', async ({
  assert,
  client
}) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.benefit().create({
    unpaid_parental_leave: '105',
    unpaid_parental_leave_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 1
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(selfIncome, [
    '0.00',
    '0.00',
    '90868.02',
    '89372.30',
    '93417.68',
    '97300.34',
    '101020.26',
    '104577.45',
    '107971.92',
    '111203.65'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '100000.00',
    '104045.38',
    '17060.01',
    '22275.65',
    '21787.46',
    '21299.28',
    '20811.09',
    '20322.90',
    '19834.71',
    '19346.52'
  ]);
});

// fetch income for 10 years with unpaid leave of 52 weeks and 2 years of part time and childbirth on year 2
// and both of them are females
test('simulation 10Y child=2 unpaid=52W partner_unpaid=12W parttime=2Y gender=fmx2', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'female',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00',
    full_time_hrs: '40',
    full_time_hrs_partner: '40'
  });

  await user.benefit().create({
    unpaid_parental_leave: '52',
    unpaid_parental_leave_partner: '12',
    part_time_work: '20',
    part_time_length: '104',
    part_time_work_partner: '40',
    part_time_length_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 2
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });
  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '0.00',
    '50118.85',
    '52060.17',
    '107840.27',
    '111397.46',
    '114791.93',
    '118023.66',
    '121092.66',
    '123998.94'
  ]);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '80034.91',
    '100237.69',
    '104120.35',
    '107840.27',
    '111397.46',
    '114791.93',
    '118023.66',
    '121092.66',
    '123998.94'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '104045.38',
    '57809.19',
    '59587.78',
    '7364.88',
    '7202.15',
    '7039.42',
    '6876.69',
    '6713.96',
    '6551.23'
  ]);
});

// fetch income for 10 years with unpaid leave of 52 weeks and 2 years of part time and childbirth on year 2
test('simulation 10Y child=2 unpaid=52W partner_unpaid=12W parttime=2Y', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00',
    full_time_hrs: '40',
    full_time_hrs_partner: '40'
  });

  await user.benefit().create({
    unpaid_parental_leave: '52',
    unpaid_parental_leave_partner: '12',
    part_time_work: '20',
    part_time_length: '104',
    part_time_work_partner: '40',
    part_time_length_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 2
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '0.00',
    '53627.17',
    '55704.39',
    '115389.09',
    '119195.28',
    '122827.36',
    '126285.32',
    '129569.15',
    '132678.87'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '80308.46',
    '98940.32',
    '103158.20',
    '107192.97',
    '111044.64',
    '114713.19',
    '118198.63',
    '121500.96',
    '124620.18'
  ]);

  // loss is negative because the paternity bump (7%) is higher than the penalties being applied
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '104045.38',
    '54300.87',
    '55943.57',
    '-183.94',
    '-595.67',
    '-996.01',
    '-1384.96',
    '-1762.52',
    '-2128.69'
  ]);
});

// fetch income for 10 years with unpaid leave of 52 weeks and 2 years of part time and childbirth on year 2
// But the man is the primary care giver
test('simulation 10Y child=2 unpaid=52W partner_unpaid=12W parttime=2Y pcg=man', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: false
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00',
    full_time_hrs: '40',
    full_time_hrs_partner: '40'
  });

  await user.benefit().create({
    unpaid_parental_leave: '52',
    unpaid_parental_leave_partner: '12',
    part_time_work: '20',
    part_time_length: '104',
    part_time_work_partner: '40',
    part_time_length_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 2
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });
  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '0.00',
    '50118.85',
    '52060.17',
    '107840.27',
    '111397.46',
    '114791.93',
    '118023.66',
    '121092.66',
    '123998.94'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '85930.05',
    '105866.14',
    '110379.27',
    '114696.48',
    '118817.76',
    '122743.11',
    '126472.53',
    '130006.03',
    '133343.59'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);
});

// fetch income planning for 10 years with childbirth on year 4 and 1 year of
// unpaid leave and 12 weeks of paid leave and 1 year of part time
test('simulation 10Y child=4 unpaid=1Y paid=12W parttime=1Y', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00',
    full_time_hrs: '40',
    full_time_hrs_partner: '40'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    parental_leave_partner: '0',
    unpaid_parental_leave: '52', // 1 year of unpaid leave
    unpaid_parental_leave_partner: '0',
    part_time_work: '20',
    part_time_length: '52',
    part_time_work_partner: '40',
    part_time_length_partner: '0'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);
  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });
  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104045.38',
    '107928.03',
    '25764.91',
    '41477.03',
    '92263.35',
    '107854.90',
    '111249.36',
    '114481.09',
    '117550.10'
  ]);
  assert.sameOrderedMembers(partnerIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '112653.65',
    '116505.31',
    '120173.86',
    '123659.31',
    '126961.64',
    '130080.86',
    '133016.97'
  ]);
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '85883.04',
    '73728.12',
    '26336.26',
    '13976.45',
    '13650.99',
    '13325.53',
    '13000.07'
  ]);
});

// fetch income planning for 10 years with childbirth on year 4 and 1 year of
// unpaid leave and 12 weeks of paid leave and 1 year of part time
// but user has no partner
test('simulation 10Y child=4 unpaid=1Y paid=12W parttime=1Y partner=f', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    birthdate: '1996-03-15',
    career_begin_age: 22,
    is_primary_care_giver: true
  });
  user.has_partner = false;
  user.partner_gender = null;
  user.partner_birthdate = null;
  user.partner_career_begin_age = null;
  await user.save();

  await user.income().create({
    myself: '100000.00',
    full_time_hrs: '40'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    unpaid_parental_leave: '52', // 1 year of unpaid leave
    part_time_work: '20',
    part_time_length: '52'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);
  const partnerIncome = partner.map((estimation) => estimation.income);
  assert.lengthOf(partnerIncome, 10);

  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  assert.sameOrderedMembers(selfIncome, [
    '100000.00',

    '104045.38',
    '107928.03',
    '25764.91',
    '41477.03',
    '92263.35',
    '107854.90',
    '111249.36',
    '114481.09',
    '117550.10'
  ]);
  // NOTE: Partner data is set to zeros. This doesn't affect the graph as is ploting zeros.
  assert.sameOrderedMembers(partnerIncome, Array(10).fill(0.0));
  assert.sameOrderedMembers(totalLoss, [
    '0.00',
    '0.00',
    '0.00',
    '85883.04',
    '73728.12',
    '26336.26',
    '13976.45',
    '13650.99',
    '13325.53',
    '13000.07'
  ]);
});

// fetch income planning for 10 years with childbirth on year 4 and 1 year of
// unpaid leave and 12 weeks of paid leave and 1 year of part time
// but user has no partner and is a non binary person
test('simulation 10Y child=4 unpaid=1Y paid=12W parttime=1Y partner=f gender=nb', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'nonbinary',
    birthdate: '1996-03-15',
    career_begin_age: 22,
    is_primary_care_giver: true
  });
  user.has_partner = false;
  user.partner_gender = null;
  user.partner_birthdate = null;
  user.partner_career_begin_age = null;
  await user.save();

  await user.income().create({
    myself: '100000.00',
    full_time_hrs: '40'
  });

  await user.benefit().create({
    parental_leave: '12', // 3 months of paid leave after childbirth
    unpaid_parental_leave: '52', // 1 year of unpaid leave
    part_time_work: '20',
    part_time_length: '52'
  });

  const response = await client
    .get('/api/planning/income')
    .loginVia(user)
    .accept('json')
    .send({
      years_in_future: 10,
      childbirth_on_year: 4
    })
    .end();

  response.assertStatus(200);
  const { self, partner, totalLoss } = response.body;
  assert.lengthOf(self, 10);
  assert.lengthOf(partner, 10);
  assert.lengthOf(totalLoss, 10);

  const selfIncome = self.map((estimation) => estimation.income);
  assert.lengthOf(selfIncome, 10);

  const partnerIncome = partner.map((estimation) => estimation.income.toFixed(2));
  assert.lengthOf(partnerIncome, 10);

  self.forEach((estimation) => {
    const assetLoss = estimation.breakdown
      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + assetLoss;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });

  partner.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown

      .map((br) => (br.negative ? Number(br.value) * -1 : Number(br.value)))
      .reduce((carry, current) => carry + current, 0);

    const income = Number(estimation.baseSalary) + sumOfBreakdowns;
    assert.closeTo(Number(estimation.income), income, 0.015);
  });
  assert.sameOrderedMembers(selfIncome, [
    '100000.00',
    '104400.99',
    '108618.88',
    '25997.00',
    '41228.07',
    '90388.49',
    '106029.95',
    '109698.50',
    '113183.94',
    '116486.28'
  ]);
  // NOTE: Partner data is set to zeros. This doesn't affect the graph as is ploting zeros.
  assert.sameOrderedMembers(partnerIncome, Array(10).fill('0.00'));
  // NOTE: User is a nonbinary. the restriction to apply penalties based on experience is based on female && is PCG
  assert.sameOrderedMembers(totalLoss, Array(10).fill('0.00'));
});

test('fetch expenses with childbirth on year 2', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.expense().create({
    child_care_type: 'daycare',
    child_care_cost: '3000', // Monthly cost, so yearly is 3K * 12 = 36K
    fertility_treatment_type: 'ivf', // Each IVF cycle is 22K
    fertility_treatment_cycles: 2 // So 2 * 22K = 44K
  });

  const response = await client
    .get('/api/planning/expenses')
    .loginVia(user)
    .accept('json')
    .send({ years_in_future: 10, childbirth_on_year: 2 })
    .end();

  const { expenses } = response.body;
  const amounts = expenses.map((estimation) => estimation.expenses);
  assert.sameOrderedMembers(amounts, [
    '44000.00', // <--- Fertility treatment costs is a year before child birth
    '36000.00', // <--- Child care costs start in child birth
    '36000.00',
    '36000.00',
    '36000.00',
    '36000.00',
    '36000.00',
    '36000.00',
    '36000.00',
    '36000.00'
  ]);

  expenses.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown
      .map((br) => Number(br.value))
      .reduce((carry, current) => carry + current, 0);

    assert.closeTo(estimation.y, sumOfBreakdowns, 0.015);
  });

  const labels = expenses
    .map((e) => e.breakdown)
    .flat()
    .map((b) => b.label);
  assert.notInclude(labels, 'off');
  assert.include(labels, 'ivf');
  assert.include(labels, 'daycare');
});

test('fetch expenses where there are not expenses', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    gender: 'female',
    partner_gender: 'male',
    birthdate: '1996-03-15',
    partner_birthdate: '1996-04-15',
    career_begin_age: 22,
    partner_career_begin_age: 22,
    is_primary_care_giver: true
  });
  await user.income().create({
    myself: '100000.00',
    partner: '100000.00'
  });

  await user.expense().create({
    child_care_type: 'off',
    fertility_treatment_type: 'off',
    fertility_treatment_cycles: 0
  });

  const response = await client
    .get('/api/planning/expenses')
    .loginVia(user)
    .accept('json')
    .send({ years_in_future: 10, childbirth_on_year: 2 })
    .end();

  const { expenses } = response.body;
  const amounts = expenses.map((estimation) => estimation.expenses);
  assert.sameOrderedMembers(amounts, ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00']);

  expenses.forEach((estimation) => {
    const sumOfBreakdowns = estimation.breakdown
      .map((br) => Number(br.value))
      .reduce((carry, current) => carry + current, 0);

    assert.closeTo(estimation.y, sumOfBreakdowns, 0.015);
  });
  const labels = expenses
    .map((e) => e.breakdown)
    .flat()
    .map((b) => b.label);
  assert.include(labels, 'off');
  assert.notInclude(labels, 'ivf');
  assert.notInclude(labels, 'nanny');
  assert.notInclude(labels, 'daycare');
});

test('save graph state', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const params = { planning_params: { childbirth_on_year: 7, years_in_future: 10, split_incomes: false } };

  const response = await client.put('/api/me').loginVia(user).accept('json').send(params).end();

  await user.reload();

  response.assertStatus(200);

  assert.deepEqual(params.planning_params, response.body.planning_params);
  assert.deepEqual(params.planning_params, user.planning_params);
});
