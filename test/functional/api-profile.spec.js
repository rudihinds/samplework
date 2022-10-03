'use strict';

const { test, trait } = use('Test/Suite')('API Profile');
const Factory = use('Factory');
const Hash = use('Hash');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('get signed in user information', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client.get('/api/me').loginVia(user, 'api').accept('json').end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: user.name,
    email: user.email
  });
});

test('user updates profile', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .put('/api/me')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send({
      name: 'Arandi Lopez',
      currency: 'mxn',
      gender: 'male',
      partner_gender: 'female',
      is_primary_care_giver: 0
    })
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    name: 'Arandi Lopez',
    currency: 'MXN',
    email: user.email,
    gender: 'male',
    partner_gender: 'female',
    is_primary_care_giver: false
  });
});

test('user updates his password', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .put('/api/me/password')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send({
      old_password: 'user123',
      password: 'usuario123',
      password_confirmation: 'usuario123'
    })
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    message: 'Password updated'
  });

  await user.reload();
  assert.isTrue(await Hash.verify('usuario123', user.password));
});

test('user cannot updates his password if forgots his current password', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .put('/api/me/password')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send({
      old_password: '123user',
      password: 'usuario123',
      password_confirmation: 'usuario123'
    })
    .end();
  response.assertStatus(403);
  response.assertJSONSubset({
    error: 'Action not authorized'
  });

  await user.reload();
  assert.isFalse(await Hash.verify('usuario123', user.password));
});

test('user finishes onboarding', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  await user.save();
  await user.reload();
  assert.isNull(user.onboarding_finished_at);
  const response = await client
    .post('/api/me/finish-onboarding')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send()
    .end();
  response.assertStatus(200);
  assert.isNotNull(response.body.onboarding_finished_at);
  await user.reload();
  response.assertJSONSubset({ ...user.toJSON(), onboarding_finished_at: response.body.onboarding_finished_at });
});

test('user finishes onboarding and partner values to null if user has no partner', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.has_partner = false;
  await user.save();
  await user.reload();
  assert.isNull(user.onboarding_finished_at);
  assert.isNotNull(user.partner_gender);
  assert.isNotNull(user.partner_birthdate);
  assert.isNotNull(user.partner_career_begin_age);

  const response = await client
    .post('/api/me/finish-onboarding')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send()
    .end();

  response.assertStatus(200);
  assert.isNotNull(response.body.onboarding_finished_at);
  response.assertJSONSubset({
    ...user.toJSON(),
    onboarding_finished_at: response.body.onboarding_finished_at,
    partner_age: null, // Calculated value on json serialization
    partner_gender: null,
    partner_birthdate: null,
    partner_name: null,
    partner_career_begin_age: null,
    is_primary_care_giver: true // as fallback, when has no partner is_PCG is true
  });
});

test('user updates meta commitments disclaimer', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  await user.reload();
  assert.deepEqual(user.meta, {});
  user.meta = { ...user.meta, a: 'b' };
  await user.save();
  await user.reload();

  const response = await client
    .put('/api/me/meta/commitments_disclaimer_ok')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send()
    .end();
  response.assertStatus(200);

  await user.reload();

  assert.deepEqual(['a', 'commitments_disclaimer_ok_at'], Object.keys(user.meta));
  assert.deepEqual(['a', 'commitments_disclaimer_ok_at'], Object.keys(response.body.meta));
});

test('user updates meta custom values', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  await user.reload();
  assert.deepEqual(user.meta, {});
  user.meta = { ...user.meta, a: 'b' };
  await user.save();
  await user.reload();

  const response = await client
    .put('/api/me/meta')
    .loginVia(user, 'api')
    .accept('json')
    .type('json')
    .send({ c: 'd', a: 'x' })
    .end();
  response.assertStatus(200);

  await user.reload();
  assert.deepEqual(user.meta, response.body.meta);

  assert.deepEqual({ c: 'd', a: 'x' }, user.meta);
});
