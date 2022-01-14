import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
//import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import { createTheme, ThemeProvider } from '@mui/material/styles';

//Consider checking out material-ui and https://material-kit-pro-react.devias.io/
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  spacing: 8,
});

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <Fragment>
            <Navbar />
            <Switch>
            {/* <Route exact path='/' component={Landing} /> */}
            <Route component={Routes} />
            </Switch>
          </Fragment>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
