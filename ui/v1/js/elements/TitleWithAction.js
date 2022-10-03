import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    grid: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 12
    },
    title: {
      fontWeight: 800,
      fontSize: '0.875rem',
      color: theme.colors.eggPlant,
      textTransform: 'uppercase'
    },
    flexMain: {
      flex: '100%'
    },
    flexTooltip: {
      marginRight: 5
    }
  }),
  { name: 'TitleWithAction' }
);

const TitleWithAction = (props) => {
  const classes = useStyles();
  const titleClasses = classnames('notitle', classes.title);

  return (
    <div className={classes.grid}>
      {props.titleTooltip && <div className={classes.flexTooltip}>{props.titleTooltip}</div>}
      <div className={classes.flexMain}>
        <h4 className={titleClasses}>{props.title}</h4>
      </div>
      <div>{props.action}</div>
    </div>
  );
};

export default TitleWithAction;
