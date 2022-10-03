'use strict';

const { test, trait } = use('Test/Suite')('Expense Model');
const Expense = use('App/Models/Expense');

trait('DatabaseTransactions');

test('set child care type', async ({ assert }) => {
  const expense = new Expense();
  assert.isUndefined(expense.child_care_type);
  expense.child_care_type = 'daycare';
  assert.equal(2, expense.child_care_type);
  assert.include(expense.toJSON(), { child_care_type: 'daycare' });
});

test('set fertility treament data', async ({ assert }) => {
  const expense = new Expense();
  assert.isUndefined(expense.child_care_type);
  assert.isUndefined(expense.child_care_cost);
  assert.isUndefined(expense.child_care_cycles);
  expense.fertility_treatment_type = 'ivf';
  expense.fertility_treatment_cycles = 2;
  await expense.save();
  assert.equal(1, expense.fertility_treatment_type);
  assert.equal(2, expense.fertility_treatment_cycles);
  assert.equal(44000.0, expense.fertility_treatment_cost);
  assert.include(expense.toJSON(), { fertility_treatment_type: 'ivf' });
});

test('unset fertility treatment data', async ({ assert }) => {
  const expense = new Expense();
  expense.fertility_treatment_type = 'ivf';
  expense.fertility_treatment_cycles = 2;
  await expense.save();
  assert.equal(1, expense.fertility_treatment_type);
  assert.equal(2, expense.fertility_treatment_cycles);
  assert.equal(44000.0, expense.fertility_treatment_cost);

  expense.fertility_treatment_type = 'off';
  await expense.save();
  assert.equal(0, expense.fertility_treatment_type);
  assert.equal(0, expense.fertility_treatment_cycles);
  assert.equal(0, expense.fertility_treatment_cost);
});
