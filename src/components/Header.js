import React, { useState } from 'react';
import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { makeStyles } from '@mui/styles'; // Use @mui/material/styles for newer versions
import { useNavigate } from 'react-router-dom';
import AuthModal from './Authentication/AuthModal';
import { CryptoState } from '../CryptoContext';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Assuming CryptoState returns an object with currency and setCurrency function
  const { currency, setCurrency, user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      mode: 'dark',
    },
  });

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    // Additional logic related to currency change can be handled here
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate('/')}
              className={classes.title}
              variant='h6'
            >
              Crypto-Pulse
            </Typography>
            <Select
              variant='outlined'
              style={{ width: 150, height: 40, marginRight: 15 }}
              value={currency}
              onChange={handleCurrencyChange}
              displayEmpty
            >
              <MenuItem value='' disabled>
                Select Currency
              </MenuItem>
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'INR'}>INR</MenuItem>
            </Select>
            {user ? <UserSidebar/> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
