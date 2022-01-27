import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SwipeableDrawer from './components/layout/SwipeableDrawer';
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

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
library.add(fab, faGlobeAmericas);

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#6f8785',
		},
		secondary: {
			main: '#fb9c4d',
		},
	},
	typography: {
		fontFamily: 'Merriweather',
	},
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
						<SwipeableDrawer />
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
