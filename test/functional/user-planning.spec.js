'use strict';

const Env = use('Env');
const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User Planning');
const Factory = use('Factory');
const { selectOption, autocompleteSelectOption, typeInput, slideInput } = require('../support/react');
const MockDate = require('mockdate');
const { trim } = require('../support/utils');

trait('Test/Browser', {
  headless: !Env.get('HEADLESS', 'true').match(/(false|no|0)/),
  defaultViewport: { width: 600, height: 740 }
});
trait('DatabaseTransactions');
trait('Auth/Client');
trait('Session/Client');

beforeEach(() => MockDate.set('2020-06-06'));
afterEach(() => MockDate.reset());

test('explore planning', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');

  await page.pause(500);
  await page.assertHas('INCOME AFTER TAX');
  await page.assertHas('PARENTAL LEAVE');
  await page.assertHas('CHILD CARE');
  await page.assertHas('FERTILITY TREATMENT');

  // Logout user
  await page.page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.waitForElement('[data-sel="profile-menu"]');
  await page.click('[data-sel="profile-menu"]');
  await page.assertHas('Logout');
  await page.click('#logout');
  await page.pause(500);
  await page.hasElement('[data-sel="Login"]');
  await page.assertHas('Create An Account');
}).timeout(60000);

test('check partner name is displayed', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create({ partner_name: 'Sirah' });
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');

  await page.pause(500);
  await page.assertHas('INCOME AFTER TAX');
  await page.assertHas('PARENTAL LEAVE');
  await page.assertHas('CHILD CARE');
  await page.assertHas('FERTILITY TREATMENT');

  // Assert partner name is shown
  await page.assertHas(user.partner_name);
}).timeout(60000);

test('check no partner user correct partner fallback', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  user.has_partner = false;
  user.partner_name = null;
  await user.save();
  await page.page.reload({ waitUntil: 'load' });

  await page.click('a[href="/planning"]');

  await page.pause(5000);
  await page.assertHas('INCOME AFTER TAX');
  await page.assertHas('PARENTAL LEAVE');
  await page.assertHas('CHILD CARE');
  await page.assertHas('FERTILITY TREATMENT');

  // Assert partner name is shown as 'Partner'
  await page.assertHas('Partner');

  // Assert there's no 'null' lying around
  await !page.assertHas('null');
}).timeout(60000);

test('graph has an empty state', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00'
  });
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page
    .click('a[href="/planning"]')
    .waitForElement('[data-sel="graph-empty"]')
    .assertHas('Set up the data on Income');
}).timeout(60000);

test('graph has an empty state for incomplete profile', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').make();
  user.gender = null;
  user.birthdate = null;
  user.career_begin_age = null;
  await user.save();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00'
  });
  await user.income().save(income);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page
    .click('a[href="/planning"]')
    .waitForElement('[data-sel="graph-empty-incomplete-profile"]')
    .assertHas('You must complete your');
}).timeout(60000);

test('expenses bar overlaps income bar when option is merging incomes', async ({ assert, browser }) => {
  await Factory.model('App/Models/Occupation').createMany(8);
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '100000.00',
    partner: '100000.00'
  });
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make({
    child_care_type: 'nanny',
    child_care_cost: '3000.00'
  });
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');
  await page.pause(500);
  await page.click('[data-sel="split_bars"]');
  await page.pause(300);
  await selectOption(page.page, '#childbirth_year_select', '2');
  await page.pause(1000);
  // we need to make sure that the last two bars overlap, but since react-vis' elements order
  // is not left-to-right, we need to find the rightmost element and then get the one that has
  // the same y value; the first and second elements should be the ones we're looking for
  const [last_bar_expenses_coords, last_bar_income_coords] = await page.evaluate(`
    const graph_rects = [...document.querySelector('[data-test="planning-graph"]')
      .querySelectorAll('rect')]
      .sort((a,b)=> b.getBoundingClientRect().x - a.getBoundingClientRect().x);
    const last_rect_coordinates = graph_rects[0].getBoundingClientRect();
    const rects_base_y_value = graph_rects.filter((el)=>{
      const el_coordinates = el.getBoundingClientRect();
      return el_coordinates.y + el_coordinates.height === last_rect_coordinates.y + last_rect_coordinates.height;
    });

    const [last_expenses_bar, last_income_bar] = rects_base_y_value;
    const last_expenses_bar_coords = last_expenses_bar.getBoundingClientRect();
    const last_income_bar_coords = last_income_bar.getBoundingClientRect();
    [JSON.parse(JSON.stringify(last_expenses_bar_coords)), JSON.parse(JSON.stringify(last_income_bar_coords))]
  `);
  assert.isTrue(last_bar_expenses_coords.x - last_bar_income_coords.x - last_bar_expenses_coords.width / 2 < 1);
}).timeout(60000);

