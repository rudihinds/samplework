import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  () => ({
    internalWrap: {
      '&.wrap': {
        maxWidth: 780
      }
    },
    fullOnMobile: {
      '&.wrap': {
        padding: 0
      }
    }
  }),
  { name: 'CommitmentsWrap' }
);

const CommmitmentsWrap = ({ fullOnMobile, ...props }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();
  const className = classnames({
    wrap: true,
    [classes.internalWrap]: true,
    [classes.fullOnMobile]: fullOnMobile && !isDesktop
  });
  return (
    <div className={className} {...props}>
      {props.children}
    </div>
  );
};

CommmitmentsWrap.defaultProps = {
  fullOnMobile: false
};

export default CommmitmentsWrap;
