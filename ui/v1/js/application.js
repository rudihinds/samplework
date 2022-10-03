import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Analytics from 'react-router-ga';
import Main from './Main';
import { AppProviders } from './context';
import './i18n';

const Mirza = () => {
  const EmptyAnalytics = (props) => <React.Fragment>{props.children}</React.Fragment>;
  const analytics_id = document.querySelector('meta[name=mirza_google_analytics_id]')?.content;
  const AnalyticsContainer = analytics_id ? Analytics : EmptyAnalytics;
  return (
    <Router>
      <AnalyticsContainer id={analytics_id}>
        <AppProviders>
          <Main />
        </AppProviders>
      </AnalyticsContainer>
    </Router>
  );
};
ReactDOM.render(<Mirza />, document.getElementById('root'));
