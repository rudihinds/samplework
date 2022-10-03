'use strict';

const Env = use('Env');
const { test, trait } = use('Test/Suite')('User Login');
const Factory = use('Factory');
const Mail = use('Mail');
const Hash = use('Hash');
const PasswordReset = use('App/Models/PasswordReset');

trait('Test/Browser', {
  headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/),
  defaultViewport: { width: 1366, height: 768 }
});
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

test('user login', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', { waitUntil: 'load' });
  await page.click('a[href="/login"]');

  await page.waitForElement('[data-sel="Login"]');

  await page
    .type('[data-sel="login-email-input"] input', user.email)
    .type('[data-sel="login-password-input"] input', 'user123')
    .click('button');

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.hasElement('[data-sel="Planning"]');
}).timeout(60000);

test('user logout', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => request.loginVia(user));
  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.waitForElement('#logout');
  await page.assertHas('Logout');
  await page.click('#logout');

  await page.waitForElement('a[href="/login"]');
  await page.assertHas('Login');
}).timeout(60000);

test('user forgot his password', async ({ assert, browser }) => {
  Mail.fake();
  const user = await Factory.model('App/Models/User').create();
  let page = await browser.visit('/', { waitUntil: 'load' });
  await page.click('a[href="/login"]');

  await page.waitForElement('[data-sel="Login"]');

  await page.click('a[href="/password/forgot"]');

  await page.waitForElement('[data-sel="PasswordRecovery-form"]');

  await page.assertHas('Password recovery');
  await page.type('[data-sel="password-recovery-email-input"] input', user.email).click('button');

  await page.pause(500);
  assert.equal(Mail.all().length, 1);
  const mail = Mail.recent();

  assert.equal(user.email, mail.envelope.to[0]);
  assert.equal('Password reset link', mail.message.subject);
  await page.waitForElement('[data-sel="PasswordRecovery-confirmation"]');
  await page.close();

  const { token } = await PasswordReset.findBy({ email: user.email });

  page = await browser.visit('/password/reset/' + token, { waitUntil: 'load' });

  await page.waitForElement('input[type="email"]');
  await page.assertHas('Enter your new password');
  await page
    .type('[data-sel="password-reset-email-input"] input', user.email)
    .type('[data-sel="password-reset-password-input"] input', '123user')
    .type('[data-sel="password-reset-passwordconfirmation-input"] input', '123user')
    .click('button');

  await page.pause(500);
  await user.reload();
  assert.isTrue(await Hash.verify('123user', user.password), 'Password was not changed');

  await page.close();

  Mail.restore();
}).timeout(60000);

test('after user logs in the default unauthenticated view is login', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  let page = await browser.visit('/', { waitUntil: 'load' });
  await page.waitForElement('[data-sel="Signup"]');
  await page.click('a[href="/login"]');
  await page.waitForElement('[data-sel="Login"]');

  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page
    .type('[data-sel="login-email-input"] input', user.email)
    .type('[data-sel="login-password-input"] input', 'user123')
    .click('button');

  await page.waitForElement('#logout');
  await page.click('#logout');

  page = await browser.visit('/', { waitUntil: 'load' });
  await page.hasElement('[data-sel="Login"]');
}).timeout(60000);

test('register a new user after logout another one should redirect to onboarding', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', { waitUntil: 'load' });
  await page.waitForElement('[data-sel="Signup"]');
  await page.click('a[href="/login"]');
  await page.waitForElement('[data-sel="Login"]');
  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page
    .type('[data-sel="login-email-input"] input', user.email)
    .type('[data-sel="login-password-input"] input', 'user123')
    .click('button');

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Logout');
  await page.click('#logout');
  await page.waitForElement('[data-sel=Login]');
  assert.isTrue(await page.hasElement('[data-sel="Login"]'));

  await page.pause(5000);
  await page.click('a[href="/signup"]');
  await page.pause(5000);
  await page.waitForElement('[data-sel=Signup]');

  await page
    .type('[data-sel="signup-email-input"] input', 'joe@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');
  await page.pause(500);
  assert.isTrue(await page.hasElement("[data-sel='OnboardingWelcome']"));
}).timeout(6000000);
