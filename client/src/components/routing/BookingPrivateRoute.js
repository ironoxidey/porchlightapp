import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Page from './Page';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const BookingPrivateRoute = ({
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
              user.role &&
              Array.isArray(user.role) &&
              (user.role.indexOf('BOOKING') > -1 ||
                  user.role.indexOf('ADMIN') > -1) ? (
                <Page title={title}>
                    <Component {...props} />
                </Page>
            ) : (
                <Redirect to="/dashboard" />
            )
        }
    />
);

BookingPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(BookingPrivateRoute);
