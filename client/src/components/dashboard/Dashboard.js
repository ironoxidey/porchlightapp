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
import { Grid, Typography, Box } from '@mui/material';
import Button from '../layout/SvgButton';

import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import ChangeCircleTwoToneIcon from '@mui/icons-material/ChangeCircleTwoTone';

import { StackDateforDisplay, changeHats } from '../../actions/app';
import ArtistDashboardEventCard from '../events/ArtistDashboardEventCard';
import NearMeToHostEventCard from './NearMeToHostEventCard';

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
                                Welcome to your Dashboard
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
                            <p className="">
                                We have some big ideas for connecting artists
                                with hosts to grow community culture around the
                                arts again.
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
                                        <ChangeCircleTwoToneIcon></ChangeCircleTwoToneIcon>{' '}
                                        Change to{' '}
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
                            {(artist.me &&
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
                            )}
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
                    myArtistEvents &&
                    myArtistEvents.length > 0 && (
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
                                {((artist.me &&
                                    artist.me._id &&
                                    artist.me.active &&
                                    artist.me.bookingWhen.length > 0 &&
                                    myArtistEvents &&
                                    myArtistEvents.length > 0) ||
                                    (Array.isArray(user.role) &&
                                        user.role.indexOf('ARTIST') != -1 &&
                                        user.role.indexOf('ADMIN') != -1 &&
                                        artist.me &&
                                        artist.me._id &&
                                        myArtistEvents &&
                                        myArtistEvents.length > 0)) && (
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Typography component="h2">
                                                {myArtistEvents.length > 1
                                                    ? `These ${myArtistEvents.length} concerts have booking offers for you to consider`
                                                    : `This concert has ${
                                                          myArtistEvents[0]
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
                                            .filter((e) => e) //.filter(e => e) to remove any null values
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
                            </Grid>
                        </Grid>
                    )}

                {app.profileHat === 'HOST' &&
                    user &&
                    user.role &&
                    user.role.indexOf('HOST') != -1 &&
                    ((myHostEvents && myHostEvents.length > 0) ||
                        ((user.role.indexOf('ADMIN') > -1 ||
                            user.role.indexOf('BOOKING') > -1 ||
                            user.role.indexOf('TESTING') > -1) &&
                            nearMeToHost &&
                            nearMeToHost.length > 0)) && (
                        <Grid
                            item
                            container
                            direction="column"
                            className="middle"
                            md={6}
                            sx={{ padding: '0 20px' }}
                        >
                            {myHostEvents && myHostEvents.length > 0 && (
                                <Grid item direction="column" xs={12} md={12}>
                                    <Grid item xs={12}>
                                        <Typography component="h2">
                                            You have offered to host{' '}
                                            {myHostEvents.length > 1
                                                ? `these ${myHostEvents.length} shows`
                                                : `this ${myHostEvents.length} show`}
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
                                                                    backgroundImage: `url("${thisEvent.artist.squareImg}")`,
                                                                    backgroundPosition:
                                                                        '50% 25%',
                                                                    backgroundSize:
                                                                        'cover',
                                                                    padding:
                                                                        '4px',
                                                                    backgroundClip:
                                                                        'content-box',
                                                                    border: '1px solid var(--primary-color)',
                                                                    margin: '0 8px 0 0',
                                                                }}
                                                            ></Box>
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
                                                                        thisEvent
                                                                            .artist
                                                                            .slug
                                                                    }
                                                                >
                                                                    <Typography component="h2">
                                                                        {
                                                                            thisEvent
                                                                                .artist
                                                                                .stageName
                                                                        }
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
                                                    </Grid>
                                                )
                                        )}
                                </Grid>
                            )}
                            {/* End myHostEvents */}
                            {(user.role.indexOf('ADMIN') > -1 ||
                                user.role.indexOf('BOOKING') > -1 ||
                                user.role.indexOf('TESTING') > -1) &&
                                nearMeToHost &&
                                nearMeToHost.length > 0 && (
                                    <Grid
                                        item
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
                                )}
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
