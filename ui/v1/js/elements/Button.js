import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button as MUIButton } from '@material-ui/core';
import classnames from 'classnames';

const styles = (theme) => ({
  root: {
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: theme.colors.purple,
    color: theme.colors.white,
    border: 0,
    minWidth: 110,
    textTransform: 'none',
    '&:hover': {
      background: theme.colors.purple,
      color: theme.colors.white
    },
    '&$disabled': {
      background: theme.colors.purpleLight,
      color: theme.colors.white
    },
    '&.MuiButton-text': {
      padding: '2px 6px'
    }
  },
  pillbutton: {
    display: 'inline-block',
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: '5px 10px',
    border: '1px solid transparent',
    borderRadius: 20,
    paddingRight: 11,
    paddingReft: 11,
    whiteSpace: 'nowrap'
  },
  save: {
    background: theme.colors.deyork,
    color: theme.colors.white,
    '&:hover': {
      background: theme.colors.deyork,
      color: theme.colors.white
    }
  },
  hollow: {
    background: 'transparent',
    border: `1px solid ${theme.colors.purple}`,
    color: theme.colors.purple,
    '&:hover': {
      background: 'transparent',
      color: theme.colors.purple
    }
  },
  upcase: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  disabled: {} // Must be set
});

const Button = ({ classes, ...props }) => {
  const className = classnames({
    [classes.root]: true,
    [classes.disabled]: props.disabled,
    [classes.pillbutton]: true,
    [classes.save]: ['save'].includes(props.theme),
    [classes.hollow]: ['hollow'].includes(props.theme),
    [classes.upcase]: ['hollow', 'save'].includes(props.theme)
  });
  return (
    <MUIButton className={className} {...props}>
      {props.children}
    </MUIButton>
  );
};

Button.defaultProps = {
  type: 'submit'
};

export default withStyles(styles)(Button);
