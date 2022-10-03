import React from 'react';
import tw, { styled } from 'twin.macro';
import FamilyStageCard from '@dashboard/FamilyStageCard';
import GraphCard from '@dashboard/GraphCard';
import ParenthoodPenaltyCard from '@dashboard/ParenthoodPenaltyCard';
import BlogCard from '@dashboard/BlogCard';
import ConnectCard from '@dashboard/ConnectCard';
import Wrapper from '@layouts/Wrapper';
import Gutter from '@layouts/Gutter';
import WelcomeCard from '@dashboard/WelcomeCard';
import graphImg from '@assets/Graph.svg';
import { up } from 'styled-breakpoints';

function Dashboard() {
  return (
    <Gutter>
      <Wrapper>
        <DashGrid>
          <WelcomeCard />
          <FamilyStageCard />
          <GraphCard
            mainImage={graphImg}
            monthlyChildCosts="$1900"
            netIncomeTen="$20,000"
          />
          <ParenthoodPenaltyCard />
          <BlogCard />
          <ConnectCard />
        </DashGrid>
      </Wrapper>
    </Gutter>
  );
}

// Imports default Tailwind breakpoints into styled-breakpoints
// sm: "640px"
// md: "768px"
// smLp: '926px'
// lg: "1024px"
// xl: "1280px"
// 2xl: "1536px"

const DashGrid = styled.div`
  display: flex;
  flex-direction: column;
  margin: 26px 0;

  ${up('smLp')} {
    padding: 0;
    ${tw`h-full`}
    grid-row: 2/-1;
    display: grid;
    height: 100%;
    min-height: 0;
    width: 100%;
    grid-template-columns: repeat(18, 1fr);
    margin-top: 22px;
    gap: 30px;
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .'
      'wb wb wb wb wb wb wb wb wb wb pp pp pp pp pp pp pp pp'
      'fs fs fs fs fs fs fs fs fs fs pp pp pp pp pp pp pp pp'
      'fs fs fs fs fs fs fs fs fs fs pp pp pp pp pp pp pp pp'
      'gc gc gc gc gc gc gc gc gc gc bc bc bc bc bc bc bc bc'
      'gc gc gc gc gc gc gc gc gc gc bc bc bc bc bc bc bc bc'
      'gc gc gc gc gc gc gc gc gc gc bc bc bc bc bc bc bc bc'
      'gc gc gc gc gc gc gc gc gc gc bc bc bc bc bc bc bc bc'
      'gc gc gc gc gc gc gc gc gc gc bc bc bc bc bc bc bc bc'
      'gc gc gc gc gc gc gc gc gc gc cc cc cc cc cc cc cc cc'
      'gc gc gc gc gc gc gc gc gc gc cc cc cc cc cc cc cc cc'
      'gc gc gc gc gc gc gc gc gc gc cc cc cc cc cc cc cc cc'
      'gc gc gc gc gc gc gc gc gc gc cc cc cc cc cc cc cc cc'
      'gc gc gc gc gc gc gc gc gc gc cc cc cc cc cc cc cc cc'
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . '
      '.  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . ';
    background-color: #fff;
  }

  ${up('smLp')} {
    padding: 0;
    margin: 0;
    margin: 22px 0 0 0;
  }
`;

export default Dashboard;
