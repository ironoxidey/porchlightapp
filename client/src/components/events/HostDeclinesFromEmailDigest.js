import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hostDeclines } from '../../actions/event';
//import axios from 'axios';
import { TextField, Grid, Box, FormLabel, Typography } from '@mui/material';

import Button from '../layout/SvgButton';
import NearMeToHostEventCard from '../dashboard/NearMeToHostEventCard';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const HostDeclinesFromEmailDigest = ({
    host,
    match,
    hostDeclines,
    nearMeToHost,
}) => {
    //link should look like: https://app.porchlight.art/decline/65b2a6fb9fe6649974b24946?t=
    let query = useQuery();

    const { id } = useParams();

    const getTime = query.get('t');
    var d = new Date();
    d.setTime(getTime);
    var dateString = d.toISOString();

    const hostID = query.get('h');

    const theEvent = {
        _id: id,
        createdAt: dateString,
    };

    const [thisEvent, setThisEvent] = useState();

    useEffect(() => {
        console.log('hostID', hostID, 'theEvent', theEvent);
        hostDeclines(hostID, theEvent);
    }, []);

    useEffect(() => {
        if (nearMeToHost && nearMeToHost.length > 0) {
            nearMeToHost.forEach((nearMeToHostEvent) => {
                if (nearMeToHostEvent._id === theEvent._id) {
                    setThisEvent(nearMeToHostEvent);
                }
            });
        }
    }, [nearMeToHost]);

    // return <Navigate to="/dashboard" />;
    // console.log(event[0]);
    return (
        <>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                {thisEvent ? (
                    <NearMeToHostEventCard
                        thisEvent={thisEvent}
                        hostID={hostID}
                    ></NearMeToHostEventCard>
                ) : (
                    <>
                        <Typography component={'h2'}>
                            This event no longer exists.
                        </Typography>
                        <Typography
                            component={'p'}
                            sx={{ margin: '8px 0 0 0' }}
                        >
                            Thank you, anyway, though!
                        </Typography>
                    </>
                )}
            </Box>
        </>
    );
};
HostDeclinesFromEmailDigest.propTypes = {
    hostDeclines: PropTypes.func.isRequired,
    nearMeToHost: PropTypes.array,
};

const mapStateToProps = (state) => ({
    nearMeToHost: state.event.nearMeToHost,
});
export default connect(mapStateToProps, { hostDeclines })(
    HostDeclinesFromEmailDigest
);
