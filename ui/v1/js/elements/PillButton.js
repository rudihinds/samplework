import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    min: {
      fontSize: '0.875rem'
    },
    subtleradius: {
      '&.pillbutton': {
        borderRadius: 5
      }
    },
    filledOff: {
      '&.pillbutton--off': {
        background: theme.colors.eggPlant,
        opacity: 0.3,
        color: theme.colors.white
      }
    }
  }),
  { name: 'PillButton' }
);

const PillButton = (props) => {
  const classes = useStyles();
  const className = classnames({
    pillbutton: true,
    clickable: true,
    'pillbutton--off': !props.buttonOn,
    [classes.min]: ['purpletoggle'].includes(props.theme),
    [classes.subtleradius]: ['purpletoggle'].includes(props.theme),
    [classes.filledOff]: ['purpletoggle'].includes(props.theme)
  });
  // Omit buttonOn from props
  const { buttonOn, ..._props } = props;

  return (
    <span {..._props} className={className}>
      {props.children}
    </span>
  );
};

export default PillButton;
