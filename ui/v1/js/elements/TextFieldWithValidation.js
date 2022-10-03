import React from 'react';
import { FilledInput as DefaultInput, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    background: '#fff',
    '&$focused': {
      background: theme.colors.white
    },
    '&$disabled': {
      background: theme.colors.white
    },
    '&:hover': {
      background: theme.colors.white,
      border: 0
    },
    '&:after': {
      borderColor: theme.colors.eggPlant
    }
  },
  focused: {}, // Must be set
  disabled: {} // Must be set
});

const TextFieldWithValidation = ({ variant, label, disabled, className, fullWidth, error, ...props }) => (
  <FormControl variant={variant} disabled={disabled} fullWidth={fullWidth} error={Boolean(error)}>
    {label && <InputLabel>{label}</InputLabel>}
    {props.children ?? <DefaultInput disabled={disabled} className={props.classes.root} {...props} />}
    {Boolean(error) && <FormHelperText>Error: {error}</FormHelperText>}
  </FormControl>
);

TextFieldWithValidation.defaultProps = {
  fullWidth: false,
  error: false,
  disabled: false,
  variant: 'filled'
};

export default withStyles(styles)(TextFieldWithValidation);
