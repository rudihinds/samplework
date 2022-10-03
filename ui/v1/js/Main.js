import { hot } from 'react-hot-loader/root'; // Needs to be before react
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import App from './App';
import AuthApp from './AuthApp';
import OnboardingApp from './OnboardingApp';
import CookieDisclaimer from './layout/CookieDisclaimer';
import { useAuth } from './context/auth';

import NProgress from 'nprogress';

const Main = () => {
  const { isLoggedIn, isOnboardingUser } = useAuth();
  const renderRoutes = () => {
    if (!isLoggedIn) return <AuthApp />;
    if (isOnboardingUser) return <OnboardingApp />;

    // Replaced <App /> with NProgress and hard refresh into V2
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    NProgress.set(0.2);

    window.location.href = '/';
    return <div></div>;
    // return <App />;
  };

  const location = useLocation();
  useEffect(() => {
    /* global gtag */
    if (typeof gtag === 'function') gtag('event', 'page_view', { page_location: location.pathname });
  }, [location]);

  return (
    <>
      <SwitchTransition>
        <CSSTransition timeout={100} classNames="slide" key={`${isLoggedIn}-${isOnboardingUser}`}>
          {renderRoutes()}
        </CSSTransition>
      </SwitchTransition>
      <CookieDisclaimer />
    </>
  );
};

export default hot(Main);
