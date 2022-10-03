import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core';
import Button from '../elements/Button';

const useStyles = makeStyles(({ colors }) => ({
  cookieSnack: {
    '& .MuiPaper-root': {
      backgroundColor: '#F7F7F8',
      color: colors.black
    }
  },
  noCookieOption: {
    color: colors.tawnyport,
    textDecoration: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      color: colors.tawnyport
    }
  },
  container: {
    display: 'grid',
    gridGap: '.5rem',
    alignItems: 'center',
    gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)'
  }
}));

const CookieDisclaimer = () => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const action = (key) => (
    <div data-sel="cookie-banner" className={classes.container}>
      <Button data-sel="accept-cookies" onClick={userPrefersCookie}>
        Accept and Continue
      </Button>
      <a href="/" className={classes.noCookieOption} onClick={userNoCookiePref}>
        No
      </a>
    </div>
  );

  useEffect(() => {
    const skip_cookies_disclaimer = Boolean(document.querySelector('meta[name=mirza_skip_cookie_disclaimer]'));
    if (!localStorage.getItem('user_cookie_consent') && !skip_cookies_disclaimer) {
      enqueueSnackbar(
        'Mirza uses cookies to help us understand how you use the site and give you the best online experience  ',
        {
          persist: true,
          action: action,
          className: classes.cookieSnack
        }
      );
    }
  }, []);

  const userNoCookiePref = (e) => {
    e.preventDefault();
    alert('We will redirect you to a site where you can see how to disable cookies in your browser.');
    window.location = 'https://proprivacy.com/ruinmysearchhistory/how-to-block-cookies';
    closeSnackbar();
  };

  const userPrefersCookie = (e) => {
    e.preventDefault();
    saveUserCookiePreference(true);
    closeSnackbar();
  };

  const saveUserCookiePreference = (consent) => {
    localStorage.setItem('user_cookie_consent', consent);
  };
  return null;
};

export default CookieDisclaimer;
