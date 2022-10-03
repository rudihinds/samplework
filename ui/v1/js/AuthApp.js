import React from 'react';
import { Switch, Route, Redirect, Link, withRouter } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useAuth } from './context/auth';
import Signup from './auth/Signup';
import Login from './auth/Login';
import AuthHeader from './auth/AuthHeader';
import AuthPanel from './auth/AuthPanel';
import PasswordRecovery from './auth/PasswordRecovery';
import PasswordReset from './auth/PasswordReset';

const AuthApp = withRouter(({ location }) => {
  const { hasUserPreviouslyLoggedin } = useAuth();

  return (
    <div id="app">
      <AuthHeader />
      <div id="mirza-main" className="flex">
        <SwitchTransition>
          <CSSTransition key={location.key || 'AuthApp'} timeout={150} classNames="slide">
            <Switch location={location}>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/login">
                <AuthPanel
                  title="Account Log In"
                  afterForm={
                    <p>
                      I don&apos;t have an account:{' '}
                      <Link to="/signup">
                        <strong>Sign up</strong>
                      </Link>
                    </p>
                  }
                >
                  <Login />
                </AuthPanel>
              </Route>
              <Route path="/password/forgot">
                <PasswordRecovery />
              </Route>
              <Route path="/password/reset/:token">
                <AuthPanel title="Enter your new password">
                  <PasswordReset />
                </AuthPanel>
              </Route>
              <Route>
                <Redirect to={hasUserPreviouslyLoggedin ? '/login' : '/signup'} />
              </Route>
            </Switch>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
});

export default AuthApp;
