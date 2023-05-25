import React, { useEffect } from 'react';
import { Route, Switch, useLocation, withRouter } from 'react-router-dom';
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

import { useTransition, animated, config, useSpring } from '@react-spring/web';

const Routes = ({ app }) => {
    const theLocation = useLocation();
    const transitions = useTransition(theLocation, {
        from: { opacity: 0, transform: 'scale(1.02)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.98)' },
        config: config.stiff,
    });

    const [scrollY, setY] = useSpring(() => ({
        scrollTop: 0,
        config: config.molasses,
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
                        <Switch location={location}>
                            <Route
                                exact
                                path="/"
                                render={(props) => (
                                    <Page>
                                        <Landing {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/register"
                                render={(props) => (
                                    <Page title="Register">
                                        <Register {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/reset-password"
                                render={(props) => (
                                    <Page title="Reset Password">
                                        <ResetPassword {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/forgot-password"
                                render={(props) => (
                                    <Page title="Forgot Password">
                                        <ForgotPassword {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/unsubscribe/:id"
                                render={(props) => (
                                    <Page title="Unsubscribe">
                                        <UnsubscribeHostDigest {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/login"
                                render={(props) => (
                                    <Page title="Login">
                                        <Login {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/profiles"
                                render={(props) => (
                                    <Page title="Profiles">
                                        <Profiles {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/artists"
                                render={(props) => (
                                    <Page title="Artists">
                                        <Artists {...props} />
                                    </Page>
                                )}
                            />
                            <Route
                                exact
                                path="/artists/:slug"
                                component={Artist}
                            />
                            <Route
                                exact
                                path="/profile/:id"
                                render={(props) => (
                                    <Page title="Profile">
                                        <Profile {...props} />
                                    </Page>
                                )}
                            />
                            <PrivateRoute
                                exact
                                path="/dashboard"
                                component={Dashboard}
                                title="Dashboard"
                            />
                            <PrivateRoute
                                exact
                                path="/create-profile"
                                component={CreateProfile}
                                title="Create Your Profile"
                            />
                            <BookingPrivateRoute
                                exact
                                path="/edit-events"
                                component={EventDataGrid}
                                title="Edit Events"
                            />
                            <BookingPrivateRoute
                                exact
                                path="/edit-hosts"
                                component={EditHostsMatrix}
                                title="Edit Hosts"
                            />
                            <ArtistPrivateRoute
                                exact
                                path="/edit-artist-profile"
                                component={EditMyArtistProfile}
                                title="Edit Your Artist Profile"
                            />
                            {/* <ArtistPrivateRoute
                                exact
                                path="/edit-artist-booking"
                                component={EditMyArtistBooking}
                                title="Edit Your Artist Booking Info"
                            /> */}
                            <PrivateRoute
                                exact
                                path="/edit-host-profile"
                                component={EditMyHostProfile}
                                title="Edit Your Host Profile"
                            />
                            {/* <PrivateRoute
                                exact
                                path="/edit-profile"
                                component={EditProfile}
                                title="Edit Your Page"
                            />

                            <PrivateRoute
                                exact
                                path="/add-experience"
                                component={AddExperience}
                                title="Add Experience"
                            />
                            <PrivateRoute
                                exact
                                path="/add-education"
                                component={AddEducation}
                                title="Add Education"
                            />
                            <PrivateRoute
                                exact
                                path="/posts"
                                component={Posts}
                                title="Posts"
                            />
                            <PrivateRoute
                                exact
                                path="/posts/:id"
                                component={Post}
                                title="A Post"
                            /> */}
                            <AdminPrivateRoute
                                exact
                                path="/edit-artists"
                                component={EditArtists}
                                title="Edit Artists"
                            />
                            <AdminPrivateRoute
                                exact
                                path="/edit-users"
                                component={EditUsers}
                                title="Edit Users"
                            />
                            <Route
                                render={(props) => (
                                    <Page title="Page Not Found">
                                        <NotFound {...props} />
                                    </Page>
                                )}
                            />
                        </Switch>
                    </animated.div>
                );
            })}
        </section>
    );
};

// export default Routes;

Routes.propTypes = {
    app: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    app: state.app,
});

export default connect(mapStateToProps)(withRouter(Routes)); //withRouter allows us to pass history objects
