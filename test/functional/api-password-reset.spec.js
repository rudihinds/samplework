'use strict';

const { test, trait } = use('Test/Suite')('API Password Reset');
const Mail = use('Mail');
const Factory = use('Factory');
const Hash = use('Hash');
const PasswordReset = use('App/Models/PasswordReset');
const randomToken = require('rand-token');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('user request password reset and gets a mail with token', async ({ assert, client }) => {
  Mail.fake();
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/password/forgot')
    .type('json')
    .accept('json')
    .send({ email: user.email })
    .end();
  response.assertStatus(200);
  response.assertJSON({
    message: 'Password reset link has been sent to your email'
  });
  assert.equal(1, await PasswordReset.getCount());
  const reset = await PasswordReset.first();
  assert.equal(1, Mail.all().length);
  const mail = Mail.recent();
  assert.equal(mail.message.subject, 'Password reset link');
  assert.include(mail.envelope.from, 'noreply@heymirza.com');
  assert.include(mail.envelope.to, user.email);
  assert.include(mail.envelope.to, reset.email);
  assert.include(mail.message.html, reset.token);
  Mail.restore();
});

test('user request password reset from mobile app and gets a mail with token', async ({ assert, client }) => {
  Mail.fake();
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post('/api/password/forgot')
    .type('json')
    .accept('json')
    .header('x-requested-from', 'Mirza Application')
    .send({ email: user.email })
    .end();
  response.assertStatus(200);
  response.assertJSON({
    message: 'Password reset link has been sent to your email'
  });
  assert.equal(1, await PasswordReset.getCount());
  const reset = await PasswordReset.first();
  assert.equal(1, Mail.all().length);
  const mail = Mail.recent();
  assert.equal(mail.message.subject, 'Password reset link');
  assert.include(mail.envelope.from, 'noreply@heymirza.com');
  assert.include(mail.envelope.to, user.email);
  assert.include(mail.envelope.to, reset.email);
  assert.include(mail.message.html, reset.token);
  Mail.restore();
});

test('user resets his password with a token', async ({ assert, client }) => {
  Mail.fake();
  const user = await Factory.model('App/Models/User').create();
  const { token } = await PasswordReset.create({ email: user.email, token: randomToken.generate(16) });

  const response = await client
    .post('/api/password/reset/' + token)
    .type('json')
    .accept('json')
    .send({
      email: user.email,
      password: 'user12345',
      password_confirmation: 'user12345'
    })
    .end();
  response.assertStatus(200);
  response.assertJSON({
    message: 'Your password has been updated'
  });
  await user.reload();
  assert.isTrue(await Hash.verify('user12345', user.password));
  assert.equal(0, await PasswordReset.query().where('email', user.email).getCount());
  assert.equal(1, Mail.all().length);
  const mail = Mail.recent();
  assert.equal(mail.message.subject, 'Password was updated');
  assert.include(mail.envelope.from, 'noreply@heymirza.com');
  assert.include(mail.envelope.to, user.email);
  assert.include(mail.message.html, user.name);
  Mail.restore();
});
