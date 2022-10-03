import React from 'react';
import { Select as DefaultSelect } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const OutlinedMiniSelect = withStyles(({ colors, fontSize }) => ({
  root: {
    fontSize: fontSize.f13px,
    color: colors.nevada,
    '&$select': {
      paddingTop: 9,
      paddingBottom: 9,
      background: colors.concrete
    },
    '&$outlined': {
      border: 0,
      borderColor: 'transparent'
    }
  },
  select: {}, // Requires to be defined to be applied
  outlined: {} // Requires to be defined to be applied
}))((props) => <DefaultSelect {...props} />);

export default OutlinedMiniSelect;
