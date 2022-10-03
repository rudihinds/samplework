'use strict';

const { test, trait } = use('Test/Suite')('API Benefit');
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('save parental leave', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      parental_leave: 30,
      parental_leave_partner: 0
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    parental_leave: 30,
    parental_leave_partner: 0
  });
});

test('save parental leave with percentage', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      parental_leave: 30,
      parental_leave_partner: 0,
      parental_leave_percentage: 90,
      parental_leave_percentage_partner: 100
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    parental_leave: 30,
    parental_leave_partner: 0,
    parental_leave_percentage: 90,
    parental_leave_percentage_partner: 100
  });
});

test('save unpaid parental leave', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      unpaid_parental_leave: 60,
      unpaid_parental_leave_partner: 0
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    unpaid_parental_leave: 60,
    unpaid_parental_leave_partner: 0
  });
});

test('save return to work', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      return_to_work: 20,
      return_to_work_partner: 40
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    return_to_work: 20,
    return_to_work_partner: 40
  });
});

test('save part time work', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      part_time_work: 30,
      part_time_work_partner: 0,
      part_time_length: 52,
      part_time_length_partner: 52
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    part_time_work: 30,
    part_time_work_partner: 0,
    part_time_length: 52,
    part_time_length_partner: 52
  });
});

test('save parental leave and return to work', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      parental_leave: 30,
      parental_leave_partner: 8,
      return_to_work: 20,
      return_to_work_partner: 40
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    parental_leave: 30,
    parental_leave_partner: 8,
    return_to_work: 20,
    return_to_work_partner: 40
  });
});

test('input validation', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/api/benefits')
    .type('json')
    .accept('json')
    .loginVia(user, 'api')
    .send({
      parental_leave: 120,
      parental_leave_partner: 0,
      return_to_work: -20,
      return_to_work_partner: 140
    })
    .end();

  response.assertStatus(422);
  response.assertJSONSubset([
    {
      field: 'return_to_work'
    }
  ]);
});

test('fetch benefits', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const benefit = await Factory.model('App/Models/Benefit').make();
  await user.benefit().save(benefit);

  const response = await client.get('/api/benefits').type('json').accept('json').loginVia(user, 'api').send().end();

  response.assertStatus(200);
  response.assertJSONSubset(benefit.toJSON());
});
