import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { unsubscribeHostDigest } from '../../actions/host';
//import axios from 'axios';
import { TextField, Grid, Box, FormLabel, Typography } from '@mui/material';

import Button from '../layout/SvgButton';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const UnsubscribeHostDigest = ({ unsubscribeHostDigest, match }) => {
    let query = useQuery();
    const getTime = query.get('t');

    const { id } = useParams();

    useEffect(() => {
        console.log('useParams()', id, 'getTime:', getTime);
        unsubscribeHostDigest(id, getTime);
    }, []);

    return (
        <Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                <Typography>
                    You should now be unsubscribed from the Porchlight Host
                    Email Digest.
                </Typography>
            </Box>
        </Fragment>
    );
};
UnsubscribeHostDigest.propTypes = {
    unsubscribeHostDigest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { unsubscribeHostDigest })(
    UnsubscribeHostDigest
);
