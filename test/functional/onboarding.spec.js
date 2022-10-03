'use strict';

const Env = use('Env');
const { test, trait } = use('Test/Suite')('User Onboarding');
const Factory = use('Factory');
const { selectOption } = require('../support/react');
const User = use('App/Models/User');

trait('Test/Browser', { headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/) });
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

test('User selects identity', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.gender = null;
  await user.save();
  const page = await browser.visit('/welcome', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='OnboardingWelcome']");
  await page.click('[data-sel=terms-of-service]');
  await page.click('[data-sel=i-understand-button]');
  await page.pause(500);

  await page.waitForElement("[data-sel='onboarding_gender_step']");
  await selectOption(page.page, "[data-sel='gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_gender_step']");

  await user.reload();
  assert.equal(user.gender, 'nonbinary');
}).timeout(60000);

test('User selects birthday', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.birthdate = null;
  await user.save();
  const page = await browser.visit('/your-birthdate', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '15');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '5');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1955');
  await page.pause(500);

  await page.assertHasIn('[data-sel=birthday_month_select]', 'June');

  await page.click('[data-sel=savePref]');
  await page.waitUntilMissing("[data-sel='onboarding_birthdate_step']");

  await user.reload();
  assert.deepEqual(user.birthdate, new Date('1955-06-15 GMT-0600'));
}).timeout(60000);

test('User selects invalid birthday, root defaults to step 2', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.birthdate = null;
  await user.save();
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '31');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '1');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1999');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.assertHas('It looks like the date you selected is invalid, please check again.');

  assert.isNull(user.birthdate);
}).timeout(60000);

test('User selects family plans', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.family_plans = null;
  await user.save();
  const page = await browser.visit('/family-plans', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  await selectOption(page.page, "[data-sel='family_plan_select']", 'is_pregnant');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_family_plans_step']");

  await user.reload();
  assert.equal(user.family_plans, 'is_pregnant');
}).timeout(60000);

test('User selects career start year', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create({
    birthdate: '1997-04-30',
    career_begin_age: 18
  });
  user.onboarding_finished_at = null;

  await user.save();
  const page = await browser.visit('/your-career-start-age', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  await selectOption(page.page, "[data-sel='career_start_select']", '2018');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_career_start_step']");

  await user.reload();

  assert.equal(user.career_begin_age, '21');
}).timeout(60000);

test('User selects whether user has partner', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  await user.save();

  const page = await browser.visit('/do-you-have-a-partner', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  await selectOption(page.page, "[data-sel='user_partner_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await user.reload();
  assert.equal(user.has_partner, true);
}).timeout(60000);

test('User selects whether user is primary care giver', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.has_partner = true;
  await user.save();

  const page = await browser.visit('/childbearing-parent', (request) => {
    request.loginVia(user);
  });

  await page.waitForElement("[data-sel='onboarding_primary_caregiver_step']");
  await selectOption(page.page, "[data-sel='user_primary_caregiver_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_primary_caregiver_step']");

  await user.reload();

  assert.equal(user.is_primary_care_giver, true);
}).timeout(60000);

test('User inputs partner name', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.partner_gender = null;
  user.has_partner = true;
  user.is_primary_care_giver = true;
  await user.save();
  const page = await browser.visit('/partner-name', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_user_partner_name_step']");
  await page.type('[data-sel="user_partner_name"] input', 'Sirah');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_name_step']");

  await user.reload();
  assert.equal(user.partner_name, 'Sirah');
}).timeout(60000);

test('User selects partner identity', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.partner_gender = null;
  user.has_partner = true;
  user.is_primary_care_giver = true;
  user.partner_name = 'Sirah';
  await user.save();
  const page = await browser.visit('/partner', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_partner_gender_step']");
  await selectOption(page.page, "[data-sel='partner_gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_gender_step']");

  await user.reload();
  assert.equal(user.partner_gender, 'nonbinary');
}).timeout(60000);

test('User selects partner birthday', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.has_partner = true;
  user.is_primary_care_giver = true;
  user.partner_gender = 'nonbinary';
  user.partner_name = 'Sirah';
  await user.save();
  const page = await browser.visit('/partner-birthdate', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '30');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '3');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1955');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_birthdate_step']");

  await user.reload();
  assert.deepEqual(user.partner_birthdate, new Date('1955-04-30 GMT-0600'));
}).timeout(60000);

