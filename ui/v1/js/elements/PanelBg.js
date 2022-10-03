import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    container: {
      background: theme.colors.white,
      borderRadius: 20,
      padding: 40,
      boxSizing: 'border-box',
      marginBottom: 20,
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      color: theme.colors.nevada,
      fontSize: '1.25rem'
    }
  }),
  { name: 'PanelBg' }
);

const PanelBg = (props) => {
  const classes = useStyles();
  const className = classnames({
    [props.className]: true,
    [classes.container]: true
  });
  const titleClassName = classnames({
    [classes.title]: true,
    notitle: true
  });

  return (
    <div className={className}>
      {props.title && <h3 className={titleClassName}>{props.title}</h3>}
      {props.children}
    </div>
  );
};

export default PanelBg;