test('tooltip hover tests', async ({ assert, browser }) => {
  await Factory.model('App/Models/Occupation').createMany(8);
  const user = await Factory.model('App/Models/User').create({
    name: 'Leonard Martin',
    gender: 'male',
    partner_gender: 'female',
    career_begin_age: 18,
    partner_career_begin_age: 18,
    birthdate: '1988-03-30',
    partner_birthdate: '1988-03-30'
  });
  const income = await Factory.model('App/Models/Income').make({
    myself: '100000.00',
    partner: '100000.00',
    full_time_hrs: '40',
    full_time_hrs_partner: '40'
  });
  const benefit = await Factory.model('App/Models/Benefit').make({
    parental_leave: 12,
    parental_leave_partner: 24,
    unpaid_parental_leave: 2,
    unpaid_parental_leave_partner: 1,
    part_time_work: 10,
    part_time_work_partner: 10,
    return_to_work: 10,
    return_to_work_partner: 10,
    part_time_length: 1,
    part_time_length_partner: 1
  });
  const expense = await Factory.model('App/Models/Expense').make({
    child_care_type: 'nanny',
    child_care_cost: '3000.00',
    fertility_treatment_cycles: 2
  });
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');
  await page.pause(500);
  await page.click('[data-sel="split_bars"]');
  await page.pause(300);
  await selectOption(page.page, '#childbirth_year_select', '2');
  await page.pause(1000);

  // Setup
  await page.evaluate(`
    const getTooltipContent = () => {
      return [...document.querySelector('[data-sel=graph-tooltip]').querySelectorAll('tr')]
        .map((tr) => [...tr.querySelectorAll('th, td')].map((th) => th.textContent).join(' '))
        .join('\\n');
    }
    const CalcBars = ()=>{ return [...document.querySelector('[data-test="planning-graph"]')
      .querySelectorAll('rect')]
      .sort((a,b)=>b.getBoundingClientRect().x-a.getBoundingClientRect().x)}
  `);

  // Check 5 years
  let calcBars = await page.evaluate(`
    let updatedBars = CalcBars();
    JSON.parse(JSON.stringify(updatedBars[0].getBoundingClientRect()));
  `);
  await page.pause(100);
  await page.page.mouse.move(0, 0);
  await page.page.mouse.move(calcBars.x, calcBars.y);
  await page.pause(333);
  await page.waitForElement('[data-sel=graph-tooltip]');
  let incomeTooltip = await page.evaluate('getTooltipContent()');

  await assert.equal(
    trim(`
      Leonard and Partner $USD
      Annual Income 208,966.03
      Your partner took leave! + 7,100.68
      Motherhood Penalty - 3,927.4
      Expenses
      Nanny - 36,000
    `),
    trim(incomeTooltip)
  );

  // Now check 10 years
  await page.click('[data-sel=timelineToggle10y]');
  calcBars = await page.evaluate(`
    updatedBars = CalcBars();
    JSON.parse(JSON.stringify(updatedBars[0].getBoundingClientRect()));
  `);
  await page.pause(100);
  await page.page.mouse.move(0, 0);
  await page.page.mouse.move(calcBars.x, calcBars.y);
  await page.pause(333);
  await page.waitForElement('[data-sel=graph-tooltip]');
  incomeTooltip = await page.evaluate('getTooltipContent()');
  await assert.equal(
    trim(`
      Leonard and Partner $USD
      Annual Income 218,508.1
      Your partner took leave! + 7,425.52
      Motherhood Penalty - 3,336.96
      Expenses
      Nanny - 36,000
    `),
    trim(incomeTooltip)
  );

  // Now remove partner and check with split bars @ 5 years
  user.has_partner = false;
  await user.save();
  await user.reload();

  await page.click('[data-sel="split_bars"]');
  await page.click('[data-sel=timelineToggle5y]');

  calcBars = await page.evaluate(`
    updatedBars = CalcBars();
    JSON.parse(JSON.stringify(updatedBars[0].getBoundingClientRect()));
  `);
  await page.pause(100);
  await page.page.mouse.move(0, 0);
  await page.page.mouse.move(calcBars.x, calcBars.y);
  await page.pause(333);
  await page.waitForElement('[data-sel=graph-tooltip]');
  incomeTooltip = await page.evaluate('getTooltipContent()');
  await assert.equal(
    trim(`
      Leonard $USD
      Annual Income 100,427.07
      Expenses
      Nanny - 36,000
    `),
    trim(incomeTooltip)
  );

  // Now check with split bars @ 10 years
  await page.click('[data-sel=timelineToggle10y]');
  calcBars = await page.evaluate(`
    updatedBars = CalcBars();
    JSON.parse(JSON.stringify(updatedBars[0].getBoundingClientRect()));
  `);
  await page.pause(100);
  await page.page.mouse.move(0, 0);
  await page.page.mouse.move(calcBars.x, calcBars.y);
  await page.pause(333);
  await page.waitForElement('[data-sel=graph-tooltip]');
  incomeTooltip = await page.evaluate('getTooltipContent()');
  await assert.equal(
    trim(`
      Leonard $USD
      Annual Income 105,003.74
      Parenthood Penalty - 4,535.44
      Expenses
      Nanny - 36,000
    `),
    trim(incomeTooltip)
  );
}).timeout(60000);

