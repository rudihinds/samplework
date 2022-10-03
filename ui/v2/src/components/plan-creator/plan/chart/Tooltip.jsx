import React from 'react';
import { css } from 'twin.macro';
import currency from 'currency.js';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-props-no-spreading */
const Line = ({ label, amount, ...props }) => (
  <div tw="flex text-1.4 md:text-1.6" {...props}>
    <div
      tw="flex-1 mr-3.5"
      css={[
        css`
          min-width: 19ch;
        `
      ]}
    >
      {label}
    </div>
    <div
      css={[
        css`
          min-width: 9ch;
          text-align: right;
        `
      ]}
    >
      {amount}
    </div>
  </div>
);

Line.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired
};

const Tooltip = ({
  potentialIncome,
  parenthoodPenalty,
  yearlyExpenses,
  childcareExpenses,
  netIncome
}) => (
  <div
    tw="bg-white rounded-8 p-2 border border-black text-grey-4 space-y-1"
    style={{ zIndex: 1000 }}
  >
    <Line
      label="Potential income"
      amount={`+ ${currency(potentialIncome, { precision: 0 }).format()}`}
    />
    <Line
      label="Parenthood penalty"
      amount={`- ${currency(parenthoodPenalty, { precision: 0 }).format()}`}
    />
    <Line
      label="General expenses"
      amount={`- ${currency(yearlyExpenses, { precision: 0 }).format()}`}
    />
    <Line
      label="Childcare expenses"
      amount={`- ${currency(childcareExpenses, { precision: 0 }).format()}`}
    />
    <Line
      tw="text-mirza-purple font-bold"
      label="Net income"
      amount={currency(netIncome, {
        precision: 0,
        pattern: `+ !#`,
        negativePattern: `- !#`
      }).format()}
    />
  </div>
);

Tooltip.propTypes = {
  potentialIncome: PropTypes.number.isRequired,
  parenthoodPenalty: PropTypes.number.isRequired,
  yearlyExpenses: PropTypes.number.isRequired,
  childcareExpenses: PropTypes.number.isRequired,
  netIncome: PropTypes.number.isRequired
};

export default Tooltip;
