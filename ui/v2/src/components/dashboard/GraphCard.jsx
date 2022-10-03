import React from 'react';
import tw, { styled } from 'twin.macro';
import CommonCard from '@reuseable/cards/CommonCard';
import GoButton from '@reuseable/buttons/GoButton';
import ChartWithControls from '@plan-creator/plan/ChartWithControls';
import { NavLink } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { MY_PLANS } from '@graphql/queries/plans';

function GraphCard() {
  const { loading, error, data } = useQuery(MY_PLANS);

  return (
    <GraphCardStyled>
      {loading && <div>Loading...</div>}
      {error && <div>Error :(</div>}
      {data && (
        <ChartWithControls
          plan={data.me?.default_plan}
          allowChoosingDefaultPlan
          plans={data.me?.plans}
        />
      )}
      <NavLink tw="mt-2" exact to="/plan-creator" activeClassName="active-bar">
        <GoButton />
      </NavLink>
    </GraphCardStyled>
  );
}

const GraphCardStyled = styled(CommonCard)`
  ${tw`p-2.5 md:p-3`}
  order: 4;
  grid-area: gc;
  background-color: #f7f7f8;
`;

export default GraphCard;
