import React from 'react';
import { Slider as DefaultSlider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const Slider = withStyles(({ colors }) => ({
  root: {
    color: colors.eggPlant,
    '& $valueLabel': {
      maxWidth: 'unset'
    }
  },
  valueLabel: {} // must be defined to get styles above applied
}))((props) => <DefaultSlider {...props} />);

export default Slider;
