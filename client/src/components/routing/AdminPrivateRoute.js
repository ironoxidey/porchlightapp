import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Page from './Page';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminPrivateRoute = ({
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
              user.role.indexOf('ADMIN') === -1 ? (
                <Redirect to="/artists" />
            ) : (
                <Page title={title}>
                    <Component {...props} />
                </Page>
            )
        }
    />
);

AdminPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(AdminPrivateRoute);
