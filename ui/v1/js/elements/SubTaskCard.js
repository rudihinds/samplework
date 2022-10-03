import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from './Icon';

const useStyles = makeStyles(
  (theme) => ({
    card: {
      maxWidth: 480,
      marginBottom: 86
    },
    sectionTitle: {
      fontWeight: 900,
      fontSize: theme.fontSize.f24px,
      fontFamily: theme.fontBase
    },
    intro: {
      color: theme.colors.nevada
    },
    items: {
      display: 'flex',
      justifyContent: 'flex-start',
      margin: '21px 0',
      color: theme.colors.limedSpruce
    },
    noShrink: {
      flexShrink: 0,
      marginRight: '18px'
    },
    list: {
      listStyle: 'none',
      padding: 0
    }
  }),
  { name: 'SubTaskCard' }
);

const SubTaskCard = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div>
        <h3 className={classes.sectionTitle}>{props.title}</h3>
        <p className={classes.intro}>{props.children}</p>
        <ul className={classes.list}>
          {props.subtasks &&
            Object.entries(props.subtasks).map(([key, value]) => (
              <li className={classes.items} key={key}>
                <Icon className={classes.noShrink} icon="checkbox-checked" width={15}></Icon>
                <span>{value}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SubTaskCard;
