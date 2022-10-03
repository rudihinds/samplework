'use strict';

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User Profile');
const Factory = use('Factory');
const Env = use('Env');
const { selectOption, asLocalizedDate } = require('../support/react');
const MockDate = require('mockdate');

trait('Test/Browser', {
  headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/),
  defaultViewport: { width: 1920, height: 1080 }
});
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

beforeEach(() => {
  MockDate.set('2020-06-06');
});

afterEach(() => {
  MockDate.reset();
});

test('edit user profile', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Profile');
  await page.click('#profile');
  await page.pause(500);
  await page.waitForElement('a[href="/profile/edit"]');

  await page.assertHas(user.name);
  await page.assertHas(user.email);
  await page.pause(500);
  await page.click('a[href="/profile/edit"]');
  await page.pause(500);
  await page.waitForElement('input[name="name"]');

  await page.type('input[name="partner_name"]', 'Sirah');

  await selectOption(page.page, '#gender', 'female');
  await page.pause(500);
  await selectOption(page.page, '#partner_gender', 'male');
  await page.pause(500);

  await page
    .type('input[name="birthdate"]', await asLocalizedDate(page.page, '1993-04-15'))
    .click('input[name="birthdate"]');
  await page.pause(300);
  await page
    .type('input[name="partner_birthdate"]', await asLocalizedDate(page.page, '1996-03-15'))
    .click('input[name="partner_birthdate"]');
  await page.pause(300);

  await selectOption(page.page, '#career_begin_age', '22');
  await page.pause(500);
  await selectOption(page.page, '#partner_career_begin_age', '23');
  await page.pause(500);
  await selectOption(page.page, '#family_plans', 'is_pregnant');
  await page.pause(500);

  await page.click('[data-sel="primary_care_giver_self"]');
  await page.pause(500);
  await page.click('button[name="submit"]');
  await page.pause(500);

  await user.reload();

  assert.equal(user.partner_name, 'Sirah');
  assert.equal(user.age, 27);
  assert.equal(user.partner_age, 24);
  assert.isTrue(user.is_primary_care_giver);
  assert.equal(user.gender, 'female');
  assert.equal(user.partner_gender, 'male');
}).timeout(60000);

test('user attempts to put a date that would make them younger than 16', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();

  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.click('#profile');
  await page.pause(300);
  await page.waitForElement('[data-sel=Profile]');

  await page.click('a[href="/profile/edit"]');
  await page.waitForElement('[data-sel="ProfileEdit"]');
  await page.type('input[name="birthdate"]', await asLocalizedDate(page.page, '2004-12-12'));
  await page.click('button[name="submit"]');

  await page.assertHas('Oops! Please enter an age of 16 or older');
}).timeout(60000);

test('user can see all onboarding fields', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create({
    name: 'Martin Leonard',
    email: 'martinleonard@live.com',
    gender: 'male',
    partner_gender: 'female',
    career_begin_age: 18,
    partner_career_begin_age: 18,
    birthdate: '1988-03-30',
    partner_birthdate: '1988-03-30'
  });
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Profile');
  await page.click('#profile');
  await page.pause(500);

  // Check all onboarding attributes existe and are correct
  await page.assertHasIn('[data-sel=profile-name]', 'Martin Leonard');
  await page.assertHasIn('[data-sel=profile-email]', 'martinleonard@live.com');
  await page.assertHasIn('[data-sel=profile-gender]', 'Male');
  await page.assertHasIn('[data-sel=profile-birthdate]', '1988-03-30');
  await page.assertHasIn('[data-sel=profile-career-begin]', '18');
  await page.assertHasIn('[data-sel=profile-family-plans]', `I'm thinking about it`);
  await page.assertHasIn('[data-sel=profile-career-begin]', '18');
  await page.assertHasIn('[data-sel=profile-partner-gender]', 'Female');
  await page.assertHasIn('[data-sel=profile-partner-birthdate]', '1988-03-30');
  await page.assertHasIn('[data-sel=profile-partner-career-begin]', '18');
  await page.assertHasIn('[data-sel=profile-childbearer]', 'Your Partner');

  // Now check if user has no partner then we shouldn't see any partner data
  user.has_partner = false;
  await user.save();
  await page.page.reload({ waitUntil: 'load' });
  await !page.assertHas('[data-sel=profile-partner-section]');
}).timeout(60000);
