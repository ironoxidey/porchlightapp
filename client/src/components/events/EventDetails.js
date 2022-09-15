import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import prependHttp from 'prepend-http';

import {
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    IconButton,
    Divider,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//import Masonry from '@mui/lab/Masonry';
import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
import EmojiObjectsTwoToneIcon from '@mui/icons-material/EmojiObjectsTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import HotelTwoToneIcon from '@mui/icons-material/HotelTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import FamilyRestroomTwoToneIcon from '@mui/icons-material/FamilyRestroomTwoTone';
import SpeakerTwoToneIcon from '@mui/icons-material/SpeakerTwoTone';
import CoronavirusTwoToneIcon from '@mui/icons-material/CoronavirusTwoTone';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import WcTwoToneIcon from '@mui/icons-material/WcTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import LiquorTwoToneIcon from '@mui/icons-material/LiquorTwoTone';
import NoDrinksTwoToneIcon from '@mui/icons-material/NoDrinksTwoTone';
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
import MoneyOffTwoToneIcon from '@mui/icons-material/MoneyOffTwoTone';
import BedtimeOffTwoToneIcon from '@mui/icons-material/BedtimeOffTwoTone';
import InterpreterModeTwoToneIcon from '@mui/icons-material/InterpreterModeTwoTone';
import SpeakerNotesTwoToneIcon from '@mui/icons-material/SpeakerNotesTwoTone';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    toTitleCase,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
    StackDateforDisplay,
    jumpTo,
} from '../../actions/app';

