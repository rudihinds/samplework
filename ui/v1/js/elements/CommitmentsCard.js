import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch, Link } from 'react-router-dom';
import Icon from './Icon';

const useStyles = makeStyles(
  (theme) => ({
    card: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr)',
      gridGap: 10,
      marginBottom: 86,
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        flexFlow: 'column-reverse',
        marginTop: 30
      }
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
      justifyContent: 'space-between',
      padding: '11px 0',
      color: theme.colors.limedSpruce,
      textDecoration: 'none'
    },
    noShrink: {
      flexShrink: 0
    },
    list: {
      listStyle: 'none',
      padding: 0
    }
  }),
  { name: 'CommitmentCard' }
);

const CommitmentsCard = (props) => {
  const { path } = useRouteMatch();
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div>
        <h3 className={classes.sectionTitle}>{props.title}</h3>
        <p className={classes.intro}>{props.children}</p>
        <ul className={classes.list}>
          {props.tasks &&
            Object.entries(props.tasks).map(([key, value]) => (
              <li key={key}>
                <Link className={classes.items} to={`${path}/tasks`}>
                  <span>{value}</span>
                  <Icon className={classes.noShrink} icon="frontarrow" width={15}></Icon>
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="ctr">{props.icon && <Icon icon={props.icon} width={250} fill={false}></Icon>}</div>
    </div>
  );
};

export default CommitmentsCard;