test('edit zip code', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  const location = await Factory.model('App/Models/Location').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  await user.location().save(location);

  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });
  await page.click('a[href="/planning"]');
  await page.pause(500);

  await page.waitForElement('input[name="zip_code"]');
  await typeInput(page.page, 'input[name="zip_code"]', '');
  await page.type('input[name="zip_code"]', '97314');
  await page.pause(1000);

  const user_location = await user.location().first();
  assert.equal('97314', user_location.zip_code);
  assert.equal('Salem', user_location.city);
  assert.equal('OR', user_location.state);
}).timeout(60000);

test('edit income', async ({ assert, browser }) => {
  await Factory.model('App/Models/Occupation').createMany(8);
  const occupation = await Factory.model('App/Models/Occupation').create({
    name: 'Technology and Engineering'
  });
  const partnerOccupation = await Factory.model('App/Models/Occupation').create({
    name: 'Finance'
  });
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00'
  });
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.hasElement('[data-sel="Planning"]');

  await page.waitForElement('[role=tooltip]').assertHas('Add your current annual post-tax earnings');

  await typeInput(page.page, 'input[name="income_myself"]', '');
  await page.type('input[name="income_myself"]', '5000');
  await typeInput(page.page, 'input[name="full_time_hrs"]', '');
  await page.type('input[name="full_time_hrs"]', '80');

  await page.click('[data-sel=user-industry-autocomplete]');
  await page.pause(500);
  await autocompleteSelectOption(page.page, '[data-sel=user-industry-autocomplete]', occupation.name);
  await typeInput(page.page, 'input[name="income_partner"]', '');
  await page.type('input[name="income_partner"]', '5500');
  await typeInput(page.page, 'input[name="full_time_hrs_partner"]', '');
  await page.type('input[name="full_time_hrs_partner"]', '40');
  await page.click('[data-sel=partner-industry-autocomplete]');
  await autocompleteSelectOption(page.page, '[data-sel=partner-industry-autocomplete]', partnerOccupation.name);
  await page.pause(3000);

  await income.reload();
  assert.equal('5000.00', income.myself);
  assert.equal('5500.00', income.partner);
  assert.equal(80, income.full_time_hrs);
  assert.equal(40, income.full_time_hrs_partner);
  assert.equal(occupation.id, income.occupation_id);
  assert.equal(partnerOccupation.id, income.partner_occupation_id);
}).timeout(60000);

