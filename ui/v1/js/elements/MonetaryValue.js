import React from 'react';
import CurrencyFormat from 'react-currency-format';

const MonetaryValue = (props) => {
  const config = { ...props };
  return (
    <CurrencyFormat
      value={config.value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'$'}
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
};

export default MonetaryValue;
