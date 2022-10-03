import React from 'react';
import tw, { styled } from 'twin.macro';
import arrow from '@assets/Group 4.svg';
import arrowMb from '@assets/arrow-mobile-wht.svg';
import CommonCard from '@reuseable/cards/CommonCard';
import { up } from 'styled-breakpoints';

function ParenthoodPenaltyCard() {
  return (
    <PpCard
      target="_blank"
      as="a"
      href="https://www.heymirza.com/rolling-the-dice-breaking-down-the-motherhood-penalty"
    >
      <div className="title">
        <h2>What is the Parenthood&nbsp;Penalty?</h2>
        <img id="large-arrow" src={arrow} alt="" />
        <img id="small-arrow" src={arrowMb} alt="" />
      </div>
      <div className="main-content">
        <p>
          Discover how working parents encounter systematic disadvantages in
          pay, and how Mirza can help
        </p>
      </div>
      {/* <div className='main'>
      </div> */}
    </PpCard>
  );
}

const PpCard = styled(CommonCard)`
  ${tw`bg-mirza-purple`}
  order: 3;
  grid-area: pp;
  display: grid;
  color: #fff;
  align-items: center;

  // in mockups, pl is 27px, pr is 18px, using 23 as middle grd.
  padding: 23px;

  .title {
    grid-column: 1;
    display: flex;
    justify-content: space-between;
    height: max-content;
  }

  .main-content {
    width: 85%;
  }

  #large-arrow {
    display: none;
  }

  ${up('sm')} {
    padding: 28px 25px;

    #large-arrow {
      display: unset;
    }

    #small-arrow {
      display: none;
    }
  }

  ${up('smLp')} {
    padding: 25px;
  }
`;

export default ParenthoodPenaltyCard;
