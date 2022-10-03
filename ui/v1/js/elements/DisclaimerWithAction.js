import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ colors, ...theme }) => ({
    main: {
      color: colors.white,
      backgroundColor: colors.capecod,
      borderRadius: 8,
      display: 'grid',
      gridTemplateColumns: '1fr minmax(0, 150px)',
      gridGap: 15,
      padding: '10px 15px',
      [theme.breakpoints.down('xs')]: {
        display: 'block'
      }
    },
    padded: {
      padding: '10px 0'
    },
    actionColumn: {
      display: 'flex',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
      borderLeft: `1px solid ${colors.dustStorm}`,
      [theme.breakpoints.down('xs')]: {
        borderLeft: 0,
        paddingLeft: 0
      }
    }
  }),
  { name: 'DisclaimerWithAction' }
);

const DisclaimerWithAction = (props) => {
  const classes = useStyles();
  const { mt, mb } = props;

  return (
    <Box mt={mt} mb={mb} className={classes.main} data-sel="commitments-disclaimer">
      <div className={classes.padded}>{props.children}</div>
      <div className={classes.actionColumn}>
        <div>{props.action}</div>
      </div>
    </Box>
  );
};

DisclaimerWithAction.defaultProps = {
  mt: 0,
  mb: 0
};

export default DisclaimerWithAction;
