import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    TextField,
    //Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputAdornment,
    Grid,
    Box,
    Typography,
    Rating,
    Dialog,
    DialogContent,
} from '@mui/material';
import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

const ArtistReviewsHostDisplay = ({ history, auth, theEvent }) => {
    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    // const dispatch = useDispatch();

    const [artistReview, setTheReview] = useState({});

    useEffect(() => {
        if (theEvent.artistReviewOfHost) {
            setTheReview(theEvent.artistReviewOfHost);
        }
    }, [theEvent.artistReviewOfHost]);

    return (
        <Fragment key={`Fragment` + theEvent._id}>
            <Grid
                container
                sx={{
                    position: 'relative',
                    // justifyContent: 'space-between',
                    flexDirection: 'column',
                    // flexWrap: 'nowrap',
                    // alignItems: 'center',
                    // width: 'max-content',
                    width: '280px',
                    fontSize: '.5rem',
                }}
            >
                {artistReview && artistReview._id && (
                    <>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Communication
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    // width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.communication}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Promotion
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.promotion}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Tips/Donations
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    ${artistReview.tipsDonations}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Merch Sales
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    ${artistReview.merchSales}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Ticket Sales
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    ${artistReview.ticketSales}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Revenue Expectations
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    {artistReview.revenueExpectations}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Attendance Expectations
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    {artistReview.attendanceExpectations}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Audience Quality
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    {artistReview.audienceQuality}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Venue Quality
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.venueQuality}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Everything Needed
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.everythingNeeded}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Introduction By Host
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.introductionByHost}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Host Example
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.hostExample}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Host Interactions
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.hostInteractions}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Host Accommodations
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.hostAccommodations}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Host Commitment
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Rating
                                    size="small"
                                    name="read-only"
                                    value={artistReview.hostCommitment}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Rec Host For Retreat
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography component={'p'}>
                                    {artistReview.recHostForRetreat}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                position: 'relative',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                width: 'max-content',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 4px 0 0',
                                }}
                            >
                                <Typography component={'p'}>
                                    Artist Notes:
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline',
                                    width: '300px',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {artistReview.artistNotes}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Fragment>
    );
};

ArtistReviewsHostDisplay.propTypes = {
    theEvent: PropTypes.object,
    auth: PropTypes.object.isRequired,
};

export default ArtistReviewsHostDisplay; //withRouter allows us to pass history objects
