'use strict';

const { test, trait } = use('Test/Suite')('Api Expense');
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('save child care', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('api/expenses')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      child_care_type: 'daycare',
      child_care_cost: '250.00'
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    child_care_type: 'daycare',
    child_care_cost: '250.00',
    user_id: user.id
  });
});

test('save fertility treatment', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('api/expenses')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      fertility_treatment_type: 'ivf',
      fertility_treatment_cycles: 3
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    fertility_treatment_type: 'ivf',
    fertility_treatment_cost: 66000,
    fertility_treatment_cycles: 3,
    user_id: user.id
  });
});

test('save all', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('api/expenses')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      child_care_type: 'daycare',
      child_care_cost: '250.00',
      fertility_treatment_type: 'ivf',
      fertility_treatment_cycles: 1
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    child_care_type: 'daycare',
    child_care_cost: '250.00',
    fertility_treatment_type: 'ivf',
    fertility_treatment_cost: 22000,
    fertility_treatment_cycles: 1,
    user_id: user.id
  });
});

test('fetch expenses', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const expense = await Factory.model('App/Models/Expense').make({
    child_care_type: 'daycare',
    child_care_cost: '250.00',
    fertility_treatment_type: 'ivf',
    fertility_treatment_cycles: 2
  });
  await user.expense().save(expense);

  const response = await client.get('api/expenses').accept('json').loginVia(user, 'api').end();

  response.assertStatus(200);
  response.assertJSONSubset({
    child_care_type: 'daycare',
    child_care_cost: '250.00',
    fertility_treatment_type: 'ivf',
    fertility_treatment_cost: '44000.00',
    fertility_treatment_cycles: 2,
    user_id: user.id
  });
});