test('User selects invalid partner birthday', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.partner_birthdate = null;
  user.has_partner = true;
  user.is_primary_care_giver = true;
  user.partner_gender = 'nonbinary';
  user.partner_name = 'Sirah';
  await user.save();
  const page = await browser.visit('/partner-birthdate', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '31');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '3');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1969');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.assertHas('It looks like the date you selected is invalid, please check again.');

  assert.isNull(user.partner_birthdate);
}).timeout(60000);

test('User selects partner career start year', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create({
    partner_birthdate: '1997-04-30',
    partner_career_begin_age: 18
  });
  user.onboarding_finished_at = null;
  user.is_primary_care_giver = true;
  user.partner_gender = 'nonbinary';
  user.has_partner = true;
  user.partner_name = 'Sirah';
  await user.save();
  const page = await browser.visit('/partner-career-start-age', (request) => {
    request.loginVia(user);
  });
  await page.waitForElement("[data-sel='onboarding_partner_career_start_step']");
  await selectOption(page.page, "[data-sel='partner_career_start_select']", '2018');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_career_start_step']");

  await user.reload();
  assert.equal(user.partner_career_begin_age, '21');
}).timeout(60000);

test('User does entire onboarding with partner', async ({ assert, browser }) => {
  const page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');

  await page.pause(500);

  await page
    .type('[data-sel="signup-email-input"] input', 'onboardingwpartneruser@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.pause(500);

  const user = await User.findBy({ email: 'onboardingwpartneruser@example.com' });

  await page.waitForElement("[data-sel='OnboardingWelcome']");
  await page.click('[data-sel=terms-of-service]');
  await page.click('[data-sel=i-understand-button]');

  await page.waitForElement("[data-sel='onboarding_gender_step']");
  await selectOption(page.page, "[data-sel='gender_identity_select']", 'nonbinary');
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '1 out of 10');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_gender_step']");

  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '1');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '0');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1990');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '2 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  await selectOption(page.page, "[data-sel='family_plan_select']", 'is_pregnant');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '3 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_family_plans_step']");

  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  await selectOption(page.page, "[data-sel='career_start_select']", '2018');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '4 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_career_start_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  // check that number of steps changes if user has no partner
  await selectOption(page.page, "[data-sel='user_partner_select']", 'false');
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '5 out of 5');

  // check it changes back if user does have a partner
  await selectOption(page.page, "[data-sel='user_partner_select']", 'true');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '5 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await page.waitForElement("[data-sel='onboarding_primary_caregiver_step']");
  await selectOption(page.page, "[data-sel='user_primary_caregiver_select']", 'true');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '6 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_primary_caregiver_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_name_step']");
  await page.type('[data-sel="user_partner_name"] input', 'Sirah');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '7 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_name_step']");

  await page.waitForElement("[data-sel='onboarding_partner_gender_step']");
  await selectOption(page.page, "[data-sel='partner_gender_identity_select']", 'nonbinary');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '8 out of 10');
  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_gender_step']");

  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '31');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '11');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1992');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '9 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_partner_career_start_step']");
  await selectOption(page.page, "[data-sel='partner_career_start_select']", '2018');
  await page.pause(500);
  await page.waitForElement('[data-sel=bottom-content]').assertHasIn('[data-sel=bottom-content]', '10 out of 10');

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_career_start_step']");

  await page.pause(500);
  await user.reload();

  await page.assertPath('/planning');

  assert.equal(user.gender, 'nonbinary');
  assert.deepEqual(user.birthdate, new Date('1990-01-01 GMT-0600'));
  assert.equal(user.career_begin_age, '29');
  assert.equal(user.has_partner, true);
  assert.equal(user.is_primary_care_giver, true);
  assert.equal(user.partner_gender, 'nonbinary');
  assert.deepEqual(user.partner_birthdate, new Date('1992-12-31 GMT-0600'));
  assert.equal(user.partner_career_begin_age, '26');
  assert.isNotNull(user.onboarding_finished_at);
  assert.instanceOf(user.onboarding_finished_at, Date);
}).timeout(60000);

