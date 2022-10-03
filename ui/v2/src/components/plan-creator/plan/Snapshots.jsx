import React from 'react';

import { styled } from 'twin.macro';
import { up } from 'styled-breakpoints';
import PropTypes from 'prop-types';
// import { find } from 'lodash';
// import currency from 'currency.js';

import hands from '@assets/parent-child-hands.svg';
import moneyIcon from '@assets/money-icon-circle.svg';

// const netIncomeTen = '$0';

const Snapshots = ({ monthlyChildCosts, estimatedNetIncome }) => (
  <Container>
    <div className="single-snapshot">
      <div className="snap-circle">
        <img src={hands} alt="" />
      </div>
      <div className="snap-content">
        <div className="snap-text">
          <p tw="opacity-70">Your estimated monthly child-related costs are</p>
        </div>
        <h2>{monthlyChildCosts}</h2>
      </div>
    </div>
    <div className="single-snapshot">
      <div className="snap-circle">
        <img src={moneyIcon} alt="" />
      </div>
      <div className="snap-content">
        <div className="snap-text">
          <p tw="opacity-70">Your estimated net income over 10 years is</p>
        </div>
        <h2>{estimatedNetIncome}</h2>
      </div>
    </div>
  </Container>
);

Snapshots.propTypes = {
  monthlyChildCosts: PropTypes.string.isRequired,
  estimatedNetIncome: PropTypes.string.isRequired
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 13px 0;

  & .snap-circle {
    width: 60px;
  }

  & .snap-text {
    flex: 1;
    font-size: 1.6rem;
  }

  & .single-snapshot {
    background-color: #fff;
    margin-top: 7px;
    padding: 14px;
    border-radius: 14px;
    display: flex;

    & .snap-content {
      margin-left: 20px;
      flex: 1;
    }

    & .snap-circle {
      max-height: 74px;
      max-width: 74px;
      min-height: 65px;
      min-width: 65px;

      ${up('sm')} {
        display: none;
      }
    }
  }

  & .image {
    display: none;
  }

  ${up('sm')} {
    flex-direction: row;
    margin-top: 0;

    & .image {
      flex: 1;
    }

    & .single-snapshot {
      padding: 15px;
      flex: 1;

      &:last-child {
        margin-left: 20px;
      }

      & .snap-content {
        margin: 0;
      }

      & .snap-text {
        padding: 0;
        flex-direction: column;
        color: #55666b;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
        -moz-line-clamp: 2; /* number of lines to show */
        -moz-box-orient: vertical;
        overflow: hidden;
      }

      & h2 {
        line-height: 100%;
        margin-top: 10px;
      }
    }
  }

  & > * {
    display: flex;
    justify-content: space-between;
  }
`;

export default Snapshots;
