import React from 'react';
import { AuthProvider } from './auth';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import colors from '../utils/colors';

const font = 'Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'; // eslint-disable-line
const fontTitle = '"SilkSerif-Bold", Cambria, "Hoefler Text", Utopia, "Liberation Serif", "Nimbus Roman No9 L Regular", Times, "Times New Roman", serif'; // eslint-disable-line

const defaultTheme = createMuiTheme({
  typography: {
    fontFamily: font
  },
  palette: {
    primary: {
      main: '#666'
    }
  },
  overrides: {
    MuiInputBase: {
      root: {
        '&.MuiFilledInput-underline:before': {
          borderBottomColor: colors.cloud
        }
      }
    }
  },
  colors: colors,
  // It would seem weird that keys with pixels are an anti-pattern, but
  // it helps on getting the values from Figma, while still setting in rems
  fontSize: {
    f12px: '0.75rem',
    f13px: '0.8125rem',
    f14px: '0.875rem',
    f15px: '0.9375rem',
    f18px: '1.125rem',
    f20px: '1.25rem',
    f24px: '1.5rem',
    f32px: '2rem'
  },
  fontBase: font,
  fontTitle
});

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SnackbarProvider preventDuplicate anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <AuthProvider>{children}</AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export { AppProviders };
