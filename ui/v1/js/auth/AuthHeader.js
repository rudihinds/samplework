import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '../elements';

const useStyles = makeStyles(
  () => {
    return {
      header: {
        margin: '27px 0'
      }
    };
  },
  { name: 'AuthHeader' }
);

const AuthHeader = () => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <div className="wrap ctr">
        <Icon icon="mirza-logo" width={118} />
      </div>
    </header>
  );
};

export default AuthHeader;
