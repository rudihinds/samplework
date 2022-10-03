'use strict';

const { test, trait } = use('Test/Suite')('API Authentication');
const Factory = use('Factory');
const User = use('App/Models/User');
const Env = use('Env');
const nock = use('nock');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');
trait('Session/Client');

test('sign up user via ajax', async ({ client, assert }) => {
  const response = await client
    .post('/api/register')
    .accept('json')
    .type('json')
    .send({
      name: 'Arandi Lopez',
      email: 'arandi@example.org',
      password: 'user123',
      password_confirmation: 'user123'
    })
    .end();

  response.assertStatus(201);
  response.assertJSONSubset({ user: { name: 'Arandi Lopez', email: 'arandi@example.org' } });

  const user = await User.find(response.body.user.id);
  assert.equal(1, await user.location().getCount());
  assert.equal(1, await user.income().getCount());
  assert.equal(1, await user.benefit().getCount());
  assert.equal(1, await user.expense().getCount());
});

test('sign up user via ajax subscribe to mailchimp', async ({ client, assert }) => {
  await Env.set('MAILCHIMP_API', 'mailchimp-apikey');
  await Env.set('MAILCHIMP_USERS_LIST_ID', 'mailchimpuserslistid');

  const endpoint = nock(/api\.mailchimp\.com/)
    .post(
      '/3.0/lists/mailchimpuserslistid/members',
      (body) => body.email_address === 'arandi2@example.org' && body.status === 'subscribed'
    )
    .reply(200, { message: 'user subscribed' });

  const response = await client
    .post('/api/register')
    .accept('json')
    .type('json')
    .send({
      name: 'Arandi Lopez',
      email: 'arandi2@example.org',
      password: 'user123',
      password_confirmation: 'user123'
    })
    .end();

  endpoint.done();

  response.assertStatus(201);
});

test('sign up user via mobile app', async ({ client, assert }) => {
  const response = await client
    .post('/api/register')
    .accept('json')
    .type('json')
    .header('x-requested-from', 'Mirza Application')
    .send({
      name: 'Arandi Lopez',
      email: 'arandilopez@example.org',
      password: 'user123',
      password_confirmation: 'user123'
    })
    .end();

  response.assertStatus(201);
  response.assertJSONSubset({
    user: { name: 'Arandi Lopez', email: 'arandilopez@example.org' },
    token: { type: 'bearer' }
  });
  const user = await User.find(response.body.user.id);
  assert.equal(1, await user.location().getCount());
  assert.equal(1, await user.income().getCount());
  assert.equal(1, await user.benefit().getCount());
  assert.equal(1, await user.expense().getCount());
});

test('user can not sign up again', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').make();
  user.email = 'joe@example.com';
  await user.save();

  const response = await client
    .post('/api/register')
    .accept('json')
    .type('json')
    .send({ name: 'Joe Doe', email: 'joe@example.com', password: 'user123' })
    .end();

  response.assertStatus(422);
  response.assertJSONSubset([
    {
      field: 'email',
      validation: 'unique'
    }
  ]);
});

test('sign in user via ajax', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/login')
    .accept('json')
    .type('json')
    .send({ email: user.email, password: 'user123' })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: user.name,
    email: user.email
  });
});

test('sign in user with wrong password', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/login')
    .accept('json')
    .type('json')
    .send({ email: user.email, password: 'user1234' })
    .end();

  response.assertStatus(401);
});

test('sign in user with wrong email', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/login')
    .accept('json')
    .type('json')
    .send({ email: `${user.email}.mx`, password: 'user123' })
    .end();

  response.assertStatus(401);
});

test('sign out user via ajax', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client.post('/api/logout').loginVia(user).accept('json').end();

  response.assertStatus(200);
  response.assertJSON({
    message: 'Logged out'
  });
});

test('sign in user via mobile app', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/login')
    .accept('json')
    .type('json')
    .header('x-requested-from', 'Mirza Application')
    .send({ email: user.email, password: 'user123' })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    type: 'bearer'
  });
});
