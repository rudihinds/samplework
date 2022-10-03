import React from 'react';
import { Select as DefaultSelect } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const FilledSelect = withStyles(({ colors, fontBase }) => ({
  root: {
    '&$select': {
      background: colors.white,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    }
  },
  select: {} // Requires to be defined to be applied
}))((props) => <DefaultSelect {...props} />);

export default FilledSelect;
