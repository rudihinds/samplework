import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button as MUIButton } from '@material-ui/core';
import Icon from '../elements/Icon';
import classnames from 'classnames';

const styles = (theme) => ({
  root: {
    boxSizing: 'border-box',
    background: theme.colors.purple,
    color: theme.colors.white,
    border: 0,
    textTransform: 'none',
    '&:hover': {
      background: theme.colors.purple,
      color: theme.colors.white
    },
    '&$disabled': {
      background: theme.colors.purpleLight,
      color: theme.colors.white
    },
    '&.MuiButton-text': {}
  },
  secondary: {
    background: theme.colors.white,
    color: theme.colors.tawnyport,
    border: '1px solid',
    borderColor: theme.colors.tawnyport
  },
  square: {
    borderRadius: 4
  },
  disclaimerAction: {
    backgroundColor: theme.colors.limedSpruce,
    border: '1px solid',
    borderColor: theme.colors.dustStorm,
    fontWeight: 900,
    padding: '3px 20px',
    '&:hover': {
      background: theme.colors.limedSpruce,
      color: theme.colors.white
    }
  },
  ghost: {
    background: 'transparent'
  },
  contrast: {
    background: theme.colors.capecod,
    '&:hover': {
      background: theme.colors.capecod
    }
  },
  bigPadding: {
    padding: '13px 20px'
  },
  disabled: {}
});

const SquareButton = ({ classes, size, ghost, ...props }) => {
  const className = classnames({
    [classes.root]: true,
    [classes.disabled]: props.disabled,
    [classes.square]: true,
    [classes.disclaimerAction]: ['disclaimer-action'].includes(props.theme),
    [classes.secondary]: ['secondary'].includes(props.theme),
    [classes.ghost]: ghost,
    [classes.bigPadding]: ['bigpadding'].includes(size),
    [classes.contrast]: ['contrast'].includes(props.theme)
  });
  return (
    <MUIButton startIcon={props.icon && <Icon icon={props.icon} width={13}></Icon>} className={className} {...props}>
      {props.children}
    </MUIButton>
  );
};

SquareButton.defaultProps = {
  type: 'submit',
  ghost: false
};

export default withStyles(styles)(SquareButton);
