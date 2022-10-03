'use strict';

const Env = use('Env');
const { test, trait } = use('Test/Suite')('User Register');
const nock = use('nock');
const User = use('App/Models/User');

trait('Test/Browser', { headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/) });
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

test('after user signs up, the default unauthenticated view is login', async ({ browser }) => {
  let page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');
  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.pause(500);

  await page
    .type('[data-sel="signup-email-input"] input', 'duran@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.waitForElement('[data-sel="OnboardingWelcome"]');
  await page.page.reload({ waitUntil: 'load' });

  const user = await User.findBy({ email: 'duran@example.com' });
  user.onboarding_finished_at = new Date();
  await user.save();

  await page.page.reload({ waitUntil: 'load' });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Logout');
  await page.click('#logout');
  await page.pause(500);

  page = await browser.visit('/', { waitUntil: 'load' });
  await page.hasElement('[data-sel="Login"]');
}).timeout(60000);

test('mailchimp subscription on signup', async ({ browser }) => {
  await Env.set('MAILCHIMP_API', 'mailchimp-apikey');
  await Env.set('MAILCHIMP_USERS_LIST_ID', 'mailchimponsignup');

  const endpoint = nock(/api\.mailchimp\.com/)
    .post(
      '/3.0/lists/mailchimponsignup/members',
      (body) => body.email_address === 'mango@example.com' && body.status === 'subscribed'
    )
    .reply(200, { message: 'user subscribed' });

  const page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');

  await page
    .type('[data-sel="signup-email-input"] input', 'mango@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.waitForElement('[data-sel="OnboardingWelcome"]');

  endpoint.done();
}).timeout(60000);