test('edit parental leave', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00'
  });
  const benefit = await Factory.model('App/Models/Benefit').make({
    parental_leave: 12,
    parental_leave_partner: 12
  }); // Parental leave has a default of 12 for new users
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.hasElement('[data-sel="Planning"]');
  await page.pause(500);

  await page.waitForElement('input[name="parental_leave"]').waitForElement('[role=tooltip]');

  await typeInput(page.page, 'input[name="parental_leave"]', '36');
  await typeInput(page.page, 'input[name="parental_leave_partner"]', '12');
  await typeInput(page.page, 'input[name="parental_leave_percentage"]', '101');
  await typeInput(page.page, 'input[name="parental_leave_partner_percentage"]', '0');
  await page.waitForElement('input[name="parental_leave_percentage"]:invalid');
  await page.waitForElement('input[name="parental_leave_partner_percentage"]:invalid');
  await typeInput(page.page, 'input[name="parental_leave_percentage"]', '80');
  await typeInput(page.page, 'input[name="parental_leave_partner_percentage"]', '33');
  await page.pause(700);
  await assert.equal(await page.page.$eval('[name=parental_leave_partner]', (element) => element.value), '12');
  await assert.equal(await page.page.$eval('[name=parental_leave_percentage]', (element) => element.value), '80');
  await assert.equal(
    await page.page.$eval('[name=parental_leave_partner_percentage]', (element) => element.value),
    '33'
  );

  await benefit.reload();
  assert.equal(36, benefit.parental_leave);
  assert.equal(12, benefit.parental_leave_partner);
  assert.equal(80, benefit.parental_leave_percentage);
  assert.equal(33, benefit.parental_leave_percentage_partner);
}).timeout(60000);

test('edit unpaid parental leave', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00'
  });
  const benefit = await Factory.model('App/Models/Benefit').make({
    parental_leave: 12,
    parental_leave_partner: 12,
    unpaid_parental_leave: 2,
    unpaid_parental_leave_partner: 1
  }); // Parental leave has a default of 12 for new users
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.hasElement('[data-sel="Planning"]');
  await page.pause(500);

  await page.waitForElement('input[name="parental_leave"]').waitForElement('[role=tooltip]');

  await typeInput(page.page, 'input[name="unpaid_parental_leave"]', '');
  await page.type('input[name="unpaid_parental_leave"]', '4');
  await typeInput(page.page, 'input[name="unpaid_parental_leave_partner"]', '');
  await page.type('input[name="unpaid_parental_leave_partner"]', '6');
  await page.pause(700);
  await assert.equal(await page.page.$eval(`[name='unpaid_parental_leave_partner']`, (element) => element.value), '6');

  await benefit.reload();
  assert.equal(4, benefit.unpaid_parental_leave);
  assert.equal(6, benefit.unpaid_parental_leave_partner);
}).timeout(60000);

test
  .skip('edit return to work', async ({ assert, browser }) => {
    const user = await Factory.model('App/Models/User').create();
    const income = await Factory.model('App/Models/Income').make({
      myself: '0.00',
      partner: '0.00',
      full_time_hrs: 40,
      full_time_hrs_partner: 40
    });
    const benefit = await Factory.model('App/Models/Benefit').make({
      return_to_work: 30,
      return_to_work_partner: 30
    });
    const expense = await Factory.model('App/Models/Expense').make();
    await user.income().save(income);
    await user.benefit().save(benefit);
    await user.expense().save(expense);
    const page = await browser.visit('/', (request) => {
      request.loginVia(user);
    });

    await page.hasElement('[data-sel="Planning"]');
    await page.pause(500);

    await page
      .click('button[data-sel="editReturnWork"]')
      .waitForElement('input[name="return_to_work"]')
      .waitForElement('[role=tooltip]');

    await slideInput(page.page, 'input[name="return_to_work"]', 25);
    await slideInput(page.page, 'input[name="return_to_work_partner"]', 50);
    await page.pause(700);

    await benefit.reload();
    assert.equal(30, benefit.return_to_work);
    assert.equal(60, benefit.return_to_work_partner);
  })
  .timeout(60000);

