import React from 'react';
import Wrapper from '@layouts/Wrapper';
import PlanCreatorGutter from '@layouts/PlanCreatorGutter';
import Plans from '@plan-creator/Plans';
import { styled } from 'twin.macro';

import ActionPlan from '@components/action-plan';

function PlanCreator() {
  return (
    <PlanCreatorGutter>
      <Wrapper>
        <div tw="px-2.5 pt-4 pb-2.5 md:(px-0 pt-5) lg:pb-4.5 smlp:(flex space-x-3 items-stretch)">
          <div tw="flex-1">
            <h1>Plan Creator</h1>
            <div>
              <p tw="text-mirza-green mt-2 mb-1.5 font-bold">
                Build multiple plans and compare scenarios
              </p>
              <P>
                Use this tool to make the best financial choices for you and
                your family, understand upcoming costs and balance your parental
                leave and time out of work.
              </P>
            </div>
          </div>
          <div tw="flex-1 hidden md:block">
            <ActionPlan />
          </div>
        </div>
        <Plans />
        <div tw="flex-1 md:hidden">
          <ActionPlan />
        </div>
        <footer tw="pb-10" />
      </Wrapper>
    </PlanCreatorGutter>
  );
}

const P = styled.p`
  max-width: 50ch;
`;

export default PlanCreator;
