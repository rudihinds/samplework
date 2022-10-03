import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Commitments from './app/Commitments';
import Planning from './app/Planning';
import Profile from './app/Profile';
import NavBar from './layout/NavBar';

const App = withRouter(({ location }) => {
  return (
    <div id="app">
      <NavBar
        routes={{
          Blog: { external: true, url: 'https://www.heymirza.com/blog' },
          Commitments: { url: '/commitments' },
          Planning: { url: '/planning' }
        }}
      />
      <div id="mirza-main" className="flex">
        <SwitchTransition className="flex">
          <CSSTransition key={location.key || 'App'} timeout={100} classNames="slide">
            <Switch location={location}>
              <Route exact path="/">
                <Redirect to="/planning" />
              </Route>
              <Route path="/commitments">
                <Commitments />
              </Route>
              <Route path="/planning">
                <Planning />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <footer id="mirza-footer">
        <div className="wrap"></div>
      </footer>
    </div>
  );
});

export default App;
