import React from 'react';
import tw, { styled } from 'twin.macro';
import arrow from '@assets/black-arrow.svg';
import arrowMb from '@assets/arrow-mobile-wht.svg';
import CommunityCardImage from '@assets/community-card.jpg';
import CommonCard from '@reuseable/cards/CommonCard';
import { up } from 'styled-breakpoints';

function ConnectCard() {
  return (
    <CommunityCard
      as="a"
      href="https://links.geneva.com/invite/ef06ce83-77a0-462a-8ac9-c378de7a298f"
      target="_blank"
    >
      <div tw="mb-2.5">
        <img src={CommunityCardImage} alt="" tw="rounded-16" />
      </div>
      <div className="content-section">
        <div className="title">
          <h2>Connect to our community</h2>
          <div tw="flex items-center">
            <img id="large-arrow" src={arrow} alt="" />
            <img id="small-arrow" src={arrowMb} alt="" />
          </div>
        </div>
        <div className="main-content">
          <p>
            Join a friendly & safe community of parents in the same boat as you
          </p>
        </div>
      </div>
    </CommunityCard>
  );
}

const CommunityCard = styled(CommonCard)`
  ${tw`bg-mirza-beige`}
  order: 6;
  color: black;
  padding: 25px;
  display: block;

  .title {
    display: flex;
    justify-content: space-between;
    height: max-content;
  }

  ${up('smLp')} {
    grid-area: cc;
    // display: grid;
    // grid-template-rows: 1fr 0.5fr;
    justify-content: space-between;

    & div {
      justify-content: center;
    }

    & .content-section {
      display: grid;
      gap: 8px 0;
    }

    & .title {
      grid-column: 1;
    }
  }

  #large-arrow {
    display: none;
  }

  ${up('sm')} {
    padding: 28px 32px;

    #large-arrow {
      display: unset;
    }

    #small-arrow {
      display: none;
    }

    .main-content {
      width: 85%;
    }
  }

  ${up('smLp')} {
    padding: 25px;
  }
`;

export default ConnectCard;
