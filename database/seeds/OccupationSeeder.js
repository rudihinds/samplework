'use strict';

/*
|--------------------------------------------------------------------------
| OccupationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
| Usage: node ace seed --files="OccupationSeeder.js" -f
|
*/

const Occupation = use('App/Models/Occupation');

class OccupationSeeder {
  async run() {
    const count = await Occupation.getCount();
    if (count < 1) {
      const data = [
        'Agriculture, Food & Natural Resources',
        'Architecture & Construction',
        'Arts, Audio/Video Technology & Communications',
        'Business Management & Administration',
        'Education & Training',
        'Finance',
        'Government & Public Administration',
        'Health Science',
        'Hospitality & Tourism',
        'Human Services',
        'Information Technology',
        'Law, Public Safety, Corrections & Security',
        'Manufacturing',
        'Marketing',
        'Science, Technology, Engineering & Mathematics',
        'Transportation, Distribution & Logistics'
      ].map((name) => ({ name }));

      await Occupation.createMany(data);
    }
  }
}

module.exports = OccupationSeeder;