test('User does entire onboarding without partner', async ({ assert, browser }) => {
  const page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');

  await page.pause(500);

  await page
    .type('[data-sel="signup-email-input"] input', 'onboardingnopartneruser@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.pause(500);

  const user = await User.findBy({ email: 'onboardingnopartneruser@example.com' });

  await page.waitForElement("[data-sel='OnboardingWelcome']");
  await page.click('[data-sel=terms-of-service]');
  await page.click('[data-sel=i-understand-button]');

  await page.waitForElement("[data-sel='onboarding_gender_step']");
  await selectOption(page.page, "[data-sel='gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_gender_step']");

  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '30');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '3');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1997');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  await selectOption(page.page, "[data-sel='family_plan_select']", 'is_pregnant');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_family_plans_step']");

  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  await selectOption(page.page, "[data-sel='career_start_select']", '2018');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_career_start_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  await selectOption(page.page, "[data-sel='user_partner_select']", 'false');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await page.pause(500);
  await user.reload();

  await page.assertPath('/planning');

  assert.equal(user.gender, 'nonbinary');
  assert.deepEqual(user.birthdate, new Date('1997-04-30 GMT-0500'));
  assert.equal(user.career_begin_age, '21');
  assert.equal(user.has_partner, false);
  assert.equal(user.is_primary_care_giver, true);
  assert.isNotNull(user.onboarding_finished_at);
  assert.instanceOf(user.onboarding_finished_at, Date);
}).timeout(60000);

test('User does entire onboarding with partner then switches to no partner', async ({ assert, browser }) => {
  const page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');

  await page.pause(500);

  await page
    .type('[data-sel="signup-email-input"] input', 'onboardingswitchnopartneruser@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.pause(500);

  const user = await User.findBy({ email: 'onboardingswitchnopartneruser@example.com' });

  await page.waitForElement("[data-sel='OnboardingWelcome']");
  await page.click('[data-sel=terms-of-service]');
  await page.click('[data-sel=i-understand-button]');

  await page.waitForElement("[data-sel='onboarding_gender_step']");
  await selectOption(page.page, "[data-sel='gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_gender_step']");

  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '31');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '2');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1996');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  await selectOption(page.page, "[data-sel='family_plan_select']", 'is_pregnant');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_family_plans_step']");

  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  await selectOption(page.page, "[data-sel='career_start_select']", '2018');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_career_start_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  await selectOption(page.page, "[data-sel='user_partner_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await page.waitForElement("[data-sel='onboarding_primary_caregiver_step']");
  await selectOption(page.page, "[data-sel='user_primary_caregiver_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_primary_caregiver_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_name_step']");
  await page.type('[data-sel="user_partner_name"] input', 'Sirah');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_name_step']");

  await page.waitForElement("[data-sel='onboarding_partner_gender_step']");
  await selectOption(page.page, "[data-sel='partner_gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_gender_step']");

  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '30');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '3');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1985');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_birthdate_step']");

  await page.page.goBack();
  await page.page.goBack();
  await page.page.goBack();
  await page.page.goBack();
  await page.page.goBack();

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  await selectOption(page.page, "[data-sel='user_partner_select']", 'false');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await page.pause(500);
  await user.reload();

  await page.assertPath('/planning');

  assert.equal(user.has_partner, false);
  assert.equal(user.is_primary_care_giver, true);
  assert.isNull(user.partner_gender);
  assert.isNull(user.partner_name);
  assert.isNull(user.partner_birthdate);
  assert.isNull(user.partner_career_begin_age);
  assert.isNotNull(user.onboarding_finished_at);
  assert.instanceOf(user.onboarding_finished_at, Date);
}).timeout(60000);

test('User does nothing and skips to finish url', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  user.onboarding_finished_at = null;
  user.gender = null;
  await user.save();
  const page = await browser.visit('/finish', (request) => {
    request.loginVia(user);
  });

  await !page.assertPath('/finish');
  await user.reload();
  assert.isNull(user.onboarding_finished_at);
}).timeout(60000);

