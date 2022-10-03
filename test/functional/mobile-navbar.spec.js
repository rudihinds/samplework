'use strict';

const { test, trait } = use('Test/Suite')('Mobile navbar');
const Factory = use('Factory');
const Env = use('Env');

trait('Test/Browser', {
  headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/),
  defaultViewport: { width: 360, height: 740 }
});
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

test('open profile menu and logout', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();

  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });
  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Profile');
  await page.click('#profile');
  await page.waitForElement('a[href="/profile/edit"]');
  await page.click('a[href="/profile/edit"]');

  await page.waitForElement('[data-sel=Profile]');

  await page.click('[data-sel="profile-menu"]');
  await page.waitForElement('#logout');
  await page.click('#logout');

  await page.waitForElement('[data-sel=Signup]');
}).timeout(60000);

test('verify navbar routing', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();

  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="burger-menu"]');
  await page.assertHas('Blog');
  await page.click('a[href="/commitments"]');
  await page.pause(500);
  await page.assertHas('Commitments');
  await !page.assertHas('Blog');
}).timeout(60000);
