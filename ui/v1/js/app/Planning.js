import React from 'react';
import { Switch, Route, useRouteMatch, withRouter } from 'react-router-dom';
// import PlanningIntro from './planning/PlanningIntro'
import PlanningUI from './planning/PlanningUI';

const Planning = withRouter(({ location }) => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact>
        {/* <PlanningIntro/> */}
        <PlanningUI />
      </Route>
      <Route path={`${path}/setup`}>
        <PlanningUI />
      </Route>
    </Switch>
  );
});

export default Planning;
