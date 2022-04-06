import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import UserDataGrid from './UserDataGrid';

import { Autocomplete, TextField, Grid, Chip } from '@mui/material';

import { generateReferral } from '../../actions/auth';

import Button from '../layout/SvgButton';

const EditUsers = ({ auth: { loading, referralLink }, generateReferral }) => {
    return (
        <Fragment>
            {loading ? (
                <Spinner></Spinner>
            ) : (
                <Grid container direction="column" sx={{ height: '88vh' }}>
                    <UserDataGrid></UserDataGrid>
                    <Grid
                        container
                        justifyContent="center"
                        sx={{ marginTop: '10px' }}
                    >
                        <Button
                            btnwidth="320"
                            onClick={(e) => {
                                generateReferral();
                            }}
                        >
                            Generate Artist Referral Link
                        </Button>
                        {referralLink && referralLink.link ? (
                            <TextField
                                variant="standard"
                                disabled
                                multiline
                                name="referralLink"
                                id="referralLink"
                                label="Send this link to someone you want to invite to be an ARTIST:"
                                value={referralLink.link}
                                sx={{ width: '100%', margin: '20px' }}
                            />
                        ) : (
                            ''
                        )}
                    </Grid>
                </Grid>
            )}
        </Fragment>
    );
};

EditUsers.propTypes = {
    auth: PropTypes.object.isRequired,
    users: PropTypes.array,
    generateReferral: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    users: state.auth.users,
});

export default connect(mapStateToProps, { generateReferral })(EditUsers);
