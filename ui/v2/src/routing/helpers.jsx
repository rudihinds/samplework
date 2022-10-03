import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';

/* eslint-disable react/jsx-props-no-spreading */
export function RouteWithSubRoutes({ path, exact, routes, component }) {
  const Component = component;
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <Component {...props} routes={routes} />
      )}
    />
  );
}

RouteWithSubRoutes.defaultProps = {
  exact: false,
  routes: []
};

RouteWithSubRoutes.propTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  exact: PropTypes.bool,
  routes: PropTypes.arrayOf(PropTypes.shape({})),
  component: PropTypes.elementType.isRequired
};

export function RenderRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route) => (
        <RouteWithSubRoutes key={route.key} {...route} />
      ))}
      <Route component={() => <h1>Not found!</h1>} />
    </Switch>
  );
}

RenderRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
