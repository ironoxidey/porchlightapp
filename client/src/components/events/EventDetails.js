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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    toTitleCase,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
    StackDateforDisplay,
} from '../../actions/app';

const EventDetails = ({
    theEvent,
    user,
    isAuthenticated,
    me,
    host,
    events,
    artist,
}) => {
    let history = useHistory();

    let isMe = false;
    if (me && me._id === theEvent.artist) {
        isMe = true;
    }

    console.log('theEvent', theEvent);

    return (
        <Fragment>
            {theEvent &&
                theEvent.bookingWhen &&
                theEvent.bookingWhere != '' && ( //check to be sure there's a valid first entry
                    <Grid
                        item
                        container
                        justifyContent="start"
                        direction="row"
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
                            direction="row"
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
                            {theEvent.costStructure && theEvent.namedPrice && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="costStructure"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=costStructure">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        {theEvent.costStructure ===
                                        'donation' ? (
                                            <VolunteerActivismTwoToneIcon></VolunteerActivismTwoToneIcon>
                                        ) : (
                                            <ConfirmationNumberTwoToneIcon></ConfirmationNumberTwoToneIcon>
                                        )}
                                    </Tooltip>{' '}
                                    {'Concert will be '}
                                    <strong>
                                        {theEvent.costStructure == 'ticket'
                                            ? 'ticketed'
                                            : 'donation-based'}
                                    </strong>
                                    {', at '}
                                    <strong>
                                        {' $'}
                                        {theEvent.namedPrice}
                                    </strong>
                                    {' per '}
                                    {theEvent.costStructure}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.tourVibe && theEvent.tourVibe.length > 0 && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="tourVibe"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=tourVibe">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <GroupsTwoToneIcon></GroupsTwoToneIcon>
                                    </Tooltip>
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
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="showSchedule"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=showSchedule">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
                                        </Tooltip>
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
                            {theEvent.overnight && theEvent.overnight > 0 && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=overnight">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <HotelTwoToneIcon></HotelTwoToneIcon>
                                    </Tooltip>
                                    {
                                        ' If possible, overnight accommodation appreciated for '
                                    }
                                    <strong>
                                        {theEvent.overnight +
                                            (theEvent.overnight > 1
                                                ? ' people'
                                                : ' person')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {(theEvent.merchTable || artist.merchTable) && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="merchTable"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=merchTable">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would like a <strong>merch table</strong>{' '}
                                    (for CDs, t-shirts, etc.) <Divider />
                                </Grid>
                            )}
                            {/* {!artist.merchTable ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
					{' '}<strong>{'Does NOT need a merch table'}</strong>{' '}
					</Grid>
				: ''} */}
                            {artist &&
                                artist.allergies &&
                                artist.allergies.length > 0 && (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="allergies"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=allergies">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <SvgIcon
                                                style={{
                                                    width: '26px',
                                                    verticalAlign: 'baseline',
                                                }}
                                            >
                                                <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                                            </SvgIcon>
                                        </Tooltip>
                                        {' Has these allergies: '}
                                        <strong>
                                            {artist.allergies.constructor
                                                .name === 'Array' &&
                                                artist.allergies.map(
                                                    (allergy, ind) => {
                                                        if (
                                                            ind !==
                                                            artist.allergies
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
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'Family-friendly'}</strong>
                                    <Divider />
                                </Grid>
                            )}
                            {!theEvent.familyFriendly && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <WcTwoToneIcon></WcTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would prefer to have an{' '}
                                    <strong>adults-only</strong> show
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.alcohol && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <LiquorTwoToneIcon></LiquorTwoToneIcon>
                                    </Tooltip>
                                    Comfortable with having
                                    <strong>{' alcohol '}</strong>at the show
                                    <Divider />
                                </Grid>
                            )}
                            {!theEvent.alcohol && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <NoDrinksTwoToneIcon></NoDrinksTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would prefer having{' '}
                                    <strong> no alcohol </strong> at the show
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'yes' && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        {'Able to bring their own sound system'}
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'noButNeed' && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'Needs a sound system'}</strong>{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.soundSystem == 'no' && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        Able to play an acoustic show
                                    </strong>{' '}
                                    if it makes sense for the size of the space.{' '}
                                    <Divider />
                                </Grid>
                            )}
                            {theEvent.covidPrefs &&
                                theEvent.covidPrefs.length > 0 && (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="covidPrefs"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=covidPrefs">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <CoronavirusTwoToneIcon></CoronavirusTwoToneIcon>
                                        </Tooltip>
                                        {' Considering Covid, would prefer: '}
                                        <strong>
                                            {artist.covidPrefs &&
                                                artist.covidPrefs.constructor
                                                    .name === 'Array' &&
                                                artist.covidPrefs.map(
                                                    (covidPref, ind) => {
                                                        if (
                                                            ind !==
                                                            artist.covidPrefs
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
                            {theEvent.financialHopes && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="financialHopes"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=financialHopes">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SavingsTwoToneIcon></SavingsTwoToneIcon>
                                    </Tooltip>
                                    {' It would be hard to make less than '}
                                    <strong>${artist.financialHopes}</strong>
                                    {' per show'}

                                    <Divider />
                                </Grid>
                            )}
                            {artist.fanActions && artist.fanActions.length > 0 && (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="fanActions"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=fanActions">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
                                    </Tooltip>
                                    {' How new fans can show support: '}
                                    <strong>
                                        {artist.fanActions.map(
                                            (fanAction, ind) => {
                                                if (
                                                    ind !==
                                                    artist.fanActions.length - 1
                                                ) {
                                                    return fanAction + ', ';
                                                } else {
                                                    return fanAction;
                                                }
                                            }
                                        )}{' '}
                                    </strong>

                                    <Divider />
                                </Grid>
                            )}
                            {user &&
                                user.role &&
                                user.role.indexOf('ADMIN') > -1 &&
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
                                ))}
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
    events: PropTypes.object,
    theEvent: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
    me: state.artist.me,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    host: state.host,
    events: state.event.events,
});

export default connect(mapStateToProps, {})(withRouter(EventDetails)); //withRouter allows us to pass history objects