test
  .skip('edit return to work as percentage', async ({ assert, browser }) => {
    const user = await Factory.model('App/Models/User').create();
    const income = await Factory.model('App/Models/Income').make({
      myself: '0.00',
      partner: '0.00',
      full_time_hrs: 40,
      full_time_hrs_partner: 40
    });
    const benefit = await Factory.model('App/Models/Benefit').make({
      return_to_work: 30,
      return_to_work_partner: 30
    });
    const expense = await Factory.model('App/Models/Expense').make();
    await user.income().save(income);
    await user.benefit().save(benefit);
    await user.expense().save(expense);
    const page = await browser.visit('/', (request) => {
      request.loginVia(user);
    });

    await page.hasElement('[data-sel="Planning"]');
    await page.pause(500);

    await page.waitForElement('input[name="return_to_work"]').waitForElement('[role=tooltip]');

    await page.click('[data-sel="return_to_work_percent_radio"]');
    await slideInput(page.page, 'input[name="return_to_work"]', 50);
    await slideInput(page.page, 'input[name="return_to_work_partner"]', 50);
    await page
      .waitForElement('[id="client-snackbar"]')
      .assertHasIn('[id="client-snackbar"]', 'Your information has been saved.');

    await benefit.reload();
    assert.equal(20, benefit.return_to_work);
    assert.equal(20, benefit.return_to_work_partner);
  })
  .timeout(60000);

test('edit part time work', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00',
    full_time_hrs: 40,
    full_time_hrs_partner: 40
  });
  const benefit = await Factory.model('App/Models/Benefit').make({
    part_time_work: 30,
    part_time_work_partner: 30
  });
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.hasElement('[data-sel="Planning"]');
  await page.pause(500);

  await page.waitForElement('input[name="part_time_work"]').waitForElement('[role=tooltip]');

  await slideInput(page.page, 'input[name="part_time_work"]', 10);
  await typeInput(page.page, 'input[name="part_time_length"]', '');
  await page.click('input[name="part_time_length"]').type('input[name="part_time_length"]', '104');
  await slideInput(page.page, 'input[name="part_time_work_partner"]', 20);
  await typeInput(page.page, 'input[name="part_time_length_partner"]', '');
  await page.click('input[name="part_time_length_partner"]').type('input[name="part_time_length_partner"]', '4');
  await page.pause(1200);

  await benefit.reload();
  assert.equal(30, benefit.part_time_work);
  assert.equal(24, benefit.part_time_work_partner);
  assert.equal(104, benefit.part_time_length);
  assert.equal(4, benefit.part_time_length_partner);
}).timeout(60000);

test('edit part time work as percentage', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make({
    myself: '0.00',
    partner: '0.00',
    full_time_hrs: 40,
    full_time_hrs_partner: 40
  });
  const benefit = await Factory.model('App/Models/Benefit').make({
    part_time_work: 30,
    part_time_work_partner: 30
  });
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.hasElement('[data-sel="Planning"]');
  await page.pause(500);

  await page.waitForElement('input[name="part_time_work"]').waitForElement('[role=tooltip]');

  await page.click('[data-sel="part_time_percent_radio"]');
  await slideInput(page.page, 'input[name="part_time_work"]', 50);
  await slideInput(page.page, 'input[name="part_time_work_partner"]', 50);
  await page.pause(700);
  await benefit.reload();
  assert.equal(20, benefit.part_time_work);
  assert.equal(20, benefit.part_time_work_partner);
}).timeout(60000);

