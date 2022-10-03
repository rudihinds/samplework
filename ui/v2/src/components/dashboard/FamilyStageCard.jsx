import React from 'react';
import { SVG as ThinkingIcon } from '@assets/thinking-icon.svg';
import { styled } from 'twin.macro';
import CommonCard from '@reuseable/cards/CommonCard';

function FamilyStageCard() {
  return (
    <FamStage>
      <div className="image">
        <ThinkingIcon />
      </div>
      <div className="text">
        <p>Your family stage:</p>
        <p>Thinking about starting a family</p>
      </div>
    </FamStage>
  );
}

const FamStage = styled(CommonCard)`
  order: 2;
  grid-area: fs;
  background-color: #f7f7f8;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 13px 20px;

  & .image {
    height: 51px;
    width: 51px;
    width: 47px;
  }

  & .text {
    margin-left: 18px;

    & p:last-child {
      font-weight: 700;
      letter-spacing: 0.2;
    }
  }
`;

export default FamilyStageCard;
