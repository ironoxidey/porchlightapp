import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SwipeableDrawer from './components/layout/SwipeableDrawer';
//import Landing from './components/layout/Landing';
import TheRoutes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import {
    createTheme,
    ThemeProvider,
    StyledEngineProvider,
    // adaptV4Theme,
} from '@mui/material/styles';

//Consider checking out material-ui and https://material-kit-pro-react.devias.io/
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faGlobeAmericas,
    faGuitar,
    faCalendarDay,
    faAllergies,
    faExternalLinkAlt,
    faBook,
} from '@fortawesome/free-solid-svg-icons';

import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey(
    'be0a5656909f29aa64a8bb425191b715Tz04NjcyNCxFPTE3NDI0MTg3NjEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

library.add(
    fab,
    faGlobeAmericas,
    faGuitar,
    faCalendarDay,
    faAllergies,
    faExternalLinkAlt,
    faBook
);

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
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={darkTheme}>
                    <Router>
                        <Fragment>
                            <Navbar />
                            <SwipeableDrawer className="porchlightBG" />
                            <TheRoutes />
                            {/* <Routes>
                                <Route component={TheRoutes} />
                            </Routes> */}
                        </Fragment>
                    </Router>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    );
};

export default App;
