import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '@styles/GlobalStyles';
import { theme } from 'twin.macro';
import '@styles/App.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};


const breakpointsTheme = {
  breakpoints: theme`screens`
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={breakpointsTheme}>
      <GlobalStyles />
      <Story />
    </ThemeProvider>
  )
];

