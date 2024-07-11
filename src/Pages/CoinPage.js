import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import { makeStyles } from '@mui/styles';
import CoinInfo from '../components/CoinInfo';
import { ThemeProvider } from '@mui/material/styles';
import { Button, createTheme, LinearProgress, responsiveFontSizes, Typography } from '@mui/material';
import axios from 'axios';
import HTMLReactParser from 'html-react-parser/lib/index';
import { numberWithCommas } from '../components/Banner/Carousel';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: '30%',
    padding: '1rem',
    borderRight: '1px solid grey',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 25,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  description: {
    width: '100%',
    fontFamily: 'Montserrat',
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: 'justify',
  },
  marketData: {
    alignSelf: 'start',
    padding: 25,
    paddingTop: 10,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: 'start',
    },
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', type: '' });

  const { currency, symbol, user, watchlist } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  useEffect(() => {
    fetchCoin();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let theme = createTheme();
  theme = responsiveFontSizes(theme);
  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid);
    try {
      await setDoc(coinRef, {
        coins: [...watchlist, coin?.id],
      }, { merge: true });
      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist!`,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to add to the watchlist!',
        type: 'error',
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist.filter((watch) => watch !== coin?.id),
      }, { merge: true });
      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist!`,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to remove from the watchlist!',
        type: 'error',
      });
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const classes = useStyles();
  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />;

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <div className={classes.sidebar}>
          {coin && (
            <>
              <img
                src={coin.image.large}
                alt={coin.name}
                height="200"
                style={{ marginBottom: 20 }}
              />
              <Typography variant="h3" className={classes.heading}>
                {coin.name}
              </Typography>
              <Typography variant="subtitle1" className={classes.description}>
                {HTMLReactParser(coin?.description.en.split('. ')[0])}
              </Typography>
              <div className={classes.marketData}>
                <span style={{ display: 'flex' }}>
                  <Typography variant="h5" className={classes.heading}>
                    Rank:
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'Montserrat',
                    }}
                  >
                    {coin?.market_cap_rank}
                  </Typography>
                </span>
                <span style={{ display: 'flex' }}>
                  <Typography variant="h5" className={classes.heading}>
                    Current Price:
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'Montserrat',
                    }}
                  >
                    {symbol}{' '}
                    {numberWithCommas(
                      coin?.market_data.current_price[currency.toLowerCase()]
                    )}
                  </Typography>
                </span>
                <span style={{ display: 'flex' }}>
                  <Typography variant="h5" className={classes.heading}>
                    Market Cap:{' '}
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'Montserrat',
                    }}
                  >
                    {symbol}{' '}
                    {numberWithCommas(
                      coin?.market_data.market_cap[currency.toLowerCase()]
                        .toString()
                        .slice(0, -6)
                    )}
                    M
                  </Typography>
                </span>
                {user && (
                  <Button
                    variant="outlined"
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: inWatchlist ? '#ff0000' : '#EEBC1D',
                      textDecoration: 'none',
                      color: 'black',
                    }}
                    onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
                  >
                    {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        {coin && <CoinInfo coin={coin} />}
      </div>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default CoinPage;
