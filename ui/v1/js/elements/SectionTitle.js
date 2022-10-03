import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    default: {
      fontFamily: theme.fontTitle,
      fontSize: theme.fontSize.f32px
    },
    sansserifsmall: {
      fontFamily: theme.fontBase,
      fontSize: theme.fontSize.f20px
    }
  }),
  { name: 'SectionTitle' }
);

const SectionTitle = (props) => {
  const classes = useStyles();
  const className = classnames({
    [classes.default]: true,
    [classes.sansserifsmall]: props.variant === 'sansserif-small'
  });

  return <h2 className={className}>{props.children}</h2>;
};

SectionTitle.defaultProps = {
  variant: 'default'
};

export default SectionTitle;
