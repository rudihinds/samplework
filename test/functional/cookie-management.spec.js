'use strict';

const Env = use('Env');
const { test, trait } = use('Test/Suite')('Cookie Test');

trait('Test/Browser', { headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/) });
trait('DatabaseTransactions');

test('Cookie banner disappears after accepting cookies', async ({ browser, assert }) => {
  Env.set('SKIP_COOKIES_DISCLAIMER', '');
  const page = await browser.visit('/');
  await page.waitForElement("[data-sel='Signup']");
  await page.assertHas(
    'Mirza uses cookies to help us understand how you use the site and give you the best online experience'
  );
  await page.click('[data-sel=accept-cookies]');
  await page.pause(500);
  await page.page.reload({ waitUntil: 'load' });
  await assert.notInclude(
    await page.getText(),
    'Mirza uses cookies to help us understand how you use the site and give you the best online experience'
  );
  Env.set('SKIP_COOKIES_DISCLAIMER', '1');
}).timeout(60000);
