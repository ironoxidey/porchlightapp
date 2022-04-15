import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
//import Experience from './Experience';
import Education from './Education';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import { getCurrentArtist } from '../../actions/artist';
import { getCurrentHost } from '../../actions/host';
import { Grid, Typography, Box } from '@mui/material';
import Button from '../layout/SvgButton';

import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import { StackDateforDisplay } from '../../actions/app';
import ArtistDashboardEventCard from '../events/ArtistDashboardEventCard';

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading },
    event: { myHostEvents, myArtistEvents },
    getCurrentArtist,
    artist,
    getCurrentHost,
    host,
}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    useEffect(() => {
        getCurrentArtist();
    }, [getCurrentArtist, user]);
    useEffect(() => {
        getCurrentHost();
    }, [getCurrentHost, user]);
    return loading && profile === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                sx={{
                    minHeight: '80vh',
                    padding: '20px!important',
                    maxWidth: 550,
                    margin: '0 auto',
                }}
            >
                <Grid item container>
                    <Grid item textAlign="center">
                        <h1 className="large text-primary">
                            Welcome to your Dashboard
                            {user && user.name
                                ? ', ' + user.name.split(' ')[0] + '!'
                                : '!'}
                        </h1>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            margin: '8px auto',
                        }}
                    >
                        <p className="">
                            We have some big ideas for connecting artists with
                            hosts to grow community culture around the arts
                            again.
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
                    {user && user.role && user.role.indexOf('ARTIST') != -1 ? (
                        <Grid item container>
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
                                            <Button btnwidth="300" className="">
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
                                            <Button btnwidth="300" className="">
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
                                            <Button btnwidth="300" className="">
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
                                        <Button btnwidth="300" className="">
                                            <DateRangeTwoToneIcon /> Edit My
                                            Booking Info
                                        </Button>
                                    </Link>
                                    {myArtistEvents &&
                                        myArtistEvents.length > 0 && (
                                            <Grid
                                                item
                                                direction="column"
                                                xs={12}
                                                md={12}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography component="h2">
                                                        {myArtistEvents.length >
                                                        1
                                                            ? `These ${myArtistEvents.length} shows have booking offers for you to consider`
                                                            : `This ${myArtistEvents.length} show has booking offers for you to consider`}
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
                                                    xs={12}
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
                                        <Button className="">
                                            Start Booking Shows
                                        </Button>
                                    </Link>
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    ) : (
                        <Fragment></Fragment>
                    )}

                    {user &&
                    user.role &&
                    user.role.indexOf('ATTENDER') != -1 ? (
                        <Grid item container>
                            {user.role.indexOf('HOST') === -1 ? (
                                <Grid
                                    item
                                    sx={{
                                        margin: '8px auto',
                                    }}
                                >
                                    <p> </p>
                                    <Link to="/edit-host-profile">
                                        <Button btnwidth="300" className="">
                                            <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
                                            Sign Up to Host
                                        </Button>
                                    </Link>
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    ) : (
                        ''
                    )}
                    {user && user.role && user.role.indexOf('HOST') != -1 ? (
                        <Grid item container>
                            <Grid
                                item
                                sx={{
                                    margin: '8px auto',
                                }}
                            >
                                <p> </p>
                                <Link to="/edit-host-profile">
                                    <Button btnwidth="300" className="">
                                        <EditTwoToneIcon />
                                        Edit My Host Profile
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    ) : (
                        ''
                    )}

                    {user &&
                        user.role &&
                        user.role.indexOf('HOST') != -1 &&
                        myHostEvents &&
                        myHostEvents.length > 0 && (
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
                                    xs={12}
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
                                                                padding: '4px',
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
                                                        <Grid item container>
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
                                                            sx={{
                                                                width: '55px',
                                                            }}
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
                </Grid>
            </Grid>
        </Fragment>
    );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    //getCurrentArist: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    artist: PropTypes.object.isRequired,
    host: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
    artist: state.artist,
    host: state.host,
    event: state.event,
});

export default connect(mapStateToProps, {
    getCurrentProfile,
    getCurrentArtist,
    getCurrentHost,
    deleteAccount,
})(Dashboard);
