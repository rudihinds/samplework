import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';
import environment from './config/environment';
import App from './App';

Sentry.init({
  dsn:
    'https://8993f339934d43d88e2b06f278201925@o783524.ingest.sentry.io/5798840',
  integrations: [
    new Integrations.BrowserTracing(),
    new CaptureConsole({
      levels: ['error']
    })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: environment()
});

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
