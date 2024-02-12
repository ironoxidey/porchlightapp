import React, { useEffect } from 'react';
import {
    Route,
    Routes,
    useLocation,
    // withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Page from './Page';
import Landing from '../layout/Landing';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-forms/CreateProfile';
// import EditProfile from '../profile-forms/EditProfile';
// import AddExperience from '../profile-forms/AddExperience';
// import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Artists from '../artists/Artists';
import Artist from '../artists/Artist';
import EditArtists from '../artists/EditArtists';
import EditUsers from '../users/EditUsers';
import EditMyArtistProfile from '../artists/EditMyArtistProfile';
// import EditMyArtistBooking from '../artists/EditMyArtistBooking';
import EditMyHostProfile from '../hosts/EditMyHostProfile';
import UnsubscribeHostDigest from '../hosts/UnsubscribeHostDigest';
// import Posts from '../posts/Posts';
// import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import AdminPrivateRoute from '../routing/AdminPrivateRoute';
import BookingPrivateRoute from '../routing/BookingPrivateRoute';
import ArtistPrivateRoute from '../routing/ArtistPrivateRoute';
import ResetPassword from '../auth/ResetPassword';
import ForgotPassword from '../auth/ForgotPassword';
import EventDataGrid from '../events/EventDataGrid';
import EditHostsMatrix from '../hosts/EditHostsMatrix';
import HostDeclinesFromEmailDigest from '../events/HostDeclinesFromEmailDigest';

import { useTransition, animated, config, useSpring } from '@react-spring/web';

const TheRoutes = ({ app }) => {
    const theLocation = useLocation();
    const transitions = useTransition(theLocation, {
        from: { opacity: 0, transform: 'scale(1.02)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.98)' },
        config: config.stiff,
    });

    const [scrollY, setY] = useSpring(() => ({
        scrollTop: 0,
        // config: config.molasses,
        config: { mass: 2, tension: 280, friction: 60 },
    }));

    useEffect(() => {
        document.title = app.pageTitle;

        document.getElementById('root').scrollTop = scrollY;
        setY({
            onFrame: (props) =>
                document.getElementById('root').scroll(0, props.scrollTop),
        }); //scroll to the top if the page title changes
    }, [app.pageTitle]);

    return (
        <section className="container">
            {transitions((style, location) => {
                return (
                    <animated.div style={style} className="animatedRoute">
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={
                                    <Page>
                                        <Landing />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/register"
                                element={
                                    <Page title="Register">
                                        <Register />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/reset-password"
                                element={
                                    <Page title="Reset Password">
                                        <ResetPassword />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/forgot-password"
                                element={
                                    <Page title="Forgot Password">
                                        <ForgotPassword />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/unsubscribe/:id"
                                element={
                                    <Page title="Unsubscribe">
                                        <UnsubscribeHostDigest />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/decline/:id"
                                element={
                                    <Page title="Decline Event">
                                        <HostDeclinesFromEmailDigest />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/login"
                                element={
                                    <Page title="Login">
                                        <Login />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/profiles"
                                element={
                                    <Page title="Profiles">
                                        <Profiles />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/artists"
                                element={
                                    <Page title="Artists">
                                        <Artists />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/artists/:slug"
                                component={Artist}
                            />
                            <Route
                                exact
                                path="/profile/:id"
                                element={
                                    <Page title="Profile">
                                        <Profile />
                                    </Page>
                                }
                            />
                            <Route
                                exact
                                path="/dashboard"
                                element={
                                    <PrivateRoute title="Dashboard">
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/create-profile"
                                element={
                                    <PrivateRoute title="Create Your Profile">
                                        <CreateProfile />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/edit-events"
                                element={
                                    <BookingPrivateRoute title="Edit Events">
                                        <EventDataGrid />
                                    </BookingPrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/edit-hosts"
                                element={
                                    <BookingPrivateRoute title="Edit Hosts">
                                        <EditHostsMatrix />
                                    </BookingPrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/edit-artist-profile"
                                element={
                                    <ArtistPrivateRoute title="Edit Your Artist Profile">
                                        <EditMyArtistProfile />
                                    </ArtistPrivateRoute>
                                }
                            />

                            <Route
                                exact
                                path="/edit-host-profile"
                                element={
                                    <PrivateRoute title="Edit Your Host Profile">
                                        <EditMyHostProfile />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/edit-artists"
                                element={
                                    <AdminPrivateRoute title="Edit Artists">
                                        <EditArtists />
                                    </AdminPrivateRoute>
                                }
                            />
                            <Route
                                exact
                                path="/edit-users"
                                element={
                                    <AdminPrivateRoute title="Edit Users">
                                        <EditUsers />
                                    </AdminPrivateRoute>
                                }
                            />
                            <Route
                                element={
                                    <Page title="Page Not Found">
                                        <NotFound />
                                    </Page>
                                }
                            />
                        </Routes>
                    </animated.div>
                );
            })}
        </section>
    );
};

// export default TheRoutes;

TheRoutes.propTypes = {
    app: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    app: state.app,
});

// export default connect(mapStateToProps)(withRouter(TheRoutes)); //withRouter allows us to pass history objects
export default connect(mapStateToProps)(TheRoutes); //withRouter allows us to pass history objects
