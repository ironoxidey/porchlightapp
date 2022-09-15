import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
//import Experience from './Experience';
import Education from './Education';
import { deleteAccount /* getCurrentProfile */ } from '../../actions/profile';
import { getCurrentArtist } from '../../actions/artist';
import { getCurrentHost } from '../../actions/host';
import { Grid, Typography, Box, Tooltip } from '@mui/material';
import Button from '../layout/SvgButton';

import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
//import ChangeCircleTwoToneIcon from '@mui/icons-material/ChangeCircleTwoTone';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import { StackDateforDisplay, changeHats } from '../../actions/app';
import ArtistDashboardEventCard from '../events/ArtistDashboardEventCard';
import NearMeToHostEventCard from './NearMeToHostEventCard';
import AddArtistEvent from '../events/AddArtistEvent';
import EditArtistEvent from '../events/EditArtistEvent';

const Dashboard = ({
    //getCurrentProfile,
    changeHats,
    deleteAccount,
    auth: { user, loading },
    //profile: { profile, loading },
    event: { myHostEvents, myArtistEvents, nearMeToHost },
    getCurrentArtist,
    artist,
    getCurrentHost,
    host,
    app,
}) => {
    // useEffect(() => {
    //     getCurrentProfile();
    // }, [getCurrentProfile]);
    const confirmedMy = (thisEvent) =>
        thisEvent.createdBy !== 'HOST' &&
        thisEvent.confirmedHost &&
        host.me &&
        host.me._id &&
        thisEvent.confirmedHost === host.me._id
            ? true
            : false;
    useEffect(() => {
        if (
            user &&
            user.role &&
            Array.isArray(user.role) &&
            user.role.indexOf('ARTIST') > -1
        ) {
            getCurrentArtist();
            if (app.profileHat === '') {
                changeHats('ARTIST');
            }
        }
    }, [getCurrentArtist, user]);
    useEffect(() => {
        if (
            user &&
            user.role &&
            Array.isArray(user.role) &&
            user.role.indexOf('HOST') > -1
        ) {
            getCurrentHost();
            if (app.profileHat === '') {
                changeHats('HOST');
            }
        }
    }, [getCurrentHost, user]);
    return loading && user === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Grid
                container
                justifyContent="center"
                alignItems="start"
                direction="row"
                sx={{
                    minHeight: '80vh',
                    padding: '20px!important',
                    width: '100vw',
                    maxWidth: '100vw',
                    margin: '0 auto',
                }}
            >
                <Grid
                    item
                    container
                    direction="column"
                    className="leftSide"
                    md={3}
                >
                    <Grid
                        item
                        container
                        direction="column"
                        className="welcomeSection"
                    >
                        <Grid item textAlign="center">
                            <Typography component="h2">
                                Welcome to your Porchlight Dashboard
                                {user && user.name
                                    ? ', ' + user.name.split(' ')[0] + '!'
                                    : '!'}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            sx={{
                                margin: '8px auto',
                            }}
                        >
                            <p className="welcomeNote">
                                {app.profileHat === 'ARTIST'
                                    ? 'We’re excited to connect you to our growing network of amazing hosts. Make sure you check out the musician guide (below). Thanks for joining us in this mission to  curate profound experiences and relationships around the true and beautiful.'
                                    : app.profileHat === 'HOST'
                                    ? 'We’re honored to serve you as you host profound experiences and develop relationships around the true and beautiful.'
                                    : 'We’re eager to notify you concerning Porchlight events happening in your area. Also, if you ever decide you’d like to host a Porchlight event, just sign up to host below!'}
                            </p>
                        </Grid>

                        {/* CALENDLY STUFF
      <Fragment>
          <DashboardActions></DashboardActions>
      </Fragment> */}
                        {/* {profile !== null ? (
				<Fragment>
					<Experience experience={profile.experience}></Experience>
					<Education education={profile.education}></Education>
					<div className='my-2'>
						<button className='btn btn-danger' onClick={() => deleteAccount()}>
							<i className='fas fa-user-minus'>Delete my account</i>
						</button>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<p> You have not yet setup a profile, please add some info</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create Profile
					</Link>
				</Fragment>
			)} */}
                    </Grid>
                    {user &&
                        user.role &&
                        user.role.indexOf('ARTIST') != -1 &&
                        user.role.indexOf('HOST') != -1 && (
                            <Grid item container className="changeProfileHat">
                                <Typography component={'p'}>
                                    It looks like you’re an artist and a host!
                                    That’s awesome! Right now you’re seeing your{' '}
                                    {app.profileHat} stuff. Change your hat to
                                    see your{' '}
                                    {app.profileHat === 'HOST'
                                        ? 'ARTIST'
                                        : 'HOST'}{' '}
                                    stuff.
                                </Typography>
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto 8px',
                                    }}
                                >
                                    <Button
                                        btnwidth="250"
                                        onClick={() => {
                                            app.profileHat === 'HOST'
                                                ? changeHats('ARTIST')
                                                : changeHats('HOST');
                                        }}
                                    >
                                        <CachedTwoToneIcon></CachedTwoToneIcon>{' '}
                                        Put on my{' '}
                                        {app.profileHat === 'HOST'
                                            ? 'ARTIST'
                                            : 'HOST'}{' '}
                                        Hat
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    {app.profileHat === 'ARTIST' &&
                    user &&
                    user.role &&
                    user.role.indexOf('ARTIST') != -1 ? (
                        <Grid item container className="artistStuff">
                            {artist.me && artist.me._id ? (
                                [
                                    <Grid
                                        item
                                        sx={{
                                            margin: '8px auto',
                                        }}
                                    >
                                        <a
                                            target="_blank"
                                            href="https://docs.google.com/document/d/1skxIQjIhEOs07k06ymmss1lMO-Q9Q4j8kI68Vc0u5hE/edit?usp=sharing"
                                        >
                                            <Button btnwidth="250" className="">
                                                <MenuBookTwoToneIcon /> Musician
                                                Guide
                                            </Button>
                                        </a>
                                    </Grid>,
                                    <Grid
                                        item
                                        sx={{
                                            margin: '8px auto',
                                        }}
                                    >
                                        <Link to="/edit-artist-profile">
                                            <Button btnwidth="250" className="">
                                                <EditTwoToneIcon /> Edit My
                                                Artist Profile
                                            </Button>
                                        </Link>
                                    </Grid>,
                                ]
                            ) : (
                                <Fragment>
                                    <Grid
                                        item
                                        sx={{
                                            margin: '8px auto',
                                        }}
                                    >
                                        <p className="">
                                            Please make sure the information in
                                            your profile is always accurate and
                                            up-to-date. Your answers help us
                                            connect you with folks who want to
                                            host shows in their spaces.
                                        </p>
                                    </Grid>

                                    <Grid
                                        item
                                        sx={{
                                            margin: '8px auto',
                                        }}
                                    >
                                        <p> </p>
                                        <Link to="/edit-artist-profile">
                                            <Button btnwidth="250" className="">
                                                <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
                                                Create My Profile
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Fragment>
                            )}
                            {/* {(artist.me &&
                                artist.me._id &&
                                artist.me.active &&
                                artist.me.bookingWhen.length > 0) ||
                            (Array.isArray(user.role) &&
                                user.role.indexOf('ARTIST') != -1 &&
                                user.role.indexOf('ADMIN') != -1 &&
                                artist.me &&
                                artist.me._id) ? (
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto',
                                    }}
                                >
                                    <Link to="/edit-artist-booking">
                                        <Button btnwidth="250" className="">
                                            <DateRangeTwoToneIcon /> Edit My
                                            Booking Info
                                        </Button>
                                    </Link>
                                </Grid>
                            ) : artist.me &&
                              artist.me._id &&
                              artist.me.active ? (
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto',
                                    }}
                                >
                                    <p> </p>
                                    <Link to="/edit-artist-booking">
                                        <Button btnwidth="250" className="">
                                            Start Booking Shows
                                        </Button>
                                    </Link>
                                </Grid>
                            ) : (
                                ''
                            )} */}
                        </Grid>
                    ) : (
                        <></>
                    )}
                    {user && user.role && user.role.indexOf('ATTENDER') != -1 && (
                        <Grid item container className="attenderStuff">
                            {user.role.indexOf('HOST') === -1 ? (
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto',
                                    }}
                                >
                                    <p> </p>
                                    <Link to="/edit-host-profile">
                                        <Button btnwidth="250" className="">
                                            <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
                                            Sign Up to Host
                                        </Button>
                                    </Link>
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    )}
                    {app.profileHat === 'HOST' &&
                        user &&
                        user.role &&
                        user.role.indexOf('HOST') != -1 && (
                            <>
                                <Grid item container className="hostStuff">
                                    <Grid
                                        item
                                        sx={{
                                            margin: '8px auto',
                                        }}
                                    >
                                        <p> </p>
                                        <Link to="/edit-host-profile">
                                            <Button btnwidth="250" className="">
                                                <EditTwoToneIcon />
                                                Edit My Host Profile
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    {/* End welcomeSection */}
                </Grid>
                {/* End leftSide */}
                {/* {user &&
                    user.role &&
                    (user.role.indexOf('ARTIST') != -1 ||
                        user.role.indexOf('HOST') != -1 ||
                        user.role.indexOf('ADMIN') != -1 ||
                        user.role.indexOf('BOOKING') != -1) && ( */}
                {/* <Grid
                    item
                    container
                    direction="column"
                    className="middle"
                    md={6}
                    sx={{ padding: '0 20px' }}
                > */}
                {app.profileHat === 'ARTIST' &&
                    user &&
                    user.role &&
                    user.role.indexOf('ARTIST') != -1 &&
                    artist.me &&
                    artist.me._id &&
                    (artist.me.active ||
                        (Array.isArray(user.role) &&
                            user.role.indexOf('ARTIST') != -1 &&
                            (user.role.indexOf('ADMIN') != -1 ||
                                user.role.indexOf('TESTING') != -1))) && (
                        <Grid
                            item
                            container
                            direction="column"
                            className="middle"
                            md={6}
                            xs={12}
                            sx={{ padding: '0 20px' }}
                        >
                            <Grid
                                item
                                container
                                className="artistStuff"
                                xs={12}
                                direction="column"
                            >
                                {/* Offers to consider */}
                                {myArtistEvents &&
                                    myArtistEvents.length > 0 &&
                                    myArtistEvents.filter(
                                        (event) =>
                                            !event.confirmedHost &&
                                            event.offersFromHosts &&
                                            event.offersFromHosts.length > 0
                                    ).length > 0 && (
                                        <Grid
                                            container
                                            direction="column"
                                            sx={{ marginBottom: '20px' }}
                                        >
                                            <Grid item>
                                                <Typography component="h2">
                                                    {myArtistEvents.filter(
                                                        (event) =>
                                                            !event.confirmedHost &&
                                                            event.offersFromHosts &&
                                                            event
                                                                .offersFromHosts
                                                                .length > 0
                                                    ).length > 1
                                                        ? `These ${
                                                              myArtistEvents.filter(
                                                                  (event) =>
                                                                      !event.confirmedHost &&
                                                                      event.offersFromHosts &&
                                                                      event
                                                                          .offersFromHosts
                                                                          .length >
                                                                          0
                                                              ).length
                                                          } concerts have booking offers for you to consider`
                                                        : `This concert has ${
                                                              myArtistEvents.filter(
                                                                  (event) =>
                                                                      !event.confirmedHost &&
                                                                      event.offersFromHosts &&
                                                                      event
                                                                          .offersFromHosts
                                                                          .length >
                                                                          0
                                                              )[0]
                                                                  .offersFromHosts
                                                                  .length > 1
                                                                  ? 'booking offers'
                                                                  : 'a booking offer'
                                                          } for you to consider`}
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
                                                    (event) =>
                                                        !event.confirmedHost &&
                                                        event.offersFromHosts &&
                                                        event.offersFromHosts
                                                            .length > 0
                                                ) //.filter(e => e) to remove any null values
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                thisEvent={
                                                                    thisEvent
                                                                }
                                                            />
                                                        )
                                                )}
                                        </Grid>
                                    )}
                                {/* Confirmed Concerts */}
                                {myArtistEvents &&
                                    myArtistEvents.length > 0 &&
                                    myArtistEvents.filter(
                                        (event) => event.confirmedHost
                                    ).length > 0 && (
                                        <Grid
                                            container
                                            direction="column"
                                            sx={{ marginBottom: '20px' }}
                                        >
                                            <Grid item>
                                                <Typography component="h2">
                                                    {myArtistEvents.filter(
                                                        (event) =>
                                                            event.confirmedHost
                                                    ).length > 1
                                                        ? `These ${
                                                              myArtistEvents.filter(
                                                                  (event) =>
                                                                      event.confirmedHost
                                                              ).length
                                                          } concerts have been confirmed`
                                                        : `This concert has been confirmed`}
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
                                                    (event) =>
                                                        event.confirmedHost
                                                )
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                thisEvent={
                                                                    thisEvent
                                                                }
                                                            />
                                                        )
                                                )}
                                        </Grid>
                                    )}
                                {/* Waiting for a host to offer */}
                                {myArtistEvents &&
                                    myArtistEvents.length > 0 &&
                                    myArtistEvents.filter(
                                        (event) =>
                                            event.offersFromHosts &&
                                            event.offersFromHosts.length === 0
                                    ).length > 0 && (
                                        <Grid
                                            container
                                            direction="column"
                                            sx={{
                                                margin: '8px auto',
                                            }}
                                        >
                                            <Grid item>
                                                <Typography component="h2">
                                                    {myArtistEvents.filter(
                                                        (event) =>
                                                            event.offersFromHosts &&
                                                            event
                                                                .offersFromHosts
                                                                .length === 0
                                                    ).length > 1
                                                        ? `These ${
                                                              myArtistEvents.filter(
                                                                  (event) =>
                                                                      event.offersFromHosts &&
                                                                      event
                                                                          .offersFromHosts
                                                                          .length ===
                                                                          0
                                                              ).length
                                                          } concerts are waiting for a host`
                                                        : `This concert is waiting for a host`}
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
                                                    (event) =>
                                                        event.offersFromHosts &&
                                                        event.offersFromHosts
                                                            .length === 0
                                                )
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                thisEvent={
                                                                    thisEvent
                                                                }
                                                            />
                                                        )
                                                )}
                                        </Grid>
                                    )}
                                <Grid item sx={{ margin: '0 auto' }}>
                                    <AddArtistEvent></AddArtistEvent>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                {app.profileHat === 'HOST' &&
                    user &&
                    user.role &&
                    user.role.indexOf('HOST') != -1 &&
                    ((myHostEvents && myHostEvents.length > 0) ||
                        //(user.role.indexOf('ADMIN') > -1 ||
                        //user.role.indexOf('BOOKING') > -1 ||
                        //user.role.indexOf('TESTING') > -1) &&
                        (nearMeToHost && nearMeToHost.length > 0)) && (
                        <Grid
                            item
                            container
                            direction="column"
                            className="middle"
                            md={6}
                            sx={{ padding: '0 20px' }}
                        >
                            {myHostEvents && myHostEvents.length > 0 && (
                                <Grid
                                    item
                                    container
                                    direction="column"
                                    xs={12}
                                    md={12}
                                >
                                    <Grid item xs={12}>
                                        <Typography component="h2">
                                            You have offered to host{' '}
                                            {myHostEvents.length > 1
                                                ? `these ${myHostEvents.length} shows`
                                                : `this show`}
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
                                        .filter((e) => e)
                                        .map(
                                            (
                                                thisEvent,
                                                idx,
                                                whenWhereOrig //.filter(e => e) to remove any null values
                                            ) =>
                                                thisEvent.bookingWhen &&
                                                thisEvent.bookingWhere && (
                                                    <Grid
                                                        container
                                                        item
                                                        className="bookingWhen"
                                                        key={`bookingWhen${idx}`}
                                                        direction="row"
                                                        sm={5.5}
                                                        xs={12}
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(0,0,0,0.35)',
                                                            '&:hover': {},
                                                            padding: '16px',
                                                            margin: '4px',
                                                            color: 'var(--light-color)',
                                                        }}
                                                    >
                                                        <Grid item>
                                                            <Tooltip
                                                                title={
                                                                    thisEvent.artist &&
                                                                    thisEvent
                                                                        .artist
                                                                        .stageName +
                                                                        ' accepted your offer.'
                                                                }
                                                                arrow={true}
                                                                placement="bottom"
                                                                disableHoverListener={
                                                                    !confirmedMy(
                                                                        thisEvent
                                                                    )
                                                                }
                                                                disableFocusListener={
                                                                    !confirmedMy(
                                                                        thisEvent
                                                                    )
                                                                }
                                                                disableTouchListener={
                                                                    !confirmedMy(
                                                                        thisEvent
                                                                    )
                                                                }
                                                            >
                                                                <Box
                                                                    className="squareImgInACircle"
                                                                    sx={{
                                                                        height: '130px',
                                                                        width: '130px',
                                                                        maxHeight:
                                                                            '130px',
                                                                        maxWidth:
                                                                            '130px',
                                                                        borderRadius:
                                                                            '50%',
                                                                        overflow:
                                                                            'hidden',
                                                                        backgroundImage: `url("${
                                                                            thisEvent.artist &&
                                                                            thisEvent
                                                                                .artist
                                                                                .squareImg
                                                                        }")`,
                                                                        backgroundPosition:
                                                                            '50% 25%',
                                                                        backgroundSize:
                                                                            'cover',
                                                                        padding:
                                                                            '4px',
                                                                        backgroundClip:
                                                                            'content-box',
                                                                        border: confirmedMy(
                                                                            thisEvent
                                                                        )
                                                                            ? '1px solid var(--link-color)'
                                                                            : '1px solid var(--primary-color)',
                                                                        margin: '0 8px 0 0',
                                                                    }}
                                                                ></Box>
                                                            </Tooltip>
                                                        </Grid>

                                                        <Grid
                                                            container
                                                            item
                                                            direction="row"
                                                            alignItems="center"
                                                            className="dateLocationForBooking"
                                                            xs={8}
                                                        >
                                                            <Grid
                                                                item
                                                                container
                                                            >
                                                                <Link
                                                                    to={
                                                                        '/artists/' +
                                                                        (thisEvent.artist &&
                                                                            thisEvent
                                                                                .artist
                                                                                .slug)
                                                                    }
                                                                >
                                                                    <Typography component="h2">
                                                                        {thisEvent.artist &&
                                                                            thisEvent
                                                                                .artist
                                                                                .stageName}
                                                                    </Typography>
                                                                </Link>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                sx={
                                                                    {
                                                                        // width: '55px',
                                                                    }
                                                                }
                                                            >
                                                                <StackDateforDisplay
                                                                    date={
                                                                        thisEvent.bookingWhen
                                                                    }
                                                                ></StackDateforDisplay>
                                                            </Grid>
                                                            <Grid item xs={8}>
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        fontSize:
                                                                            '1.5em',
                                                                        marginLeft:
                                                                            '8px',
                                                                        lineHeight:
                                                                            '1.5',
                                                                    }}
                                                                >
                                                                    {thisEvent
                                                                        .bookingWhere
                                                                        .city +
                                                                        ', ' +
                                                                        thisEvent
                                                                            .bookingWhere
                                                                            .state}
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        {confirmedMy(
                                                            thisEvent
                                                        ) ? (
                                                            <Grid
                                                                item
                                                                alignContent="center"
                                                                container
                                                                xs={0.5}
                                                            >
                                                                <Tooltip
                                                                    title={
                                                                        thisEvent
                                                                            .artist
                                                                            .stageName +
                                                                        ' accepted your offer.'
                                                                    }
                                                                    placement="bottom"
                                                                    arrow
                                                                >
                                                                    <ThumbUpAltTwoToneIcon
                                                                        sx={{
                                                                            color: 'var(--link-color)',
                                                                        }}
                                                                    ></ThumbUpAltTwoToneIcon>
                                                                </Tooltip>
                                                            </Grid>
                                                        ) : (
                                                            thisEvent.createdBy !==
                                                                'HOST' && //if this event is not created by a host
                                                            thisEvent.confirmedHost && //and if the event has a confirmedHost
                                                            !confirmedMy(
                                                                thisEvent
                                                            ) && ( //and it's not me
                                                                <Grid
                                                                    item
                                                                    alignContent="center"
                                                                    container
                                                                    xs={0.5}
                                                                >
                                                                    <Tooltip
                                                                        title={
                                                                            (thisEvent.artist &&
                                                                                thisEvent
                                                                                    .artist
                                                                                    .stageName) +
                                                                            ' accepted a different host’s offer.'
                                                                        }
                                                                        placement="bottom"
                                                                        arrow
                                                                    >
                                                                        <ThumbDownAltTwoToneIcon
                                                                            sx={{
                                                                                color: 'var(--primary-color)',
                                                                            }}
                                                                        ></ThumbDownAltTwoToneIcon>
                                                                    </Tooltip>
                                                                </Grid>
                                                            )
                                                        )}
                                                    </Grid>
                                                )
                                        )}
                                </Grid>
                            )}
                            {/* End myHostEvents */}
                            {
                                //(user.role.indexOf('ADMIN') > -1 ||
                                //user.role.indexOf('BOOKING') > -1 ||
                                //user.role.indexOf('TESTING') > -1) &&
                                nearMeToHost && nearMeToHost.length > 0 && (
                                    <Grid
                                        item
                                        container
                                        direction="column"
                                        xs={12}
                                        md={12}
                                    >
                                        <Grid item xs={12}>
                                            <Typography component="h2">
                                                {nearMeToHost.length > 1
                                                    ? `There are these ${nearMeToHost.length} potential events `
                                                    : `There is this ${nearMeToHost.length} potential event `}
                                                looking to be hosted in your
                                                area:
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
                                        {nearMeToHost
                                            .filter((e) => e)
                                            .map(
                                                (
                                                    thisEvent,
                                                    idx,
                                                    whenWhereOrig //.filter(e => e) to remove any null values
                                                ) =>
                                                    thisEvent.bookingWhen &&
                                                    thisEvent.bookingWhere && (
                                                        <NearMeToHostEventCard
                                                            thisEvent={
                                                                thisEvent
                                                            }
                                                            idx={idx}
                                                            key={idx}
                                                        ></NearMeToHostEventCard>
                                                    )
                                            )}
                                    </Grid>
                                )
                            }
                            {/* End .nearMeToHost */}
                        </Grid>
                    )}
            </Grid>
        </Fragment>
    );
};

Dashboard.propTypes = {
    //getCurrentProfile: PropTypes.func.isRequired,
    getCurrentArist: PropTypes.func,
    getCurrentHost: PropTypes.func,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    //profile: PropTypes.object.isRequired,
    artist: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    host: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    //profile: state.profile,
    artist: state.artist,
    host: state.host,
    event: state.event,
    app: state.app,
});

export default connect(mapStateToProps, {
    //getCurrentProfile,
    changeHats,
    getCurrentArtist,
    getCurrentHost,
    deleteAccount,
})(Dashboard);
