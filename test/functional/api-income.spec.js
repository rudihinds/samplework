'use strict';

const { test, trait } = use('Test/Suite')('API Income');
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('create new income', async ({ client, assert }) => {
  const occupations = await Factory.model('App/Models/Occupation').createMany(10);
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('api/income')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      myself: 100.5,
      partner: 100.5,
      full_time_hrs: 80,
      full_time_hrs_partner: 80,
      occupation_id: occupations[5].id,
      partner_occupation_id: occupations[6].id
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    user_id: user.id,
    myself: 100.5,
    partner: 100.5,
    full_time_hrs: 80,
    full_time_hrs_partner: 80,
    occupation_id: occupations[5].id,
    partner_occupation_id: occupations[6].id,
    occupation: {
      name: occupations[5].name
    },
    partner_occupation: {
      name: occupations[6].name
    }
  });
  assert.equal(1, await user.income().getCount());
});

test('update income', async ({ client, assert }) => {
  const occupations = await Factory.model('App/Models/Occupation').createMany(10);
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    occupation_id: occupations[7].id,
    partner_occupation_id: occupations[3].id
  });
  await user.income().save(income);
  assert.equal(1, await user.income().getCount());

  const response = await client
    .post('api/income')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      myself: 100.5,
      partner: 100.5,
      occupation_id: 0,
      partner_occupation_id: occupations[4].id
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    user_id: user.id,
    myself: 100.5,
    partner: 100.5,
    occupation_id: null,
    partner_occupation_id: occupations[4].id
  });
  assert.equal(1, await user.income().getCount());
  await income.reload();
  assert.equal(100.5, income.myself);
  assert.equal(100.5, income.partner);
});

test('fetch income', async ({ client }) => {
  const occupations = await Factory.model('App/Models/Occupation').createMany(10);
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: 5000.55,
    partner: 5000.55,
    full_time_hrs: 40,
    full_time_hrs_partner: 80,
    occupation_id: occupations[2].id,
    partner_occupation_id: occupations[3].id
  });
  await user.income().save(income);

  const response = await client.get('api/income').type('json').accept('json').loginVia(user, 'api').send().end();

  response.assertStatus(200);
  response.assertJSONSubset({
    id: income.id,
    myself: income.myself.toString(),
    partner: income.partner.toString(),
    user_id: user.id,
    occupation: {
      name: occupations[2].name
    },
    partner_occupation: {
      name: occupations[3].name
    }
  });
});
