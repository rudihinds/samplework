import { useAuth } from '@contexts/auth';
import React from 'react';
import { Redirect } from 'react-router-dom';

import 'twin.macro';

import NProgress from 'nprogress';

window.addEventListener('beforeunload', () => {
  NProgress.done();
});

const LoginRedirect = () => {
  NProgress.configure({ showSpinner: false });
  NProgress.start();
  NProgress.set(0.2);

  const { isLoggedIn, isOnboardingUser } = useAuth();

  if (!isLoggedIn) {
    window.location.href = '/login';
    return <div />;
  }

  if (isOnboardingUser) {
    window.location.href = '/intro/welcome';
    return <div />;
  }

  return <Redirect to="/dashboard" />;
};

export default LoginRedirect;
