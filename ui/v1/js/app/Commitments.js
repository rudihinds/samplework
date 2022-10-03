import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import AddCommitments from './commitments/AddCommitments';
import CommitmentView from './commitments/CommitmentsView';
import CommitmentsIntro from './commitments/CommitmentsIntro';

const Commitments = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <CommitmentsIntro />
      </Route>
      <Route exact path={`${path}/add`}>
        <AddCommitments />
      </Route>
      <Route exact path={`${path}/add/tasks`}>
        <CommitmentView />
      </Route>
    </Switch>
  );
};

export default Commitments;
