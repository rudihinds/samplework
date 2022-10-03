import React from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import Icon from '../elements/Icon';
import navstyles from './navstyles';

const useStyles = makeStyles(
  ({ colors }) => ({
    desktopHeader: {
      ...navstyles.headerStyle
    },
    ul: {
      display: 'grid',
      gridGap: '10px',
      gridAutoFlow: 'row',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      position: 'absolute',
      width: '100%',
      background: colors.limedSpruce,
      textAlign: 'center',
      zIndex: 900,
      '& li': {
        margin: '.30rem auto'
      }
    },
    flexMenu: {
      ...navstyles.flexMenuStyle
    },
    desktopLogo: {
      ...navstyles.desktopLogoStyle
    },
    menuItem: {
      ...navstyles.menuItemStyle
    },
    creamPill: {
      ...navstyles.menuPillStyle
    },
    profileMenu: {
      ...navstyles.profileMenuStyle
    },
    iconLabel: {
      ...navstyles.iconLabelStyle
    },
    profileMenuItem: {
      ...navstyles.profileItemMenuStyle
    },
    mobileMenu: {
      backgroundColor: colors.limedSpruce,
      width: '100%'
    }
  }),
  { name: 'mobileNav' }
);

const MobileNav = ({ routes, menuState, handleOpen, handleClose, logout }) => {
  const classes = useStyles();
  const history = useHistory();
  const [mainMenuOpen, setMainMenuOpen] = React.useState(null);

  const handleNav = (ev) => {
    if (history.location.pathname === ev.currentTarget.pathname) ev.preventDefault();
  };

  const handleMainMenu = () => {
    setMainMenuOpen(!mainMenuOpen);
  };

  return (
    <header className={classes.desktopHeader}>
      <div className={classes.flexMenu}>
        <div onClick={handleMainMenu} className={classes.desktopLogo} data-sel="burger-menu">
          {mainMenuOpen ? <Icon icon="cross" width={24} /> : <Icon icon="burger" width={24} />}
        </div>
        <NavLink to="/" onClick={(handleNav, handleMainMenu)}>
          <div className={classes.desktopLogo}>
            <Icon icon="mirza-nav" width={98} />
          </div>
        </NavLink>
        <div className={classes.profileMenu}>
          <div onClick={handleOpen} className={classes.desktopLogo} data-sel="profile-menu">
            <Icon icon="profile" width={24} />
          </div>
          <Menu id="profile-menu" anchorEl={menuState} keepMounted open={Boolean(menuState)} onClose={handleClose}>
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
                handleClose();
                logout(ev);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      {mainMenuOpen ? (
        <ul className={classes.ul}>
          {Object.entries(routes).map(([key, value]) => (
            <li key={key}>
              {!value.external ? (
                <NavLink
                  className={classes.menuItem}
                  activeClassName={classes.creamPill}
                  to={value.url}
                  onClick={(handleNav, handleMainMenu)}
                  ripple="false"
                >
                  {key}
                </NavLink>
              ) : (
                <a
                  className={classes.menuItem}
                  href={value.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleMainMenu}
                >
                  {key}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </header>
  );
};

export default MobileNav;
