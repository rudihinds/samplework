import React from 'react';
import { Checkbox as DefaultCheckbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const Checkbox = withStyles(({ colors }) => ({
  root: {
    color: colors.capecod,
    '&$checked': {
      color: colors.capecod
    }
  },
  checked: {} // must be defined to get styles above applied
}))((props) => <DefaultCheckbox color="default" {...props} />);

export default Checkbox;
