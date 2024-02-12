import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Page from './Page';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ArtistPrivateRoute = ({
    title,
    auth: { isAuthenticated, loading, user },
    children,
}) =>
    !isAuthenticated && !loading ? (
        <Navigate to="/login" />
    ) : // ) : user && user.role !== 'ADMIN' ? (
    user && Array.isArray(user.role) && user.role.indexOf('ARTIST') > -1 ? (
        <Page title={title}>{children}</Page>
    ) : (
        <Navigate to="/dashboard" />
    );

ArtistPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ArtistPrivateRoute);
