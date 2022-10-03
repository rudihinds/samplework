import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAuth } from '../context/auth';
import DesktopNav from './DesktopNavBar';
import MobileNav from './MobileNavBar';

const NavBar = ({ routes }) => {
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const NavComponent = matches ? DesktopNav : MobileNav;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async (ev) => {
    try {
      ev.preventDefault();
      if (!confirm('Are you sure you want to log out of this account?')) return;
      const response = await logout();
      if (response.status === 200) {
        enqueueSnackbar('Your session was closed');
        history.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <NavComponent
        menuState={menuOpen}
        handleClose={handleClose}
        handleOpen={handleOpen}
        logout={handleLogout}
        routes={routes}
      />
    </div>
  );
};

export default NavBar;