test('User does entire onboarding, checks DOM data integrity', async ({ assert, browser }) => {
  const page = await browser.visit('/', { waitUntil: 'load' });

  await page.waitForElement('[data-sel="Signup"]');

  await page.pause(500);

  await page
    .type('[data-sel="signup-email-input"] input', 'userdomintegrity@example.com')
    .type('[data-sel="signup-password-input"] input', 'user123')
    .type('[data-sel="signup-name-input"] input', 'Joe Doe')
    .click('button');

  await page.pause(500);

  await page.waitForElement("[data-sel='OnboardingWelcome']");
  await page.click('[data-sel=terms-of-service]');
  await page.click('[data-sel=i-understand-button]');

  await page.waitForElement("[data-sel='onboarding_gender_step']");
  await selectOption(page.page, "[data-sel='gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_gender_step']");

  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '1');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '1');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1995');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  await selectOption(page.page, "[data-sel='family_plan_select']", 'is_pregnant');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_family_plans_step']");

  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  await selectOption(page.page, "[data-sel='career_start_select']", '2018');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_career_start_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  await selectOption(page.page, "[data-sel='user_partner_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_step']");

  await page.waitForElement("[data-sel='onboarding_primary_caregiver_step']");
  await selectOption(page.page, "[data-sel='user_primary_caregiver_select']", 'true');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_primary_caregiver_step']");

  await page.waitForElement("[data-sel='onboarding_user_partner_name_step']");
  await page.type('[data-sel="user_partner_name"] input', 'Sirah');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_user_partner_name_step']");

  await page.waitForElement("[data-sel='onboarding_partner_gender_step']");
  await selectOption(page.page, "[data-sel='partner_gender_identity_select']", 'nonbinary');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_gender_step']");

  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  await selectOption(page.page, "[data-sel='birthday_day_select']", '28');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_month_select']", '1');
  await page.pause(500);
  await selectOption(page.page, "[data-sel='birthday_year_select']", '1996');
  await page.pause(500);

  await page.click('[data-sel=savePref]');

  await page.waitUntilMissing("[data-sel='onboarding_partner_birthdate_step']");

  await page.waitForElement("[data-sel='onboarding_partner_career_start_step']");
  await selectOption(page.page, "[data-sel='partner_career_start_select']", '2018');
  await page.pause(500);

  let selected = await page.page.$eval("[name='partner_career_begin_age']", (item) => item.value);
  assert.equal(selected, '2018');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_partner_birthdate_step']");
  selected = await page.page.$eval("[name='day']", (item) => item.value);
  assert.equal(selected, '28');
  selected = await page.page.$eval("[name='month']", (item) => item.value);
  assert.equal(selected, '1');
  selected = await page.page.$eval("[name='year']", (item) => item.value);
  assert.equal(selected, '1996');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_partner_gender_step']");
  selected = await page.page.$eval("[name='partner_gender']", (item) => item.value);
  assert.equal(selected, 'nonbinary');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_user_partner_name_step']");
  selected = await page.page.$eval("[name='partner_name']", (item) => item.value);
  assert.equal(selected, 'Sirah');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_primary_caregiver_step']");
  selected = await page.page.$eval("[name='is_primary_care_giver']", (item) => item.value);
  assert.equal(selected, 'true');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_user_partner_step']");
  selected = await page.page.$eval("[name='has_partner']", (item) => item.value);
  assert.equal(selected, 'true');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_career_start_step']");
  selected = await page.page.$eval("[name='career_begin_age']", (item) => item.value);
  assert.equal(selected, '2018');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_family_plans_step']");
  selected = await page.page.$eval("[name='family_plans']", (item) => item.value);
  assert.equal(selected, 'is_pregnant');
  page.page.goBack();
  await page.waitForElement("[data-sel='onboarding_birthdate_step']");
  selected = await page.page.$eval("[name='day']", (item) => item.value);
  assert.equal(selected, '1');
  selected = await page.page.$eval("[name='month']", (item) => item.value);
  assert.equal(selected, '1');
  selected = await page.page.$eval("[name='year']", (item) => item.value);
  assert.equal(selected, '1995');
  page.page.goBack();
  await page.waitForElement("[data-sel='gender_identity_select']");
  selected = await page.page.$eval("[name='gender']", (item) => item.value);
  assert.equal(selected, 'nonbinary');
}).timeout(60000);
