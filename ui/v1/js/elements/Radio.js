import React from 'react';
import { Radio as DefaultRadio } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const Radio = withStyles(({ colors }) => ({
  root: {
    color: colors.eggPlant,
    '&$checked': {
      color: colors.eggPlant
    }
  },
  checked: {} // must be defined to get styles above applied
}))((props) => <DefaultRadio color="default" {...props} />);

export default Radio;
