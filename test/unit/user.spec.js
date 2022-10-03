'use strict';

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User Model');
const Hash = use('Hash');
const User = use('App/Models/User');
const MockDate = require('mockdate');

trait('DatabaseTransactions');

beforeEach(() => MockDate.set('2020-06-06'));
afterEach(() => MockDate.reset());

test('password is hashed before save', async ({ assert }) => {
  const user = new User();
  user.name = 'Joe Doe';
  user.email = 'joe@example.com';
  user.password = 'user123';
  await user.save();
  assert.isTrue(await Hash.verify('user123', user.password));
});

test('currency is uppercased before save', async ({ assert }) => {
  const user = new User();
  user.name = 'Joe Doe';
  user.email = 'joe@example.com';
  user.password = 'user123';
  user.currency = 'mxn';
  await user.save();
  assert.equal('MXN', user.currency);
});

test('ages are computed', async ({ assert }) => {
  const user = new User();
  user.name = 'Joe Doe';
  user.email = 'joe@example.com';
  user.password = 'user123';
  user.currency = 'mxn';
  user.birthdate = '1993-04-15';
  user.partner_birthdate = '1996-03-09';
  await user.save();
  await user.reload();
  assert.equal(user.age, 27);
  assert.equal(user.partner_age, 24);
  assert.include(user.toJSON(), { age: 27, partner_age: 24 });
});
