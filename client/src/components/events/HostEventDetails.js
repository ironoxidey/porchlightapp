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

// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

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
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import NoPhotographyTwoToneIcon from '@mui/icons-material/NoPhotographyTwoTone';
import PhotoCameraTwoToneIcon from '@mui/icons-material/PhotoCameraTwoTone';
import ThumbDownAltOutlined from '@mui/icons-material/ThumbDownAltOutlined';
import SpatialAudioOffTwoToneIcon from '@mui/icons-material/SpatialAudioOffTwoTone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    toTitleCase,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
    StackDateforDisplay,
    jumpTo,
} from '../../actions/app';

import EventDetailsCard from './EventDetailsCard';

const HostEventDetails = ({
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
    if (
        me &&
        me._id &&
        ((theEvent.createdBy === 'ARTIST' &&
            (me._id === theEvent.artist || me._id === theEvent.artist._id)) ||
            (theEvent.createdBy === 'HOST' &&
                host.me._id === theEvent.confirmedHost))
    ) {
        isMe = true;
    }

    //console.log('theEvent', theEvent);

    return (
        <Fragment>
            {theEvent &&
                theEvent.bookingWhen &&
                theEvent.bookingWhere != '' && ( //check to be sure there's a valid bookingWhen and Where
                    <>
                        <Grid
                            item
                            container
                            justifyContent="start"
                            // direction="row"
                            sx={{
                                height: '100%',
                                // padding: '0 20px!important',
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
                                    margin: '0 auto',
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
                                {/* preferredArtists */}
                                {/* <EventDetailsCard
                                fieldName="preferredArtists"
                                isMe={isMe}
                                jumpTo={jumpTo}
                                isBlank={
                                    !theEvent.preferredArtists ||
                                    theEvent.preferredArtists.length === 0
                                }
                                icon={<SpatialAudioOffTwoToneIcon />}
                            >
                                {!theEvent.preferredArtists ||
                                theEvent.preferredArtists.length === 0 ? (
                                    'You haven’t told us who you’d like to invite to perform.'
                                ) : (
                                    <>
                                        I’d like to invite{' '}
                                        {theEvent.preferredArtists.length < 2
                                            ? `this artist`
                                            : `these artists`}
                                        :{' '}
                                        <strong>
                                            {theEvent.preferredArtists
                                                .map(
                                                    (artist) => artist.stageName
                                                )
                                                .join(', ')}
                                        </strong>
                                    </>
                                )}
                            </EventDetailsCard> */}

                                {/* tourVibe */}
                                <EventDetailsCard
                                    fieldName="tourVibe"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={
                                        !theEvent.tourVibe ||
                                        theEvent.tourVibe.length === 0
                                    }
                                    icon={<GroupsTwoToneIcon />}
                                >
                                    {!theEvent.tourVibe ||
                                    theEvent.tourVibe.length === 0 ? (
                                        'You haven’t told us about the audience you’re going to invite.'
                                    ) : (
                                        <>
                                            The folks I’m going to invite to the
                                            concert are:{' '}
                                            <strong>
                                                {theEvent.tourVibe.join(', ')}
                                            </strong>
                                        </>
                                    )}
                                </EventDetailsCard>

                                {/* merchTable */}
                                <EventDetailsCard
                                    fieldName="merchTable"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    // isBlank={!theEvent.merchTable}
                                    icon={<TableRestaurantTwoToneIcon />}
                                >
                                    <>
                                        {theEvent.merchTable
                                            ? ` I can provide a merch table in the event that an artist needs one.`
                                            : ' I cannot provide a merch table.'}
                                    </>
                                </EventDetailsCard>

                                {/* promotionApproval */}
                                {isMe && (
                                    <EventDetailsCard
                                        fieldName="promotionApproval"
                                        isMe={isMe}
                                        jumpTo={jumpTo}
                                        isBlank={!theEvent.promotionApproval}
                                        icon={
                                            theEvent.promotionApproval !==
                                            'yes' ? (
                                                <NoPhotographyTwoToneIcon />
                                            ) : (
                                                <PhotoCameraTwoToneIcon />
                                            )
                                        }
                                    >
                                        <>
                                            {!theEvent.promotionApproval
                                                ? ` You haven’t said whether you approve Porchlight to use video, photo, and audio
                captured for promotional purposes.`
                                                : theEvent.promotionApproval ===
                                                  'yes'
                                                ? 'I approve Porchlight to use video, photo, and audio captured for promotional purposes'
                                                : 'I DO NOT approve Porchlight to use video, photo, and audio captured for promotional purposes'}
                                        </>
                                    </EventDetailsCard>
                                )}
                                {/* familyFriendly */}
                                <EventDetailsCard
                                    fieldName="familyFriendly"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    // isBlank={!theEvent.familyFriendly}
                                    icon={
                                        !theEvent.familyFriendly ? (
                                            <WcTwoToneIcon />
                                        ) : (
                                            <FamilyRestroomTwoToneIcon />
                                        )
                                    }
                                >
                                    <>
                                        {theEvent.familyFriendly ? (
                                            <strong>Family-friendy</strong>
                                        ) : (
                                            <>
                                                Would prefer to have an{' '}
                                                <strong>adults-only</strong>{' '}
                                                show
                                            </>
                                        )}
                                    </>
                                </EventDetailsCard>

                                {/* alcohol */}
                                <EventDetailsCard
                                    fieldName="alcohol"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    // isBlank={!theEvent.alcohol}
                                    icon={
                                        !theEvent.alcohol ? (
                                            <NoDrinksTwoToneIcon />
                                        ) : (
                                            <LiquorTwoToneIcon />
                                        )
                                    }
                                >
                                    <>
                                        {theEvent.alcohol ? (
                                            <>
                                                Comfortable with having
                                                <strong>{' alcohol '}</strong>
                                                at the show
                                            </>
                                        ) : (
                                            <>
                                                Would prefer having{' '}
                                                <strong> no alcohol </strong> at
                                                the show
                                            </>
                                        )}
                                    </>
                                </EventDetailsCard>

                                {/* soundSystem */}
                                <EventDetailsCard
                                    fieldName="soundSystem"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={!theEvent.soundSystem}
                                    icon={<SpeakerTwoToneIcon />}
                                >
                                    <>
                                        {theEvent.soundSystem === 'yes' ? (
                                            <>
                                                <strong>
                                                    Able to provide a sound
                                                    system
                                                </strong>
                                            </>
                                        ) : theEvent.soundSystem ===
                                          'noButNeed' ? (
                                            <>
                                                <strong>
                                                    {' '}
                                                    Needs a sound system{' '}
                                                </strong>
                                            </>
                                        ) : theEvent.soundSystem === 'no' ? (
                                            <>
                                                <strong>
                                                    {' '}
                                                    Artist can play an acoustic
                                                    show.{' '}
                                                </strong>
                                            </>
                                        ) : (
                                            <>
                                                You haven’t told us if you need
                                                a sound system.
                                            </>
                                        )}
                                    </>
                                </EventDetailsCard>

                                <EventDetailsCard
                                    fieldName="agreeToPromote"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    //isBlank={!theEvent.agreeToPromote}
                                    icon={<CampaignTwoToneIcon />}
                                >
                                    <>
                                        When asked “Do you agree to promote this
                                        event to your community, including email
                                        sends and social media?{' '}
                                        {(theEvent.confirmedHost ===
                                            host.me._id &&
                                            host.me.firstName) ||
                                            (theEvent.offersFromHosts &&
                                                theEvent.offersFromHosts
                                                    .length > 0 &&
                                                theEvent.offersFromHosts[0].host
                                                    .firstName)}{' '}
                                        answered,{' '}
                                        {!theEvent.agreeToPromote ? (
                                            <strong>
                                                “No, I'm not willing to commit
                                                to that.”
                                            </strong>
                                        ) : (
                                            <strong>
                                                “Yes, to the best of my
                                                ability.”
                                            </strong>
                                        )}
                                    </>
                                </EventDetailsCard>

                                {/* overnight */}
                                <EventDetailsCard
                                    fieldName="overnight"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={!theEvent.overnight}
                                    icon={
                                        !theEvent.overnight ||
                                        theEvent.overnight < 1 ? (
                                            <BedtimeOffTwoToneIcon />
                                        ) : (
                                            <HotelTwoToneIcon />
                                        )
                                    }
                                >
                                    <>
                                        {theEvent.overnight > 0 ? (
                                            <>
                                                Able to host{' '}
                                                <strong>
                                                    {theEvent.overnight +
                                                        (theEvent.overnight > 1
                                                            ? ' people'
                                                            : ' person')}
                                                </strong>{' '}
                                                overnight
                                            </>
                                        ) : (
                                            <>
                                                Not able to host anyone
                                                overnight
                                            </>
                                        )}
                                    </>
                                </EventDetailsCard>

                                {/* hangout */}
                                <EventDetailsCard
                                    fieldName="hangout"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={!theEvent.hangout}
                                    icon={<Diversity1TwoToneIcon />}
                                >
                                    <>
                                        {theEvent.hangout ? (
                                            <>
                                                {`  When asked about spending some informal time with the artist(s), ${
                                                    (theEvent.confirmedHost ===
                                                        host.me._id &&
                                                        host.me.firstName) ||
                                                    (theEvent.offersFromHosts &&
                                                        theEvent.offersFromHosts
                                                            .length > 0 &&
                                                        theEvent
                                                            .offersFromHosts[0]
                                                            .host.firstName)
                                                } said, `}
                                                <strong>
                                                    “{theEvent.hangout}”
                                                </strong>
                                            </>
                                        ) : (
                                            <>
                                                You didn’t say when or if you’d
                                                like to hang out with the
                                                artist(s).
                                            </>
                                        )}
                                    </>
                                </EventDetailsCard>

                                {/* showSchedule */}
                                <EventDetailsCard
                                    fieldName="showSchedule"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={!theEvent.showSchedule}
                                    icon={<AccessTimeTwoToneIcon />}
                                >
                                    <>
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
                                    </>
                                </EventDetailsCard>

                                {/* hostNotes */}
                                <EventDetailsCard
                                    fieldName="hostNotes"
                                    isMe={isMe}
                                    jumpTo={jumpTo}
                                    isBlank={!theEvent.hostNotes}
                                    icon={<SpeakerNotesTwoToneIcon />}
                                >
                                    {theEvent.hostNotes ? (
                                        <>
                                            Host Notes:{' '}
                                            <strong>
                                                {theEvent.hostNotes}
                                            </strong>
                                        </>
                                    ) : (
                                        <>You haven’t added any extra notes.</>
                                    )}
                                </EventDetailsCard>
                            </Grid>
                        </Grid>
                    </>
                )}
        </Fragment>
    );
};

HostEventDetails.propTypes = {
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

export default connect(mapStateToProps, { jumpTo })(
    withRouter(HostEventDetails)
); //withRouter allows us to pass history objects
