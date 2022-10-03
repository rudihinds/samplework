import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';
// import { AnimatePresence } from 'framer-motion';
import Providers from '@contexts/Providers';

import GlobalStyles from '@styles/GlobalStyles';
import ROUTES from '@routing/routes';
import { RenderRoutes } from '@routing/helpers';

import '@styles/App.scss';

smoothscroll.polyfill();

// Removed AnimatePresence for now as it's causing issues with rendering routes
// <AnimatePresence initial={false}></AnimatePresence>

const App = () => (
  <Providers>
    <GlobalStyles />
    <Router>
      <RenderRoutes routes={ROUTES} />
    </Router>
  </Providers>
);

export default App;
