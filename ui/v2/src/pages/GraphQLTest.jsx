import React from 'react';
import { gql, useQuery } from '@apollo/client';

const FETCH_PLANS = gql`
  query FetchPlans {
    me {
      plans {
        zip_code
        self_annual_income
      }
    }
  }
`;

const GraphQLTest = () => {
  const { loading, error, data } = useQuery(FETCH_PLANS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      {data.me.plans.map((plan) => (
        <div>{JSON.stringify(plan)}</div>
      ))}
    </div>
  );
};

export default GraphQLTest;
