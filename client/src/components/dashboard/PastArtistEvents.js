import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Grid, Typography, FormGroup, Tooltip } from '@mui/material';

import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import ArtistDashboardEventCard from '../events/ArtistDashboardEventCard';

import Button from '../layout/SvgButton';

const PastArtistEvents = ({ hostMe, myArtistEvents, iConfirmed }) => {
    const [showPastEvents, setShowPastEvents] = useState(false);

    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    return (
        <>
            {myArtistEvents &&
                myArtistEvents.length > 0 &&
                myArtistEvents.filter(
                    (myEvent) =>
                        myEvent.confirmedHost &&
                        myEvent.status === 'CONFIRMED' &&
                        iConfirmed(myEvent) &&
                        new Date(myEvent.bookingWhen) < dayBeforeYesterday
                ).length > 0 && (
                    <>
                        <Typography
                            onClick={() => setShowPastEvents(!showPastEvents)}
                            sx={{
                                color: 'var(--link-color)',
                                cursor: 'pointer',
                                margin: '16px',
                                textAlign: 'center',
                            }}
                        >
                            {showPastEvents
                                ? 'Hide Past Events'
                                : 'Show Past Events'}
                        </Typography>
                        {showPastEvents && (
                            <Grid
                                container
                                direction="column"
                                sx={{ marginBottom: '20px' }}
                            >
                                <Grid item>
                                    <Typography component="h2">
                                        {myArtistEvents.filter(
                                            (myEvent) =>
                                                myEvent.confirmedHost &&
                                                myEvent.status ===
                                                    'CONFIRMED' &&
                                                iConfirmed(myEvent) &&
                                                new Date(myEvent.bookingWhen) <
                                                    dayBeforeYesterday
                                        ).length > 1
                                            ? `You booked these ${
                                                  myArtistEvents.filter(
                                                      (myEvent) =>
                                                          myEvent.confirmedHost &&
                                                          iConfirmed(myEvent) &&
                                                          new Date(
                                                              myEvent.bookingWhen
                                                          ) < dayBeforeYesterday
                                                  ).length
                                              } concerts, previously`
                                            : `You booked this concert, previously`}
                                        :
                                    </Typography>
                                </Grid>
                                {/* {bookingWhenWhere && bookingWhenWhere.length > 0 && bookingWhenWhere[0].when ? //check to be sure there's a valid first entry */}
                                <Grid
                                    container
                                    className="whenBooking"
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        margin: '0px auto 16px',
                                        width: '100%',
                                    }}
                                ></Grid>
                                {myArtistEvents
                                    .filter(
                                        (myEvent) =>
                                            myEvent.confirmedHost &&
                                            myEvent.status === 'CONFIRMED' &&
                                            iConfirmed(myEvent) &&
                                            new Date(myEvent.bookingWhen) <
                                                dayBeforeYesterday
                                    )
                                    .map(
                                        (thisEvent, idx) =>
                                            thisEvent.bookingWhen &&
                                            thisEvent.bookingWhere && (
                                                <ArtistDashboardEventCard
                                                    key={idx}
                                                    thisEvent={thisEvent}
                                                />
                                            )
                                    )}
                            </Grid>
                        )}
                    </>
                )}
        </>
    );
};

PastArtistEvents.propTypes = {
    artist: PropTypes.object,
    myArtistEvents: PropTypes.array,
    iConfirmed: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
    myArtistEvents: state.event.myArtistEvents,
});

export default connect(mapStateToProps, {})(withRouter(PastArtistEvents)); //withRouter allows us to pass history objects