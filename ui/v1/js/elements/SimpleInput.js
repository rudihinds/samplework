import React from 'react';
import TextField from '@material-ui/core/TextField';

const SimpleInput = ({ variant, ...props }) => {
  return <TextField variant={variant} {...props} />;
};

SimpleInput.defaultProps = {
  variant: 'outlined'
};

export default SimpleInput;
