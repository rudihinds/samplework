import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { useAuth } from '../../context/auth';

const useStyles = makeStyles(
  (theme) => ({
    container: {
      position: 'relative'
    },
    emptystateoverlay: {
      position: 'absolute',
      display: 'grid',
      zIndex: 10,
      width: '100%',
      height: '100%',
      placeItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      fontSize: theme.fontSize.f20px,
      color: theme.colors.eggPlant
    },
    blurred: {
      opacity: 0.5,
      filter: 'grayscale(60%)'
    }
  }),
  { name: 'PlanningGraphContainer' }
);

const PlanningGraphContainer = ({ isFirstTimeUser, children }) => {
  const { user } = useAuth();
  const classes = useStyles();
  // @todo: onboarding may make this obsolete ↓
  const isProfileComplete = Boolean(user.gender && user.birthdate && user.career_begin_age);
  const graphContainerClasses = classnames({
    [classes.blurred]: isFirstTimeUser || !isProfileComplete
  });

  return (
    <div className={classes.container}>
      {!isProfileComplete && (
        <div className={classes.emptystateoverlay} data-sel="graph-empty-incomplete-profile">
          <span>
            You must complete <Link to="/profile/edit">your profile information</Link>
          </span>
        </div>
      )}

      {isProfileComplete && isFirstTimeUser && (
        <div className={classes.emptystateoverlay} data-sel="graph-empty">
          <span>
            Set up the data on Income &<br />
            Expenses first
          </span>
        </div>
      )}
      <div className={graphContainerClasses} data-test="planning-graph">
        {children}
      </div>
    </div>
  );
};

export default PlanningGraphContainer;
