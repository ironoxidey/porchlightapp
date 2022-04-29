import React from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    SvgIcon,
    Chip,
} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import OtherHousesTwoToneIcon from '@mui/icons-material/OtherHousesTwoTone';
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone'; //for confirming a host
import LocalHotelTwoToneIcon from '@mui/icons-material/LocalHotelTwoTone'; //for overnight
import NightShelterTwoToneIcon from '@mui/icons-material/NightShelterTwoTone'; //for overnight
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone'; // for guarantee
import RestaurantTwoToneIcon from '@mui/icons-material/RestaurantTwoTone'; // for refreshments
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone'; // for honorarium
import GavelTwoToneIcon from '@mui/icons-material/GavelTwoTone';
import Button from '../layout/SvgButton';

import { toTitleCase } from '../../actions/app';
import { artistAcceptOffer } from '../../actions/event';

const HostProfile = ({
    user,
    theHost,
    isMe = false,
    theOffer,
    theEvent,
    eventDetailsDialogHandleClose,
    artistAcceptOffer,
}) => {
    console.log('theEvent', theEvent);
    return (
        <>
            <Grid
                container
                className="theHostProfile"
                sx={
                    {
                        //paddingBottom: '80px!important',
                    }
                }
            >
                {/* {wideImg ? ( */}
                <Tooltip
                    arrow={true}
                    disableHoverListener={!isMe}
                    disableFocusListener={!isMe}
                    disableTouchListener={!isMe}
                    title={
                        <Link to="/edit-host-profile?field=venueImg">Edit</Link>
                    }
                >
                    <Grid
                        container
                        className="wideImgBG"
                        sx={{
                            padding: '20px!important',
                            height: {
                                xs: '100%',
                                md: '100%',
                            },
                            maxHeight: {
                                xs: '100%',
                                md: '100%',
                            },
                            //width: 'calc(100% - 40px)',
                            //maxWidth: '960px',
                            margin: '0 auto',
                            borderRadius: '4px 4px 0 0',
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.3)), url("${theHost.venueImg}")`,
                            backgroundColor: 'var(--secondary-dark-color)',
                            backgroundPosition: '50% 50%',
                            backgroundSize: 'cover',
                            alignItems: 'center',
                            justifyContent: {
                                md: 'start',
                                xs: 'center',
                            },
                        }}
                    >
                        {theHost.profileImg && (
                            <Grid item>
                                <Tooltip
                                    arrow={true}
                                    disableHoverListener={!isMe}
                                    disableFocusListener={!isMe}
                                    disableTouchListener={!isMe}
                                    title={
                                        <Link to="/edit-host-profile?field=profileImg">
                                            Edit
                                        </Link>
                                    }
                                >
                                    <Box
                                        className="squareImgInACircle"
                                        sx={{
                                            height: '200px',
                                            width: '200px',
                                            maxHeight: '200px',
                                            maxWidth: '200px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            backgroundImage: `url("${theHost.profileImg}")`,
                                            backgroundPosition: '50% 25%',
                                            backgroundSize: 'cover',
                                            padding: '4px',
                                            backgroundClip: 'content-box',
                                            border: '1px solid var(--primary-color)',
                                            margin: '0 8px 0 0',
                                        }}
                                    ></Box>
                                </Tooltip>
                                {theHost.firstName && theHost.lastName && (
                                    <Grid item>
                                        <Grid
                                            container
                                            item
                                            direction="row"
                                            justifyContent="center"
                                            sx={{
                                                margin: '8px auto',
                                                width: '100%',
                                            }}
                                        >
                                            <Typography component="h2">
                                                {theHost.firstName}{' '}
                                                {theHost.lastName}
                                            </Typography>{' '}
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                        <Grid
                            item
                            container
                            md={8}
                            sx={{
                                marginTop: '0',
                                textShadow: '0 0 10px rgba(0,0,0,.9)',
                                width: 'fit-content',
                                maxWidth: 'fit-content',
                            }}
                            direction="column"
                            alignItems="start"
                            className="topInfo"
                        >
                            {theHost.city && theHost.state && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    'Location'
                                                ) : (
                                                    <Link to="/edit-host-profile?field=location">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <PlaceTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></PlaceTwoToneIcon>
                                        </Tooltip>
                                        {`${
                                            theHost.primarySpace === 'residence'
                                                ? toTitleCase(theHost.city) +
                                                  ', ' +
                                                  theHost.state
                                                : toTitleCase(
                                                      theHost.venueCity
                                                  ) +
                                                  ', ' +
                                                  theHost.venueState
                                        }`}
                                    </Typography>
                                </Grid>
                            )}
                            {theHost.numDraw && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    theHost.firstName +
                                                    ' can draw about ' +
                                                    theHost.numDraw +
                                                    ' people.'
                                                ) : (
                                                    <Link to="/edit-host-profile?field=numDraw">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <GroupAddTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></GroupAddTwoToneIcon>
                                        </Tooltip>
                                        {theHost.firstName +
                                            ' can draw about ' +
                                            theHost.numDraw +
                                            ' people.'}
                                    </Typography>
                                </Grid>
                            )}
                            {theHost.numHostedBefore && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    theHost.firstName +
                                                    ` has hosted ${
                                                        theHost.numHostedBefore
                                                    }${
                                                        theHost.numHostedBefore >
                                                        1
                                                            ? ` events like this before.`
                                                            : ` event like this before.`
                                                    }`
                                                ) : (
                                                    <Link to="/edit-host-profile?field=numDraw">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <OtherHousesTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></OtherHousesTwoToneIcon>
                                        </Tooltip>
                                        {theHost.firstName +
                                            ` has hosted ${
                                                theHost.numHostedBefore
                                            }${
                                                theHost.numHostedBefore > 1
                                                    ? ` events like this before.`
                                                    : ` event like this before.`
                                            }
                                        `}
                                    </Typography>
                                </Grid>
                            )}
                            {theHost.maxNumAttendees && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    theHost.firstName +
                                                    `’s ${
                                                        theHost.primarySpace ||
                                                        'residence'
                                                    } can host a maximum of ${
                                                        theHost.maxNumAttendees
                                                    } people.`
                                                ) : (
                                                    <Link to="/edit-host-profile?field=numDraw">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <CoPresentTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></CoPresentTwoToneIcon>
                                        </Tooltip>
                                        {theHost.firstName +
                                            `’s ${
                                                theHost.primarySpace ||
                                                'residence'
                                            } can host a maximum of ${
                                                theHost.maxNumAttendees
                                            } people.`}
                                    </Typography>
                                </Grid>
                            )}
                            {theOffer.refreshments &&
                                theOffer.refreshments.constructor.name ===
                                    'Array' &&
                                theOffer.refreshments.length > 0 && (
                                    <Grid
                                        item
                                        container
                                        alignItems="baseline"
                                        sx={{ margin: '8px 0 -4px 0' }} // -4px compensating for the 4px added to the bottom of the icon to make it center on the line
                                    >
                                        <Typography
                                            component="h3"
                                            sx={{ verticalAlign: 'start' }}
                                        >
                                            <Tooltip
                                                title={
                                                    !isMe ? (
                                                        'Refreshments'
                                                    ) : (
                                                        <Link to="/edit-host-profile?field=refreshments">
                                                            Edit
                                                        </Link>
                                                    )
                                                }
                                                placement="bottom"
                                                arrow
                                            >
                                                <RestaurantTwoToneIcon
                                                    sx={{
                                                        margin: '0 8px 4px 0',
                                                    }}
                                                ></RestaurantTwoToneIcon>
                                            </Tooltip>
                                            {`${theHost.firstName} is planning to have: `}
                                            {theOffer.refreshments.map(
                                                (refreshment, key) => (
                                                    <Chip
                                                        key={key}
                                                        label={refreshment}
                                                        size="small"
                                                        sx={{ margin: '0' }}
                                                    ></Chip>
                                                )
                                            )}
                                        </Typography>
                                    </Grid>
                                )}
                            {theOffer.overnight && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    theHost.firstName +
                                                    ' offered to accommodate ' +
                                                    (theEvent
                                                        .travelingCompanions
                                                        .length +
                                                        1) +
                                                    ' people overnight.'
                                                ) : (
                                                    <Link to="/edit-host-profile?field=overnight">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <LocalHotelTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></LocalHotelTwoToneIcon>
                                        </Tooltip>
                                        {`${
                                            theHost.firstName
                                        } offered to accommodate ${
                                            theEvent.travelingCompanions
                                                .length + 1
                                        } people overnight${
                                            theOffer.overnightArrangements
                                                ? ', saying, “I’d like to offer ' +
                                                  theOffer.overnightArrangements +
                                                  '”'
                                                : '.'
                                        }`}
                                    </Typography>
                                </Grid>
                            )}
                            {theOffer.houseRules && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    theHost.firstName +
                                                    ' has these rules: ' +
                                                    theOffer.houseRules
                                                ) : (
                                                    <Link to="/edit-host-profile?field=overnight">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <GavelTwoToneIcon
                                                sx={{ marginRight: '8px' }}
                                            ></GavelTwoToneIcon>
                                        </Tooltip>
                                        {theHost.firstName +
                                            ' has these rules: ' +
                                            theOffer.houseRules}
                                    </Typography>
                                </Grid>
                            )}

                            {theOffer &&
                            theOffer.guaranteeHonorarium === 'honorarium' &&
                            theOffer.honorariumAmount ? (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <VolunteerActivismTwoToneIcon
                                            sx={{ marginRight: '8px' }}
                                        ></VolunteerActivismTwoToneIcon>
                                        {`${theHost.firstName} is generously offering you an honorarium of $${theOffer.honorariumAmount}, no matter how much money you make otherwise.`}
                                    </Typography>
                                </Grid>
                            ) : theOffer &&
                              theOffer.guaranteeHonorarium === 'guarantee' ? (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Typography component="h3">
                                        <PriceCheckTwoToneIcon
                                            sx={{ marginRight: '8px' }}
                                        ></PriceCheckTwoToneIcon>
                                        {`${theHost.firstName} is willing to guarantee that you make at least $${theEvent.financialHopes}—making up the difference after all your ${theEvent.costStructure}s, tips, and merch sales have been counted up.`}
                                    </Typography>
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    </Grid>
                </Tooltip>
            </Grid>
            {theEvent &&
                theOffer &&
                theEvent.status !== 'CONFIRMED' &&
                user &&
                ((theEvent.artistUser && user._id === theEvent.artistUser) ||
                    (theEvent.profile &&
                        user.email === theEvent.profile.email)) && ( //make sure the logged-in user is the artist (mostly for when booking coordinators are looking at this)
                    <>
                        <Typography
                            component="h2"
                            sx={{ textAlign: 'center', marginTop: '8px' }}
                        >
                            Would you like to accept this offer to have your
                            show at {theHost.firstName} {theHost.lastName}’s{' '}
                            {theHost.primarySpace} in{' '}
                            {theHost.primarySpace === 'residence'
                                ? toTitleCase(theHost.city) +
                                  ', ' +
                                  theHost.state
                                : toTitleCase(theHost.venueCity) +
                                  ', ' +
                                  theHost.venueState}{' '}
                            on{' '}
                            {new Date(theEvent.bookingWhen).toLocaleDateString(
                                undefined,
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                            ?
                        </Typography>
                        <Typography
                            component="p"
                            sx={{ textAlign: 'center', marginTop: '8px' }}
                        >
                            <em>
                                Accepting this offer will immediately send a
                                notification to {theHost.firstName}{' '}
                                {theHost.lastName}, and anyone else who might
                                need to know.
                            </em>
                        </Typography>
                        <Grid
                            item
                            container
                            justifyContent="center"
                            sx={{ marginTop: '16px' }}
                        >
                            <Button
                                btnwidth="240"
                                onClick={(e) => {
                                    artistAcceptOffer(
                                        theEvent.bookingWhen,
                                        theOffer
                                    );
                                    eventDetailsDialogHandleClose();
                                }}
                            >
                                <HowToRegTwoToneIcon
                                    sx={{ marginRight: '8px' }}
                                ></HowToRegTwoToneIcon>{' '}
                                Accept This Offer
                            </Button>
                        </Grid>
                    </>
                )}
        </>
    );
};

HostProfile.propTypes = {
    user: PropTypes.object.isRequired,
    theHost: PropTypes.object.isRequired,
    theOffer: PropTypes.object,
    theEvent: PropTypes.object,
    eventDetailsDialogHandleClose: PropTypes.func,
    artistAcceptOffer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps, { artistAcceptOffer })(
    withRouter(HostProfile)
); //withRouter allows us to pass history objects