const EventDetails = ({
    theEvent,
    user,
    isAuthenticated,
    me,
    host,
    events,
    artist,
    jumpTo,
}) => {
    let history = useHistory();

    let isMe = false;
    if (me && (me._id === theEvent.artist || me._id === theEvent.artist._id)) {
        isMe = true;
    }

    //console.log('theEvent', theEvent);

    return (
        <Fragment>
            {theEvent &&
                theEvent.bookingWhen &&
                theEvent.bookingWhere != '' && ( //check to be sure there's a valid bookingWhen and Where
                    <Grid
                        item
                        container
                        justifyContent="start"
                        // direction="row"
                        sx={{
                            height: '100%',
                            padding: '0 20px!important',
                            color: 'var(--primary-color)',

                            justifyContent: {
                                xs: 'center',
                            },
                        }}
                        className="bookingDetails"
                    >
                        <Grid
                            container
                            item
                            // direction="row"
                            xs={12}
                            md={8}
                            spacing={2}
                            sx={{
                                paddingLeft: {
                                    md: '16px',
                                    xs: '0px',
                                },
                                paddingTop: {
                                    md: '0px',
                                    xs: '16px',
                                },
                            }}
                            className="bookingSpecifics"
                        >
                            {isMe &&
                                (!theEvent.costStructure ||
                                    !theEvent.namedPrice) && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                        }}
                                        xs={12}
                                        md={6}
                                        className="costStructure"
                                    >
                                        {
                                            <VolunteerActivismTwoToneIcon
                                                style={{
                                                    cursor: isMe
                                                        ? 'pointer'
                                                        : 'auto',
                                                    color: 'var(--link-color)',
                                                }}
                                                onClick={() => {
                                                    if (
                                                        isMe &&
                                                        !theEvent.costStructure
                                                    ) {
                                                        jumpTo('costStructure');
                                                    } else if (
                                                        isMe &&
                                                        !theEvent.namedPrice
                                                    ) {
                                                        jumpTo('namedPrice');
                                                    }
                                                }}
                                            ></VolunteerActivismTwoToneIcon>
                                        }
                                        {!theEvent.costStructure && (
                                            <Typography
                                                style={{
                                                    cursor: isMe
                                                        ? 'pointer'
                                                        : 'auto',
                                                    color: 'var(--link-color)',
                                                }}
                                                onClick={() => {
                                                    if (
                                                        isMe &&
                                                        !theEvent.costStructure
                                                    ) {
                                                        jumpTo('costStructure');
                                                    }
                                                }}
                                            >
                                                You haven’t filled in the cost
                                                structure you’d prefer.
                                            </Typography>
                                        )}
                                        {!theEvent.namedPrice && (
                                            <Typography
                                                style={{
                                                    cursor: isMe
                                                        ? 'pointer'
                                                        : 'auto',
                                                    color: 'var(--link-color)',
                                                }}
                                                onClick={() => {
                                                    if (
                                                        isMe &&
                                                        !theEvent.namedPrice
                                                    ) {
                                                        jumpTo('namedPrice');
                                                    }
                                                }}
                                            >
                                                You haven’t named your price.
                                            </Typography>
                                        )}

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.costStructure && theEvent.namedPrice && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                    }}
                                    xs={12}
                                    md={6}
                                    className="costStructure"
                                >
                                    {theEvent.costStructure === 'donation' ? (
                                        <VolunteerActivismTwoToneIcon
                                            style={{
                                                cursor: isMe
                                                    ? 'pointer'
                                                    : 'auto',
                                            }}
                                            onClick={() => {
                                                if (isMe) {
                                                    jumpTo('costStructure');
                                                }
                                            }}
                                        ></VolunteerActivismTwoToneIcon>
                                    ) : (
                                        <ConfirmationNumberTwoToneIcon
                                            style={{
                                                cursor: isMe
                                                    ? 'pointer'
                                                    : 'auto',
                                            }}
                                            onClick={() => {
                                                if (isMe) {
                                                    jumpTo('costStructure');
                                                }
                                            }}
                                        ></ConfirmationNumberTwoToneIcon>
                                    )}
                                    {'Wants the concert to be '}
                                    <strong
                                        style={{
                                            cursor: isMe ? 'pointer' : 'auto',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('costStructure');
                                            }
                                        }}
                                    >
                                        {theEvent.costStructure == 'ticket'
                                            ? 'ticketed'
                                            : 'donation-based'}
                                    </strong>
                                    {', at '}
                                    <strong
                                        style={{
                                            cursor: isMe ? 'pointer' : 'auto',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('namedPrice');
                                            }
                                        }}
                                    >
                                        {' $'}
                                        {theEvent.namedPrice}
                                    </strong>
                                    {' per '}
                                    {theEvent.costStructure}
                                    <Divider />
                                </Grid>
                            )}
                            {isMe &&
                                (!theEvent.tourVibe ||
                                    theEvent.tourVibe.length === 0) && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe ? 'pointer' : 'auto',
                                            color: 'var(--link-color)',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('tourVibe');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="tourVibe"
                                    >
                                        <GroupsTwoToneIcon
                                            style={{
                                                color: 'var(--link-color)',
                                            }}
                                        ></GroupsTwoToneIcon>
                                        {
                                            'You haven’t told us about the audience you feel most comfortable performing for.'
                                        }

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.tourVibe && theEvent.tourVibe.length > 0 && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('tourVibe');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="tourVibe"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        jumpTo('tourVibe');
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </>
                                        }
                                    > */}
                                    <GroupsTwoToneIcon></GroupsTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {
                                        ' Feels most comfortable performing for an audience who is: '
                                    }
                                    <strong>
                                        {theEvent.tourVibe.join(', ')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.showSchedule && (
                                <Fragment>
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('showSchedule');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="showSchedule"
                                    >
                                        {/* <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <>
                                                    <Button
                                                        onClick={() => {
                                                            jumpTo(
                                                                'showSchedule'
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </>
                                            }
                                        > */}
                                        <AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
                                        {/*</Tooltip> */}
                                        {' Setup at '}
                                        <strong>
                                            {convert24HourTime(
                                                theEvent.showSchedule.setupTime
                                            )}
                                        </strong>
                                        {', doors open at '}
                                        <strong>
                                            {convert24HourTime(
                                                theEvent.showSchedule.doorsOpen
                                            )}
                                        </strong>
                                        {', show starts at '}
                                        <strong>
                                            {convert24HourTime(
                                                theEvent.showSchedule.startTime
                                            )}
                                        </strong>
                                        {', with a hard wrap at '}
                                        <strong>
                                            {convert24HourTime(
                                                theEvent.showSchedule.hardWrap
                                            )}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                </Fragment>
                            )}
                            {!theEvent.agreeToPromote && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('agreeToPromote');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="agreeToPromote"
                                >
                                    <CampaignTwoToneIcon></CampaignTwoToneIcon>
                                    {` When asked “Do you agree to promote each show to your audience, including email sends and social media?” ${
                                        theEvent.artist.stageName ||
                                        artist.artist.stageName
                                    } answered, `}
                                    <strong>
                                        “No, I'm not willing to commit to that.”
                                    </strong>
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.agreeToPromote && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('agreeToPromote');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="agreeToPromote"
                                >
                                    <CampaignTwoToneIcon></CampaignTwoToneIcon>
                                    {` When asked “Do you agree to promote each show to your audience, including email sends and social media?” ${
                                        theEvent.artist.stageName ||
                                        artist.artist.stageName
                                    } answered, `}
                                    <strong>
                                        “Yes, to the best of my ability.”
                                    </strong>
                                    <Divider />
                                </Grid>
                            )}
                            {isMe && !theEvent.openers && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                        color: 'var(--link-color)',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('openers');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="openers"
                                >
                                    <InterpreterModeTwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></InterpreterModeTwoToneIcon>
                                    {` You haven’t said anything about an opener.`}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.openers && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('openers');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="openers"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=openers">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <InterpreterModeTwoToneIcon></InterpreterModeTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {` When asked about openers, ${
                                        theEvent.artist.stageName ||
                                        artist.artist.stageName
                                    } said, `}
                                    <strong>“{theEvent.openers}”</strong>
                                    <Divider />
                                </Grid>
                            )}
                            {isMe && !theEvent.overnight && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                        color: 'var(--link-color)',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('overnight');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    <HotelTwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></HotelTwoToneIcon>
                                    {
                                        ' You haven’t said if you’ll need to stay overnight. '
                                    }

                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.overnight && theEvent.overnight > 0 && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('overnight');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=overnight">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <HotelTwoToneIcon></HotelTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {
                                        ' If possible, overnight accommodation appreciated for '
                                    }
                                    <strong style={{ display: 'inline-block' }}>
                                        {theEvent.overnight +
                                            (theEvent.overnight > 1
                                                ? ' people'
                                                : ' person')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.overnight && theEvent.overnight == 0 && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('overnight');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=overnight">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <BedtimeOffTwoToneIcon></BedtimeOffTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {' Does not need overnight accommodations.'}

                                    <Divider />
                                </Grid>
                            )}

                            {isMe && !theEvent.hangout && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                        color: 'var(--link-color)',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('hangout');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="hangout"
                                >
                                    <Diversity1TwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></Diversity1TwoToneIcon>
                                    You didn’t say when or if you’d like to hang
                                    out with your hosts.
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.hangout && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('hangout');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="hangout"
                                >
                                    <Diversity1TwoToneIcon></Diversity1TwoToneIcon>
                                    {`  When asked about spending some informal time with the hosts, ${
                                        theEvent.artist.stageName ||
                                        artist.artist.stageName
                                    } said, `}
                                    <strong>“{theEvent.hangout}”</strong>
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.merchTable == true ? (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('merchTable');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="merchTable"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=merchTable">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
                                    {/* </Tooltip>{' '} */}
                                    Would like a <strong>
                                        merch table
                                    </strong>{' '}
                                    (for CDs, t-shirts, etc.) <Divider />
                                </Grid>
                            ) : (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('merchTable');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="merchTable"
                                >
                                    <TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>{' '}
                                    Does <strong> NOT </strong> need a merch
                                    table <Divider />
                                </Grid>
                            )}
                            {isMe &&
                                (!theEvent.allergies ||
                                    theEvent.allergies.length === 0) && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                            color: 'var(--link-color)',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('allergies');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="allergies"
                                    >
                                        <SvgIcon
                                            style={{
                                                width: '26px',
                                                verticalAlign: 'baseline',
                                                color: 'var(--link-color)',
                                            }}
                                        >
                                            <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                                        </SvgIcon>
                                        {' You haven’t listed any allergies.'}

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.allergies &&
                                theEvent.allergies.length > 0 && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('allergies');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="allergies"
                                    >
                                        {/* <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=allergies">
                                                    Edit
                                                </Link>
                                            }
                                        > */}
                                        <SvgIcon
                                            style={{
                                                width: '26px',
                                                verticalAlign: 'baseline',
                                            }}
                                        >
                                            <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                                        </SvgIcon>
                                        {/* </Tooltip> */}
                                        {' Has these allergies: '}
                                        <strong>
                                            {theEvent.allergies.constructor
                                                .name === 'Array' &&
                                                theEvent.allergies.map(
                                                    (allergy, ind) => {
                                                        if (
                                                            ind !==
                                                            theEvent.allergies
                                                                .length -
                                                                1
                                                        ) {
                                                            return (
                                                                allergy + ', '
                                                            );
                                                        } else {
                                                            return allergy;
                                                        }
                                                    }
                                                )}{' '}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.familyFriendly && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('familyFriendly');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon>
                                    {/* </Tooltip>*/}{' '}
                                    <strong>{'Family-friendly'}</strong>
                                    <Divider />
                                </Grid>
                            )}
                            {!theEvent.familyFriendly && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('familyFriendly');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <WcTwoToneIcon></WcTwoToneIcon>
                                    {/* </Tooltip>*/} Would prefer to have an{' '}
                                    <strong>adults-only</strong> show
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.alcohol && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('alcohol');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <LiquorTwoToneIcon></LiquorTwoToneIcon>
                                    {/* </Tooltip> */}
                                    Comfortable with having
                                    <strong>{' alcohol '}</strong>at the show
                                    <Divider />
                                </Grid>
                            )}
                            {!theEvent.alcohol && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('alcohol');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <NoDrinksTwoToneIcon></NoDrinksTwoToneIcon>
                                    {/* </Tooltip>{' '} */}
                                    Would prefer having{' '}
                                    <strong> no alcohol </strong> at the show
                                    <Divider />
                                </Grid>
                            )}
                            {isMe && !theEvent.soundSystem && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                        color: 'var(--link-color)',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('soundSystem');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <SpeakerTwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></SpeakerTwoToneIcon>
                                    <strong
                                        style={{ color: 'var(--link-color)' }}
                                    >
                                        {
                                            'You haven’t told us if you need a sound system.'
                                        }
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'yes' && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('soundSystem');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    {/* </Tooltip>{' '} */}
                                    <strong>
                                        {'Able to bring a sound system'}
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'noButNeed' && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('soundSystem');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    {/* </Tooltip>{' '} */}
                                    <strong>
                                        {'Needs a sound system'}
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'no' && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('soundSystem');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    {/* </Tooltip>{' '} */}
                                    <strong>
                                        Able to play an acoustic show
                                    </strong>{' '}
                                    if it makes sense for the size of the space.{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {isMe &&
                                (!theEvent.covidPrefs ||
                                    theEvent.covidPrefs.length === 0) && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('covidPrefs');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="covidPrefs"
                                    >
                                        <CoronavirusTwoToneIcon
                                            style={{
                                                color: 'var(--link-color)',
                                            }}
                                        ></CoronavirusTwoToneIcon>
                                        <strong
                                            style={{
                                                color: 'var(--link-color)',
                                            }}
                                        >
                                            You haven’t specified any Covid
                                            preferences.
                                        </strong>

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.covidPrefs &&
                                theEvent.covidPrefs.constructor.name ===
                                    'Array' &&
                                theEvent.covidPrefs.length > 0 && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('covidPrefs');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="covidPrefs"
                                    >
                                        {/* <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=covidPrefs">
                                                    Edit
                                                </Link>
                                            }
                                        > */}
                                        <CoronavirusTwoToneIcon></CoronavirusTwoToneIcon>
                                        {/* </Tooltip> */}
                                        {' Considering Covid, would prefer: '}
                                        <strong>
                                            {theEvent.covidPrefs &&
                                                theEvent.covidPrefs.constructor
                                                    .name === 'Array' &&
                                                theEvent.covidPrefs.map(
                                                    (covidPref, ind) => {
                                                        if (
                                                            ind !==
                                                            theEvent.covidPrefs
                                                                .length -
                                                                1
                                                        ) {
                                                            return (
                                                                covidPref + ', '
                                                            );
                                                        } else {
                                                            return covidPref;
                                                        }
                                                    }
                                                )}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                )}
                            {isMe && !theEvent.financialHopes && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('financialHopes');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="financialHopes"
                                >
                                    <SavingsTwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></SavingsTwoToneIcon>

                                    <strong
                                        style={{ color: 'var(--link-color)' }}
                                    >
                                        {' '}
                                        You haven’t explained your financial
                                        expectations/hopes for this concert.
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.financialHopes && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('financialHopes');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="financialHopes"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=financialHopes">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <SavingsTwoToneIcon></SavingsTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {' It would be hard to make less than '}
                                    <strong>${theEvent.financialHopes}</strong>
                                    {' per show'}

                                    <Divider />
                                </Grid>
                            )}
                            {isMe &&
                                (!theEvent.fanActions ||
                                    theEvent.fanActions.length === 0) && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                            color: 'var(--link-color)',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('fanActions');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="fanActions"
                                    >
                                        <ThumbUpTwoToneIcon
                                            style={{
                                                color: 'var(--link-color)',
                                            }}
                                        ></ThumbUpTwoToneIcon>
                                        <strong
                                            style={{
                                                color: 'var(--link-color)',
                                            }}
                                        >
                                            You haven’t told us how you’d like
                                            new fans to show support.
                                        </strong>

                                        <Divider />
                                    </Grid>
                                )}
                            {theEvent.fanActions &&
                                theEvent.fanActions.constructor.name ===
                                    'Array' &&
                                theEvent.fanActions.length > 0 && (
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: '0',
                                            cursor: isMe
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                        onClick={() => {
                                            if (isMe) {
                                                jumpTo('fanActions');
                                            }
                                        }}
                                        xs={12}
                                        md={6}
                                        className="fanActions"
                                    >
                                        {/* <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=fanActions">
                                                    Edit
                                                </Link>
                                            }
                                        > */}
                                        <ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
                                        {/* </Tooltip> */}
                                        {' How new fans can show support: '}
                                        <strong>
                                            {(theEvent.fanActions &&
                                                theEvent.fanActions.map(
                                                    (fanAction, ind) => {
                                                        if (
                                                            ind !==
                                                            theEvent.fanActions
                                                                .length -
                                                                1
                                                        ) {
                                                            return (
                                                                fanAction + ', '
                                                            );
                                                        } else {
                                                            return fanAction;
                                                        }
                                                    }
                                                )) ||
                                                theEvent.artist.fanActions.map(
                                                    (fanAction, ind) => {
                                                        if (
                                                            ind !==
                                                            theEvent.artist
                                                                .fanActions
                                                                .length -
                                                                1
                                                        ) {
                                                            return (
                                                                fanAction + ', '
                                                            );
                                                        } else {
                                                            return fanAction;
                                                        }
                                                    }
                                                )}{' '}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                )}
                            {isMe && !theEvent.artistNotes && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('artistNotes');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="artistNotes"
                                >
                                    <SpeakerNotesTwoToneIcon
                                        style={{ color: 'var(--link-color)' }}
                                    ></SpeakerNotesTwoToneIcon>

                                    <strong
                                        style={{ color: 'var(--link-color)' }}
                                    >
                                        You haven’t added any extra notes.
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.artistNotes && (
                                <Grid
                                    item
                                    sx={{
                                        marginTop: '0',
                                        cursor: isMe ? 'pointer' : 'auto',
                                    }}
                                    onClick={() => {
                                        if (isMe) {
                                            jumpTo('artistNotes');
                                        }
                                    }}
                                    xs={12}
                                    md={6}
                                    className="artistNotes"
                                >
                                    {/* <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=artistNotes">
                                                Edit
                                            </Link>
                                        }
                                    > */}
                                    <SpeakerNotesTwoToneIcon></SpeakerNotesTwoToneIcon>
                                    {/* </Tooltip> */}
                                    {' Artist Notes: '}
                                    <strong>{theEvent.artistNotes}</strong>

                                    <Divider />
                                </Grid>
                            )}
                            {/* {user &&
                                user.role &&
                                (user.role.indexOf('ADMIN') > -1 ||
                                    user.role.indexOf('BOOKING') > -1) &&
                                (theEvent.agreeToPayAdminFee ? (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="agreeToPayAdminFee"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=agreeToPayAdminFee">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <AttachMoneyTwoToneIcon></AttachMoneyTwoToneIcon>
                                        </Tooltip>
                                        <strong> Agreed </strong>{' '}
                                        {
                                            ' to pay 20% of gross ticket sales, tips, and merch sales '
                                        }
                                        <Divider />
                                    </Grid>
                                ) : (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="agreeToPayAdminFee"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=agreeToPayAdminFee">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <MoneyOffTwoToneIcon></MoneyOffTwoToneIcon>
                                        </Tooltip>
                                        <strong> Did NOT agree </strong>
                                        {
                                            ' to pay 20% of gross ticket sales, tips, and merch sales.'
                                        }{' '}
                                        <strong>
                                            Would like to discuss this further.
                                        </strong>
                                        <Divider />
                                    </Grid>
                                ))} */}
                        </Grid>
                    </Grid>
                )}
        </Fragment>
    );
};

EventDetails.propTypes = {
    artist: PropTypes.object.isRequired,
    me: PropTypes.object,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    host: PropTypes.object,
    events: PropTypes.array,
    theEvent: PropTypes.object.isRequired,
    jumpTo: PropTypes.func,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
    me: state.artist.me,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    host: state.host,
    events: state.event.events,
});

export default connect(mapStateToProps, { jumpTo })(withRouter(EventDetails)); //withRouter allows us to pass history objects
