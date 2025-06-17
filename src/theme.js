import { createTheme } from '@mui/material/styles';

// Custom theme based on the new color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#c03115',
      dark: '#881c04',
      light: '#d77620',
    },
    secondary: {
      main: '#fbc21f',
      dark: '#dcb60d',
      light: '#fbca48',
    },
    accent: {
      main: '#f29b37',
      dark: '#a46404',
      light: '#fbdc30',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      highlight: '#fbf8e6',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#fbc21f',
    },
    info: {
      main: '#17a2b8',
    },
    success: {
      main: '#28a745',
    },
  },
  typography: {
    fontFamily: '"Spoof", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#c03115',
          '&:hover': {
            backgroundColor: '#881c04',
          },
        },
        outlinedPrimary: {
          borderColor: '#c03115',
          color: '#c03115',
          '&:hover': {
            backgroundColor: 'rgba(192, 49, 21, 0.04)',
          },
        },
      },
    },
  },
});

// Bootstrap custom variables
const bootstrapCustomStyles = `
  :root {
    --bs-primary: #c03115;
    --bs-primary-rgb: 192, 49, 21;
    --bs-primary-bg-subtle: #fbc960;
    --bs-primary-border-subtle: #d77620;
    --bs-secondary: #fbc21f;
    --bs-secondary-rgb: 251, 194, 31;
    --bs-secondary-bg-subtle: #fbf8e6;
    --bs-secondary-border-subtle: #fbca48;
    --bs-success: #28a745;
    --bs-success-rgb: 40, 167, 69;
    --bs-info: #17a2b8;
    --bs-info-rgb: 23, 162, 184;
    --bs-warning: #fbc21f;
    --bs-warning-rgb: 251, 194, 31;
    --bs-danger: #dc3545;
    --bs-danger-rgb: 220, 53, 69;
    --bs-light: #f8f9fa;
    --bs-light-rgb: 248, 249, 250;
    --bs-dark: #333333;
    --bs-dark-rgb: 51, 51, 51;
  }

  .btn-primary {
    --bs-btn-color: #fff;
    --bs-btn-bg: #c03115;
    --bs-btn-border-color: #c03115;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #881c04;
    --bs-btn-hover-border-color: #881c04;
    --bs-btn-focus-shadow-rgb: 192, 49, 21;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #881c04;
    --bs-btn-active-border-color: #881c04;
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #c03115;
    --bs-btn-disabled-border-color: #c03115;
  }

  .btn-outline-primary {
    --bs-btn-color: #c03115;
    --bs-btn-border-color: #c03115;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #c03115;
    --bs-btn-hover-border-color: #c03115;
    --bs-btn-focus-shadow-rgb: 192, 49, 21;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #c03115;
    --bs-btn-active-border-color: #c03115;
    --bs-btn-disabled-color: #c03115;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #c03115;
  }

  .btn-secondary {
    --bs-btn-color: #333;
    --bs-btn-bg: #fbc21f;
    --bs-btn-border-color: #fbc21f;
    --bs-btn-hover-color: #333;
    --bs-btn-hover-bg: #dcb60d;
    --bs-btn-hover-border-color: #dcb60d;
    --bs-btn-focus-shadow-rgb: 251, 194, 31;
    --bs-btn-active-color: #333;
    --bs-btn-active-bg: #dcb60d;
    --bs-btn-active-border-color: #dcb60d;
    --bs-btn-disabled-color: #333;
    --bs-btn-disabled-bg: #fbc21f;
    --bs-btn-disabled-border-color: #fbc21f;
  }
`;

// Create a style element to inject Bootstrap overrides
const injectBootstrapOverrides = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = bootstrapCustomStyles;
  document.head.appendChild(styleElement);
};

export { theme, injectBootstrapOverrides }; 