test('edit child care', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);

  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });
  await page.click('a[href="/planning"]');
  await page.pause(500);
  await page.waitForElement('#child_care_type_select');

  await selectOption(page.page, '#child_care_type_select', 'nanny');
  await page.pause(500);
  await typeInput(page.page, 'input[name="child_care_cost"]', '');
  await page.type('input[name="child_care_cost"]', '500');
  await page.pause(500);
  await page.pause(700);
  await expense.reload();
  assert.equal(1, expense.child_care_type);
  assert.equal('500.00', expense.child_care_cost);
}).timeout(60000);

test('edit fertility treatment', async ({ assert, browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make({
    fertility_treatment_type: 'off',
    fertility_treatment_cycles: 0
  });
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');
  await page.pause(500);

  // This line was added because one of the selectors was hidden to
  // Puppeteer by being positioned below the screen's width
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  await page.waitForElement('#fertility_treatment_type_select');

  await selectOption(page.page, '#fertility_treatment_type_select', 'ivf');
  await page.pause(200);
  await typeInput(page.page, 'input[name="fertility_treatment_cycles"]', '');
  await page.type('input[name="fertility_treatment_cycles"]', '2');
  await page.pause(700);
  await expense.reload();
  assert.equal('44000.00', expense.fertility_treatment_cost);
  assert.equal(1, expense.fertility_treatment_type);
  assert.equal(2, expense.fertility_treatment_cycles);
}).timeout(60000);

test('persist graph data on yearly view', async ({ browser, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('[data-sel=timelineToggle10y]');
  await selectOption(page.page, '#childbirth_year_select', '6');
  await page.pause(500);
  await page.click('[data-sel="split_bars"]');
  await page.close();

  const page_reloaded = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page_reloaded.waitForElement('[data-sel=timelineToggle10y].Mui-selected');

  const timeline10y = await page_reloaded.hasElement('[data-sel=timelineToggle10y].Mui-selected');
  assert.isTrue(timeline10y);
  const splitCheckbox = await page_reloaded.hasElement('[data-sel=split_bars] .Mui-checked');
  assert.isFalse(splitCheckbox);
  await page_reloaded.assertHasIn('[data-sel=childbirthOnYearSelect]', '2025');
}).timeout(60000);

test('user and partner select industries', async ({ browser, assert }) => {
  await Factory.model('App/Models/Occupation').createMany(8);
  const occupation = await Factory.model('App/Models/Occupation').create({
    name: 'Finance'
  });
  const partnerOccupation = await Factory.model('App/Models/Occupation').create({
    name: 'Technology and Engineering'
  });
  const user = await Factory.model('App/Models/User').create();
  const income = await Factory.model('App/Models/Income').make();
  const benefit = await Factory.model('App/Models/Benefit').make();
  const expense = await Factory.model('App/Models/Expense').make();
  await user.income().save(income);
  await user.benefit().save(benefit);
  await user.expense().save(expense);
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');
  await page.pause(500);

  await page.click('[data-sel=user-industry-autocomplete]');
  await page.pause(100);
  await autocompleteSelectOption(page.page, '[data-sel=user-industry-autocomplete]', occupation.name);
  await page.pause(100);

  await page.click('[data-sel=partner-industry-autocomplete]');
  await page.pause(100);
  await autocompleteSelectOption(page.page, '[data-sel=partner-industry-autocomplete]', partnerOccupation.name);
  await page.pause(1200);

  await income.reload();

  assert.equal(occupation.id, income.occupation_id);
  assert.equal(partnerOccupation.id, income.partner_occupation_id);
}).timeout(60000);

test('user watches the needle video', async ({ browser }) => {
  const user = await Factory.model('App/Models/User').create();
  const page = await browser.visit('/', (request) => {
    request.loginVia(user);
  });

  await page.click('a[href="/planning"]');
  await page.pause(500);

  await page.assertHasIn('[data-sel=video-guide-link]', 'What moves the needle');
  await page.click('[data-sel=video-guide-link]');
  await page.waitForElement('[data-sel=video-modal]');
}).timeout(60000);
