import React, { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import AddHostEvent from '../events/AddHostEvent';
import AddArtistEvent from '../events/AddArtistEvent';
import EditArtistEvent from '../events/EditArtistEvent';
import HostDashboardEventCard from '../events/HostDashboardEventCard';
import HostAdminActiveFalse from '../hosts/HostAdminActiveFalse';
import PastArtistEvents from './PastArtistEvents';
import PastHostEvents from './PastHostEvents';

import {
    getMyArtistEventsOffers,
    getEventsNearMeToHost,
} from '../../actions/event';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

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
    getEventsNearMeToHost,
    getMyArtistEventsOffers,
}) => {
    // useEffect(() => {
    //     getCurrentProfile();
    // }, [getCurrentProfile]);

    // moved the following to NearMeToHostEventCard.js
    // let query = useQuery();
    // const eventID = query.get('eventID');
    // let elementToScrollTo = document.getElementById(eventID);
    // useEffect(() => {
    //     elementToScrollTo = document.getElementById(eventID);
    // }, [eventID]);
    // useEffect(() => {
    //     if (eventID && elementToScrollTo) {
    //         elementToScrollTo.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'center',
    //         });
    //     }
    // }, [elementToScrollTo]);

    const confirmedMy = (thisEvent) =>
        thisEvent.createdBy !== 'HOST' &&
        thisEvent.confirmedHost &&
        host.me &&
        host.me._id &&
        thisEvent.confirmedHost === host.me._id
            ? true
            : false;

    const iDeclined = (thisEvent) =>
        artist.me &&
        (!thisEvent.declinedArtists ||
            thisEvent.declinedArtists.filter((declinedArtist) => {
                return declinedArtist.artist === artist.me._id;
            }).length <= 0)
            ? false
            : true;
    const iConfirmed = (thisEvent) => {
        // console.log(
        //     thisEvent.bookingWhen,
        //     'iConfirmed = ',
        //     artist.me &&
        //         thisEvent.confirmedArtist &&
        //         thisEvent.confirmedArtist === artist.me._id
        //         ? true
        //         : false
        // );
        return (artist &&
            artist.me &&
            thisEvent &&
            thisEvent.confirmedArtist &&
            thisEvent.confirmedArtist === artist.me._id) ||
            (artist &&
                artist.me &&
                thisEvent &&
                thisEvent.artist &&
                thisEvent.artist === artist.me._id)
            ? true
            : false;
    };
    useEffect(() => {
        if (
            user &&
            user.role &&
            Array.isArray(user.role) &&
            user.role.indexOf('ARTIST') > -1
        ) {
            getCurrentArtist();
            getMyArtistEventsOffers();
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
            getEventsNearMeToHost();
            if (app.profileHat === '') {
                changeHats('HOST');
            }
        }
    }, [getCurrentHost, user]);

    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    console.log('dayBeforeYesterday', dayBeforeYesterday);

    const isFuture = (bookingWhen) => {
        if (new Date(bookingWhen) >= dayBeforeYesterday) {
            // console.log(
            //     'new Date(bookingWhen) is greater than dayBeforeYesterday',
            //     new Date(bookingWhen),
            //     'dayBeforeYesterday',
            //     dayBeforeYesterday
            // );
            return true;
        } else {
            // console.log(
            //     'new Date(bookingWhen) is less than dayBeforeYesterday',
            //     new Date(bookingWhen),
            //     'dayBeforeYesterday',
            //     dayBeforeYesterday
            // );
            return false;
        }
    };

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
                                    : 'For now, we’ll notify you about once a month about upcoming Porchlight events and opportunities. Soon, you’ll be able to view upcoming local Porchlight events right on your dashboard. If you ever decide you’d like to host a Porchlight event, just sign up to host below!'}
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
                    {user &&
                        user.role &&
                        user.role.indexOf('ATTENDER') != -1 && (
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
                                {' '}
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto',
                                    }}
                                >
                                    <a
                                        target="_blank"
                                        href="https://docs.google.com/document/d/10jINNrRtF1UCXpXnNS21b2riUUJAfnTBDfPG61bZSsk/edit?usp=sharing"
                                    >
                                        <Button btnwidth="250" className="">
                                            <MenuBookTwoToneIcon /> Hosting
                                            Guide
                                        </Button>
                                    </a>
                                </Grid>
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
                            sx={{ padding: { xs: '0', md: '0 20px' } }}
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
                                        (myEvent) =>
                                            (!myEvent.confirmedHost ||
                                                (myEvent.createdBy === 'HOST' &&
                                                    myEvent.status ===
                                                        'PENDING')) &&
                                            myEvent.offersFromHosts &&
                                            myEvent.offersFromHosts.length > 0
                                    ).length > 0 && (
                                        <Grid
                                            container
                                            direction="column"
                                            sx={{ marginBottom: '20px' }}
                                        >
                                            <Grid item>
                                                <Typography component="h2">
                                                    {myArtistEvents.filter(
                                                        (myEvent) =>
                                                            (!myEvent.confirmedHost ||
                                                                (myEvent.createdBy ===
                                                                    'HOST' &&
                                                                    myEvent.status ===
                                                                        'PENDING')) &&
                                                            myEvent.offersFromHosts &&
                                                            myEvent
                                                                .offersFromHosts
                                                                .length > 0
                                                    ).length > 1
                                                        ? `These ${
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      (!myEvent.confirmedHost ||
                                                                          (myEvent.createdBy ===
                                                                              'HOST' &&
                                                                              myEvent.status ===
                                                                                  'PENDING')) &&
                                                                      myEvent.offersFromHosts &&
                                                                      myEvent
                                                                          .offersFromHosts
                                                                          .length >
                                                                          0
                                                              ).length
                                                          } concerts have booking offers for you to consider`
                                                        : `This concert has ${
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      (!myEvent.confirmedHost ||
                                                                          (myEvent.createdBy ===
                                                                              'HOST' &&
                                                                              myEvent.status ===
                                                                                  'PENDING')) &&
                                                                      myEvent.offersFromHosts &&
                                                                      myEvent
                                                                          .offersFromHosts
                                                                          .length >
                                                                          0
                                                              )[0] &&
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      (!myEvent.confirmedHost ||
                                                                          (myEvent.createdBy ===
                                                                              'HOST' &&
                                                                              myEvent.status ===
                                                                                  'PENDING')) &&
                                                                      myEvent.offersFromHosts &&
                                                                      myEvent
                                                                          .offersFromHosts
                                                                          .length >
                                                                          0
                                                              )[0]
                                                                  .offersFromHosts &&
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      (!myEvent.confirmedHost ||
                                                                          (myEvent.createdBy ===
                                                                              'HOST' &&
                                                                              myEvent.status ===
                                                                                  'PENDING')) &&
                                                                      myEvent.offersFromHosts &&
                                                                      myEvent
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
                                                .filter((myEvent) => {
                                                    return (
                                                        (!myEvent.confirmedHost ||
                                                            (myEvent.createdBy ===
                                                                'HOST' &&
                                                                myEvent.status ===
                                                                    'PENDING')) &&
                                                        myEvent.offersFromHosts &&
                                                        myEvent.offersFromHosts
                                                            .length > 0
                                                    );
                                                }) //.filter(e => e) to remove any null values
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                key={idx}
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
                                        (myEvent) =>
                                            myEvent.confirmedHost &&
                                            myEvent.status === 'CONFIRMED' &&
                                            iConfirmed(myEvent) &&
                                            new Date(myEvent.bookingWhen) >
                                                dayBeforeYesterday
                                    ).length > 0 && (
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
                                                            iConfirmed(
                                                                myEvent
                                                            ) &&
                                                            new Date(
                                                                myEvent.bookingWhen
                                                            ) >
                                                                dayBeforeYesterday
                                                    ).length > 1
                                                        ? `You booked these ${
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      myEvent.confirmedHost &&
                                                                      iConfirmed(
                                                                          myEvent
                                                                      ) &&
                                                                      new Date(
                                                                          myEvent.bookingWhen
                                                                      ) >
                                                                          dayBeforeYesterday
                                                              ).length
                                                          } upcoming concerts`
                                                        : `You booked this upcoming concert`}
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
                                                        myEvent.status ===
                                                            'CONFIRMED' &&
                                                        iConfirmed(myEvent) &&
                                                        new Date(
                                                            myEvent.bookingWhen
                                                        ) > dayBeforeYesterday
                                                )
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                key={idx}
                                                                thisEvent={
                                                                    thisEvent
                                                                }
                                                            />
                                                        )
                                                )}
                                        </Grid>
                                    )}
                                {/* Confirmed by other artist concerts */}
                                {myArtistEvents &&
                                    myArtistEvents.length > 0 &&
                                    myArtistEvents.filter(
                                        (myEvent) =>
                                            myEvent.confirmedHost &&
                                            myEvent.status === 'CONFIRMED' &&
                                            !iConfirmed(myEvent) &&
                                            new Date(myEvent.bookingWhen) >
                                                dayBeforeYesterday
                                    ).length > 0 && (
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
                                                            !iConfirmed(
                                                                myEvent
                                                            ) &&
                                                            new Date(
                                                                myEvent.bookingWhen
                                                            ) >
                                                                dayBeforeYesterday
                                                    ).length > 1
                                                        ? `These ${
                                                              myArtistEvents.filter(
                                                                  (myEvent) =>
                                                                      myEvent.confirmedHost &&
                                                                      !iConfirmed(
                                                                          myEvent
                                                                      ) &&
                                                                      new Date(
                                                                          myEvent.bookingWhen
                                                                      ) >
                                                                          dayBeforeYesterday
                                                              ).length
                                                          } concerts were booked by another artist`
                                                        : `This concert was booked by another artist`}
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
                                                        myEvent.status ===
                                                            'CONFIRMED' &&
                                                        !iConfirmed(myEvent) &&
                                                        new Date(
                                                            myEvent.bookingWhen
                                                        ) > dayBeforeYesterday
                                                )
                                                .map(
                                                    (thisEvent, idx) =>
                                                        thisEvent.bookingWhen &&
                                                        thisEvent.bookingWhere && (
                                                            <ArtistDashboardEventCard
                                                                key={idx}
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
                                                                key={idx}
                                                                thisEvent={
                                                                    thisEvent
                                                                }
                                                            />
                                                        )
                                                )}
                                        </Grid>
                                    )}
                                <PastArtistEvents
                                    iConfirmed={iConfirmed}
                                ></PastArtistEvents>
                                <Grid item sx={{ margin: '0 auto' }}>
                                    <AddArtistEvent
                                        iConfirmed={iConfirmed}
                                    ></AddArtistEvent>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                {app.profileHat === 'HOST' &&
                    user &&
                    user.role &&
                    user.role.indexOf('HOST') != -1 && (
                        // ((myHostEvents && myHostEvents.length > 0) ||
                        //     //(user.role.indexOf('ADMIN') > -1 ||
                        //     //user.role.indexOf('BOOKING') > -1 ||
                        //     //user.role.indexOf('TESTING') > -1) &&
                        //     (nearMeToHost && nearMeToHost.length > 0)) &&
                        <Grid
                            item
                            container
                            direction="column"
                            className="middle"
                            md={6}
                            sx={{ padding: { xs: '0', md: '0 20px' } }}
                        >
                            {myHostEvents &&
                                myHostEvents.length > 0 &&
                                myHostEvents.filter(
                                    (myEvent) =>
                                        myEvent.confirmedHost &&
                                        myEvent.status === 'CONFIRMED' &&
                                        isFuture(myEvent.bookingWhen)
                                    // &&
                                    // new Date(myEvent.bookingWhen) <=
                                    //     dayBeforeYesterday
                                ).length > 0 && (
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
                                                {myHostEvents.filter(
                                                    (myEvent) =>
                                                        myEvent.confirmedHost &&
                                                        myEvent.status ===
                                                            'CONFIRMED' &&
                                                        new Date(
                                                            myEvent.bookingWhen
                                                        ) <= dayBeforeYesterday
                                                ).length > 1
                                                    ? `these ${
                                                          myHostEvents.filter(
                                                              (myEvent) =>
                                                                  myEvent.confirmedHost &&
                                                                  myEvent.status ===
                                                                      'CONFIRMED' &&
                                                                  new Date(
                                                                      myEvent.bookingWhen
                                                                  ) <=
                                                                      dayBeforeYesterday
                                                          ).length
                                                      } shows`
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
                                            .filter((e) => e) //.filter(e => e) to remove any null values
                                            .map(
                                                (
                                                    thisEvent,
                                                    idx,
                                                    whenWhereOrig
                                                ) =>
                                                    thisEvent.bookingWhen &&
                                                    thisEvent.bookingWhere &&
                                                    new Date(
                                                        thisEvent.bookingWhen
                                                    ) > dayBeforeYesterday && (
                                                        <HostDashboardEventCard
                                                            key={idx}
                                                            thisEvent={
                                                                thisEvent
                                                            }
                                                        ></HostDashboardEventCard>
                                                    )
                                            )}
                                    </Grid>
                                )}
                            <PastHostEvents
                                iConfirmed={iConfirmed}
                            ></PastHostEvents>
                            {/* End myHostEvents */}
                            {Array.isArray(user.role) &&
                                user.role.indexOf('HOST') != -1 &&
                                host.me &&
                                host.me.adminActive && (
                                    <Grid item sx={{ margin: '0 auto' }}>
                                        <AddHostEvent></AddHostEvent>
                                    </Grid>
                                )}
                            {host && host.me && host.me.adminActive != true && (
                                <Grid
                                    className="adminActiveFalse"
                                    container
                                    sx={{ marginBottom: '16px' }}
                                >
                                    <HostAdminActiveFalse></HostAdminActiveFalse>
                                </Grid>
                            )}
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
                                            .filter((e) => e) //.filter(e => e) to remove any null values
                                            .map(
                                                (
                                                    thisEvent,
                                                    idx,
                                                    whenWhereOrig
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
    getEventsNearMeToHost,
    getMyArtistEventsOffers,
})(Dashboard);
