import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Page from './Page';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
    // component: Component,
    title,
    auth: { isAuthenticated, loading },
    children,
}) =>
    !isAuthenticated && !loading ? (
        <Navigate to="/login" />
    ) : (
        <Page title={title}>
            {children}
            {/* <Component /> */}
        </Page>
    );

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
