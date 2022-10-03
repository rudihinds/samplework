import React from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import { useAuth } from '../context/auth';
import Icon from '../elements/Icon';
import navstyles from './navstyles';

const useStyles = makeStyles(
  ({ colors }) => ({
    desktopHeader: {
      ...navstyles.headerStyle
    },
    flexMenu: {
      ...navstyles.flexMenuStyle,
      justifyContent: 'start'
    },
    ul: {
      display: 'grid',
      gridGap: '20px',
      gridAutoFlow: 'column',
      listStyle: 'none',
      margin: 0,
      paddingRight: '10px',
      '& li': {
        display: 'block'
      }
    },
    desktopLogo: {
      ...navstyles.desktopLogoStyle
    },
    profileIcon: {
      color: colors.white
    },
    menuItem: {
      ...navstyles.menuItemStyle
    },
    creamPill: {
      ...navstyles.menuPillStyle
    },
    profileMenu: {
      ...navstyles.profileMenuStyle,
      marginLeft: 'auto'
    },
    iconLabel: {
      ...navstyles.iconLabelStyle
    },
    profileMenuItem: {
      ...navstyles.profileItemMenuStyle
    }
  }),
  { name: 'desktopNav' }
);

const DesktopNav = ({ routes, menuState, handleOpen, handleClose, logout }) => {
  const { user } = useAuth();
  const classes = useStyles();
  const history = useHistory();

  const handleNav = (ev) => {
    if (history.location.pathname === ev.currentTarget.pathname) ev.preventDefault();
  };

  return (
    <header className={classes.desktopHeader}>
      <div className={`${classes.flexMenu} wrap`}>
        <NavLink to="/" onClick={handleNav}>
          <div className={classes.desktopLogo}>
            <Icon icon="mirza-nav" width={98} />
          </div>
        </NavLink>
        <ul className={classes.ul}>
          {Object.entries(routes).map(([key, value]) => (
            <li key={key}>
              {!value.external ? (
                <NavLink
                  activeClassName={classes.creamPill}
                  className={classes.menuItem}
                  to={value.url}
                  onClick={handleNav}
                >
                  {key}
                </NavLink>
              ) : (
                <a className={classes.menuItem} href={value.url} target="_blank" rel="noreferrer">
                  {key}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className={classes.profileMenu}>
          <a
            href="/profile"
            data-sel="profile-menu"
            onClick={(ev) => {
              ev.preventDefault();
              handleOpen(ev);
            }}
            className={classes.desktopLogo}
          >
            <Icon className={classes.profileIcon} icon="profile" width={24} />
            <span className={classes.iconLabel}>{user.name}</span>
          </a>
          <Menu anchorEl={menuState} keepMounted open={Boolean(menuState)} onClose={handleClose}>
            <MenuItem
              id="profile"
              className={classes.profileMenuItem}
              component={NavLink}
              to="/profile"
              onClick={(ev) => {
                handleNav(ev);
                handleClose();
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              id="logout"
              className={classes.profileMenuItem}
              component={NavLink}
              to="/"
              onClick={(ev) => {
                ev.preventDefault();
                handleClose();
                logout(ev);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default DesktopNav;
