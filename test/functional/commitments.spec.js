'use strict';

const Env = use('Env');
const nock = use('nock');
const { test, trait } = use('Test/Suite')('Commitments');
const Factory = use('Factory');

trait('Test/Browser', {
  headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/)
});
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

test('Test commitments disclaimer', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => request.loginVia(user));
  await page.click('a[href="/commitments"]');
  await page.pause(1000);
  await page.waitForElement('[data-sel=commitments-disclaimer]');
  await page.assertHas('Commitments are core to relationships.');
  await page.click('[data-sel=disclaimer-button]');
  await page.pause(500);
  await page.page.reload({ waitUntil: 'load' });
  await assert.notInclude(await page.getText(), 'Commitments are core to relationships.');
}).timeout(60000);

test('Test commitments screens', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => request.loginVia(user));
  await page.click('a[href="/commitments"]');
  await page.waitForElement('[data-sel=commitments-disclaimer]');
  await page.click('[data-sel=new-commitment-button]');
  await page.waitForElement('[data-sel=add-commitments-wrapper]');
  await page.click('[data-sel=custom-commitment-button]');
  await page.waitForElement('[data-sel=commitments-email-modal]');
  await page.assertHas('"Commitments" is not available yet');
  await page.click('[data-sel=modal-close]');
  await page.pause(500);
  await page.click('a[href="/commitments/add/tasks"]');
  await page.assertPath('/commitments/add/tasks');
  await page.waitForElement('[data-sel=our-commitments-button]');
  await page.click('[data-sel=my-commitments-button]');
  await page.waitForElement('[data-sel=commitments-email-modal]');
  await page.assertHas('"Commitments" is not available yet');
  await page.click('[data-sel=modal-close]');
  await page.pause(500);
  await page.click('[data-sel=our-commitments-button]');
  await page.waitForElement('[data-sel=commitments-email-modal]');
  await page.assertHas('"Commitments" is not available yet');
  await page.click('[data-sel=modal-close]');
  await page.pause(500);
  await assert.notInclude(await page.getText(), '"Commitments" is not available yet');
}).timeout(60000);

test('Test commitments email modal', async ({ assert, browser }) => {
  await Env.set('MAILCHIMP_API', 'mailchimp-apikey');
  await Env.set('MAILCHIMP_COMMITMENTS_LIST_ID', 'mailchimpcommitmentslistid');
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => request.loginVia(user));
  const endpoint = nock(/api\.mailchimp\.com/)
    .post(
      '/3.0/lists/mailchimpcommitmentslistid/members',
      (body) => body.email_address === 'commitmentsuser@example.com' && body.status === 'subscribed'
    )
    .reply(200, { message: 'user subscribed' });

  await page.click('a[href="/commitments"]');
  await page.waitForElement('[data-sel=commitments-disclaimer]');
  await page.click('[data-sel=new-commitment-button]');
  await page.waitForElement('[data-sel=add-commitments-wrapper]');
  await page.click('[data-sel=custom-commitment-button]');
  await page.waitForElement('[data-sel=commitments-email-modal]');
  await page.assertHas('"Commitments" is not available yet');
  await page.click('[data-sel=email_input]', { clickCount: 3 });
  await page.page.keyboard.press('Backspace');
  await page.type('[data-sel=email_input] input', 'b@dem@il.com');
  await page.click('[data-sel="modal-subscribe"]');
  await page.waitForElement('[data-sel=email_input] input:invalid');
  await page.click('[data-sel=email_input]', { clickCount: 3 });
  await page.page.keyboard.press('Backspace');
  await page.type('[data-sel=email_input] input', 'commitmentsuser@example.com');
  await page.click('[data-sel="modal-subscribe"]');
  await page.waitForElement('[data-sel=subscribed_success]');
  await page.assertHas('You are subscribed!');

  endpoint.done();
}).timeout(60000);
