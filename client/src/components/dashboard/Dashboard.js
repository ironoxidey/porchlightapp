import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import { getCurrentArtist } from '../../actions/artist';
import { Grid } from '@mui/material';
import Button from '../layout/SvgButton';

import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading },
    getCurrentArtist,
    artist: { me },
}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    useEffect(() => {
        getCurrentArtist();
    }, [getCurrentArtist, user]);
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
                            <Grid
                                item
                                sx={{
                                    margin: '8px auto',
                                }}
                            >
                                <p className="">
                                    Please make sure the information in your
                                    profile is always accurate and up-to-date.
                                    Your answers help us connect you with folks
                                    who want to host shows in their spaces.
                                </p>
                            </Grid>
                            {me && me._id ? (
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
                                                Profile
                                            </Button>
                                        </Link>
                                    </Grid>,
                                ]
                            ) : (
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
                            )}
                            {me &&
                            me._id &&
                            me.active &&
                            me.bookingWhen.length > 0 ? (
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
                                </Grid>
                            ) : me && me._id && me.active ? (
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
                        ''
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
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
    artist: state.artist,
});

export default connect(mapStateToProps, {
    getCurrentProfile,
    getCurrentArtist,
    deleteAccount,
})(Dashboard);
