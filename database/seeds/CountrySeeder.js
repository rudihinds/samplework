'use strict';

/*
|--------------------------------------------------------------------------
| CountrySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Country = use('App/Models/Country');

class CountrySeeder {
  async run() {
    const count = await Country.getCount();
    if (count < 1) {
      await Country.create({
        id: 237,
        name: 'United States of America',
        iso_code: 'US'
      });
    }
  }
}

module.exports = CountrySeeder;
