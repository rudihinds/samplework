const fetch = require('node-fetch');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const isAuthenticated = require('../../utils/isAuthenticated');

const resolvers = {
  Query: {
    async childcareAverageCosts(_, { zip_code, num_infants }, { auth }) {
      const careResponse = await fetch(
        'https://www.care.com/platform/spi/rates/jobRateByZip?' +
          new URLSearchParams({
            zip: zip_code,
            numOfInfants: num_infants,
            apiKey: 'cmtux62opFFZ8Aov8J0aoJ1zRonczZyqP60pTTURdfIx'
          })
      );
      const careJSON = await careResponse.json();
      if (careJSON.statusCode !== 200) {
        throw new Error('Bad response from API');
      }
      return {
        weekly_nanny_rate: careJSON.data.weeklyNannyRate,
        weekly_nanny_share_rate: careJSON.data.weeklyNannyShareRate,
        weekly_daycare_rate: careJSON.data.weeklyDayCareCenterRate
      };
    }
  }
};

const resolversComposition = {
  'Query.childcareAverageCosts': [isAuthenticated()]
};

module.exports = composeResolvers(resolvers, resolversComposition);
