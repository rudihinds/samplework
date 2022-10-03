'use strict';

const { test, trait } = use('Test/Suite')('Api Location');
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');
trait('Session/Client');

test('save zip code and find location', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/location')
    .loginVia(user)
    .accept('json')
    .type('json')
    .send({
      zip_code: '44444'
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    zip_code: '44444',
    city: 'Newton Falls',
    state: 'OH'
  });
});

test('validate zip code length', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/location')
    .loginVia(user)
    .accept('json')
    .type('json')
    .send({
      zip_code: '444'
    })
    .end();

  response.assertStatus(422);
  response.assertJSONSubset([
    {
      field: 'zip_code'
    }
  ]);
});

test('validate zip code existance', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/location')
    .loginVia(user)
    .accept('json')
    .type('json')
    .send({
      zip_code: '99999'
    })
    .end();

  response.assertStatus(422);
  response.assertJSONSubset([
    {
      field: 'zip_code'
    }
  ]);
});

test('fetch empty location', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client.get('/api/location').loginVia(user).accept('json').type('json').send().end();

  response.assertStatus(200);
});

test('fetch location', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const location = await user.location().create({ zip_code: '97314', city: 'Los Angeles', state: 'CA' });
  const response = await client.get('/api/location').loginVia(user).accept('json').type('json').send().end();

  response.assertStatus(200);
  response.assertJSONSubset(location.toJSON());
});
