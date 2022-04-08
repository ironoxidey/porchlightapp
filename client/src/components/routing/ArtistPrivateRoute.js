import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Page from './Page';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ArtistPrivateRoute = ({
    component: Component,
    title,
    auth: { isAuthenticated, loading, user },
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) =>
            !isAuthenticated && !loading ? (
                <Redirect to="/login" />
            ) : // ) : user && user.role !== 'ADMIN' ? (
            user &&
              Array.isArray(user.role) &&
              user.role.indexOf('ARTIST') > -1 ? (
                <Page title={title}>
                    <Component {...props} />
                </Page>
            ) : (
                <Redirect to="/dashboard" />
            )
        }
    />
);

ArtistPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ArtistPrivateRoute);
