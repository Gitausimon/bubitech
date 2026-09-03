import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

let theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#0A2540', // Dark Blue / Navy
      light: '#2d4b69',
      dark: '#000019',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00D4FF', // Cyan / Bright Light Blue
      light: '#6cffff',
      dark: '#00a2cc',
      contrastText: '#000000',
    },
    background: {
      default: '#F8F9FA', // Off-white/very light gray to contrast pure white cards
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#424242',
    },
  },
  shape: {
    borderRadius: 12, // More pronounced rounding for Material Expressive
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          backgroundColor: '#ffffff',
          color: '#0f172a',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
