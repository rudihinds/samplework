import React from 'react';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '../elements';
import classnames from 'classnames';

const useStyles = makeStyles(
  ({ colors, ...theme }) => ({
    panel: {
      backgroundColor: colors.white,
      borderRadius: 20,
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)'
    },
    roundBottom: {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0
    },
    padded: {
      padding: '40px 65px',
      [theme.breakpoints.down('xs')]: {
        paddingRight: 13,
        paddingLeft: 13
      }
    },
    hasNavAction: {
      paddingTop: 30
    },
    navAction: {
      display: 'inline-grid',
      gridTemplateColumns: 'minmax(0, 20px) 1fr',
      gridGap: 18,
      textDecoration: 'none',
      marginLeft: -38,
      padding: '10px 10px 10px 0',
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0
      }
    },
    hasBottomContent: {
      paddingBottom: 10
    },
    bottomContent: {
      color: colors.nevada,
      background: colors.blackhaze,
      marginTop: 20,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20
    }
  }),
  { name: 'ContentPanel' }
);

const ContentPanel = ({ mt, mb, navAction, bottomContent, ...props }) => {
  const showNavAction = Boolean(Object.values(navAction).length);
  if (showNavAction) navAction = { icon: 'backarrow', to: '/', ...navAction };
  const classes = useStyles();
  const boxClasses = classnames({
    [classes.panel]: true,
    [classes.roundBottom]: props.theme === 'round-bottom'
  });
  const containerClasses = classnames({
    [classes.padded]: true,
    [classes.hasNavAction]: showNavAction,
    [classes.hasBottomContent]: Boolean(bottomContent)
  });
  const bottomContentClasses = classnames(classes.bottomContent, classes.padded);

  return (
    <Box mt={mt} mb={mb} className={boxClasses}>
      <div className={containerClasses}>
        {showNavAction && (
          <Link to={navAction.to} className={classes.navAction}>
            <Icon icon={navAction.icon} />
            <span>{navAction.text}</span>
          </Link>
        )}
        {props.children}
      </div>
      {Boolean(bottomContent) && (
        <div className={bottomContentClasses}>
          <div>{bottomContent}</div>
        </div>
      )}
    </Box>
  );
};

ContentPanel.defaultProps = {
  mt: 0,
  mb: 0,
  navAction: {}
};

export default ContentPanel;
