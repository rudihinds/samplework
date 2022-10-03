import React from 'react';

import { ThemeProvider } from 'styled-components';
import { theme } from 'twin.macro';
import PropTypes from 'prop-types';
import apolloClient from '@config/apollo';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './auth';

// Imports default Tailwind breakpoints into styled-breakpoints
// sm: "640px"
// md: "768px"
// lg: "1024px"
// xl: "1280px"
// 2xl: "1536px"

// console.log('from index, ', theme`screens`);

const breakpointsTheme = {
  breakpoints: theme`screens`
};

const Providers = ({ children }) => (
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={breakpointsTheme}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </ApolloProvider>
);

Providers.propTypes = {
  children: PropTypes.node.isRequired
};

export default Providers;
