import React, { Fragment, useState, useEffect, useRef } from 'react';

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
// import { PhoneInput as ReactPhoneInput } from 'react-phone-input-2';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

const HostReviewsEventDisplay = ({ auth, theEvent }) => {
    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    // const dispatch = useDispatch();

    const [hostReview, setTheReview] = useState({});

    useEffect(() => {
        if (theEvent.hostReviewOfEvent) {
            console.log(
                'theEvent.hostReviewOfEvent',
                theEvent.hostReviewOfEvent
            );
            setTheReview(theEvent.hostReviewOfEvent);
        }
    }, [theEvent.hostReviewOfEvent]);

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
                {hostReview && hostReview._id && (
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
                                    Process of Connecting
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
                                    value={hostReview.processOfConnecting}
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
                                    Curation Suggestions
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.curationSuggestions}
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
                                    How Much Attention to Guide
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.howMuchAttentionToGuide}
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
                                    How Helpful Was Guide
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
                                    value={hostReview.howHelpfulWasGuide}
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
                                    Guide Suggestions
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.guideSuggestions}
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
                                    Eventbrite Experience
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.eventbriteExperience}
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
                                    Eventbrite Suggestions
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.eventbriteSuggestions}
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
                                    Porchlight Communications
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
                                    value={hostReview.porchlightCommunications}
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
                                    Artist Communications
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
                                    value={hostReview.artistCommunications}
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
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.attendanceExpectations}
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
                                    Promotion Insight
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.promotionInsight}
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
                                    Experience Meeting Artist
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.experienceMeetingArtist}
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
                                    Audience Interaction
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.audienceInteraction}
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
                                    Artist Vibe
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
                                    value={hostReview.artistVibe}
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
                                    Artist Musical Skill
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
                                    value={hostReview.artistMusicalSkill}
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
                                    Artist Vocal Skill
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
                                    value={hostReview.artistVocalSkill}
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
                                    Artist Songwriting Skill
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
                                    value={hostReview.artistSongwritingSkill}
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
                                    Overnight Experience
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
                                    value={hostReview.overnightExperience}
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
                                    Critique Of Artist
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.critiqueOfArtist}
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
                                    Critique Of Porchlight
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.critiqueOfPorchlight}
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
                                    Experience With Porchlight
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.experienceWithPorchlight}
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
                                    Testimonial
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.testimonial}
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
                                    Willing To Share More
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                sx={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    component={'p'}
                                    sx={{
                                        display: 'inline',
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {hostReview.willingToShareMore}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Fragment>
    );
};

HostReviewsEventDisplay.propTypes = {
    theEvent: PropTypes.object,
    auth: PropTypes.object.isRequired,
};

export default HostReviewsEventDisplay;
