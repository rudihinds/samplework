import React from 'react';

const Input = (props) => {
  const config = { ...props };
  config.type = config.type || 'text';
  config.className = `inputtext input${config.type} ${config.className || ''} ${config.disabled ? 'disabled' : ''}`;
  return <input {...config} />;
};

export default Input;
