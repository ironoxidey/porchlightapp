import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Grid, Typography, FormGroup, Tooltip } from '@mui/material';

import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import HostDashboardEventCard from '../events/HostDashboardEventCard';

import Button from '../layout/SvgButton';

const PastHostEvents = ({
    hostMe,
    myHostEvents,
    // iConfirmed
}) => {
    const [showPastEvents, setShowPastEvents] = useState(false);

    useEffect(() => {
        if (myHostEvents && myHostEvents.length > 0) {
            const unReviewedEvents = myHostEvents.forEach((myHostEvent) => {
                if (
                    myHostEvents.filter(
                        (myEvent) =>
                            myEvent.confirmedHost &&
                            myEvent.status === 'CONFIRMED' &&
                            // iConfirmed(myEvent) &&
                            new Date(myEvent.bookingWhen) <
                                dayBeforeYesterday &&
                            (!myEvent.hostReviewOfEvent ||
                                !myEvent.hostReviewOfEvent._id)
                    ).length > 0
                ) {
                    setShowPastEvents(true);
                }
            });
        }
    }, [myHostEvents]);

    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    return (
        <>
            {myHostEvents &&
                myHostEvents.length > 0 &&
                myHostEvents.filter(
                    (myEvent) =>
                        myEvent.confirmedHost &&
                        myEvent.status === 'CONFIRMED' &&
                        // iConfirmed(myEvent) &&
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
                                        {myHostEvents.filter(
                                            (myEvent) =>
                                                myEvent.confirmedHost &&
                                                myEvent.status ===
                                                    'CONFIRMED' &&
                                                // iConfirmed(myEvent) &&
                                                new Date(myEvent.bookingWhen) <
                                                    dayBeforeYesterday
                                        ).length > 1
                                            ? `You hosted these ${
                                                  myHostEvents.filter(
                                                      (myEvent) =>
                                                          myEvent.confirmedHost &&
                                                          //   iConfirmed(myEvent) &&
                                                          new Date(
                                                              myEvent.bookingWhen
                                                          ) < dayBeforeYesterday
                                                  ).length
                                              } concerts, in the past`
                                            : `You hosted this concert, in the past`}
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
                                {myHostEvents
                                    .filter(
                                        (myEvent) =>
                                            myEvent.confirmedHost &&
                                            myEvent.status === 'CONFIRMED' &&
                                            // iConfirmed(myEvent) &&
                                            new Date(myEvent.bookingWhen) <
                                                dayBeforeYesterday
                                    )
                                    .map(
                                        (thisEvent, idx) =>
                                            thisEvent.bookingWhen &&
                                            thisEvent.bookingWhere && (
                                                <HostDashboardEventCard
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

PastHostEvents.propTypes = {
    host: PropTypes.object,
    myHostEvents: PropTypes.array,
    // iConfirmed: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    host: state.host,
    myHostEvents: state.event.myHostEvents,
});

export default connect(mapStateToProps, {})(PastHostEvents);
