import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import UserDataGrid from './UserDataGrid';

import { Autocomplete, TextField, Grid, Chip } from '@mui/material';

import Button from '../layout/SvgButton';

const EditUsers = ({ auth: { loading } }) => {
    return (
        <Fragment>
            {loading ? (
                <Spinner></Spinner>
            ) : (
                <Grid container sx={{ height: '500px' }}>
                    <UserDataGrid></UserDataGrid>
                </Grid>
            )}
        </Fragment>
    );
};

EditUsers.propTypes = {
    auth: PropTypes.object.isRequired,
    users: PropTypes.array,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    users: state.auth.users,
});

export default connect(mapStateToProps, {})(EditUsers);
