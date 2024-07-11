import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CryptoContext from './CryptoContext';
import { ThemeProvider } from '@mui/styles';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import 'react-alice-carousel/lib/alice-carousel.css';

let theme = createTheme();
theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
    <CryptoContext>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CryptoContext>
  </React.StrictMode>,
  document.getElementById('root')
);
