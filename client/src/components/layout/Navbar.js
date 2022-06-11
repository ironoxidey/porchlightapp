import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import {
    openNavDrawer,
    closeNavDrawer,
    // openUserDrawer,
    // closeUserDrawer,
} from '../../actions/app';
import { ProfileAvatar } from '../../common/components';

import { getCurrentArtist } from '../../actions/artist';
import { getCurrentHost } from '../../actions/host';
import {
    getMyEventsOfferedToHost,
    getMyArtistEventsOffers,
    getEventsNearMeToHost,
} from '../../actions/event';

import {
    Avatar,
    Button,
    AppBar,
    Container,
    Box,
    Toolbar,
    MenuItem,
    Tooltip,
    IconButton,
    Menu,
    Typography,
    ListItemIcon,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';

import Alert from '../layout/Alert';

const Navbar = ({
    auth: { isAuthenticated, loading, user },
    logout,
    openNavDrawer,
    closeNavDrawer,
    // openUserDrawer,
    // closeUserDrawer,
    getCurrentArtist,
    getCurrentHost,
    getMyEventsOfferedToHost,
    getEventsNearMeToHost,
    getMyArtistEventsOffers,
    app: { navDrawer, userDrawer, profileHat },
    artist,
    host,
    events: { myHostEvents, myArtistEvents },
}) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [avatar, setAvatar] = useState();

    useEffect(() => {
        if (user && user.avatar) {
            setAvatar(user.avatar);
        }
    }, [user]);

    useEffect(() => {
        if (
            isAuthenticated &&
            user &&
            user.role &&
            Array.isArray(user.role) &&
            user.role.indexOf('ARTIST') != -1
        ) {
            getCurrentArtist();
            getMyArtistEventsOffers();
        }
    }, [getCurrentArtist, user]);
    useEffect(() => {
        if (
            isAuthenticated &&
            user &&
            user.role &&
            Array.isArray(user.role) &&
            user.role.indexOf('HOST') != -1
        ) {
            getCurrentHost();
            getMyEventsOfferedToHost();
            getEventsNearMeToHost();
        }
    }, [getCurrentHost, user]);

    //I'm not sure why I separated these from above ~commented out on May 31st,2022
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         getMyEventsOfferedToHost();
    //         getMyArtistEventsOffers();
    //     }
    // }, [getCurrentHost, user]);

    const handleOpenNavMenu = (event) => {
        openNavDrawer();
    };
    const handleOpenUserMenu = (event) => {
        //openUserDrawer();
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        closeNavDrawer();
    };

    const handleCloseUserMenu = () => {
        //closeUserDrawer();
        setAnchorElUser(null);
    };

    const guestLinks = [
        <Link to="/login">
            <ListItemIcon>
                <LoginIcon></LoginIcon>
            </ListItemIcon>
            Login
        </Link>,
    ];

    const dashboardLink = [
        <Link to="/dashboard">
            <ListItemIcon>
                <DashboardTwoToneIcon></DashboardTwoToneIcon>
            </ListItemIcon>
            My Dashboard
        </Link>,
    ];

    const logoutLink = [
        <a onClick={logout} href="#!">
            <ListItemIcon>
                <LogoutIcon></LogoutIcon>
            </ListItemIcon>
            Logout
        </a>,
    ];

    const attenderLinks = [
        <Link to="/edit-host-profile">
            <ListItemIcon>
                <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
            </ListItemIcon>
            Sign Up to Host
        </Link>,
    ];

    const hostLinks = [
        <Link to="/edit-host-profile">
            <ListItemIcon>
                <EditTwoToneIcon></EditTwoToneIcon>
            </ListItemIcon>
            Edit My Host Profile
        </Link>,
    ];

    const artistLinks = [
        artist.me && artist.me.slug ? (
            <Link to={'/artists/' + artist.me.slug}>
                <ListItemIcon>
                    <AccountBoxTwoToneIcon></AccountBoxTwoToneIcon>
                </ListItemIcon>
                My Artist Profile
            </Link>
        ) : (
            ''
        ),
        <Link to="/edit-artist-profile">
            <ListItemIcon>
                <EditTwoToneIcon></EditTwoToneIcon>
            </ListItemIcon>
            Edit My Artist Profile
        </Link>,
        (artist.me &&
            artist.me._id &&
            artist.me.active &&
            artist.me.bookingWhen.length > 0) ||
        (isAuthenticated &&
            Array.isArray(user.role) &&
            user.role.indexOf('ADMIN') != -1 &&
            artist.me &&
            artist.me._id &&
            artist.me.bookingWhen.length > 0) ? ( //if ADMIN
            <Link to="/edit-artist-booking">
                <ListItemIcon>
                    <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
                </ListItemIcon>
                Edit My Booking Info
            </Link>
        ) : (artist.me && artist.me._id && artist.me.active) ||
          (isAuthenticated &&
              Array.isArray(user.role) &&
              user.role.indexOf('ADMIN') != -1) ? (
            <Link to="/edit-artist-booking">
                <ListItemIcon>
                    <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
                </ListItemIcon>
                Start Booking Shows
            </Link>
        ) : (
            ''
        ),
    ];

    const adminLinks = [];

    // const loggedInLinks = [
    //     <Link to="/dashboard">
    //         <ListItemIcon>
    //             <DashboardTwoToneIcon></DashboardTwoToneIcon>
    //         </ListItemIcon>
    //         My Dashboard
    //     </Link>,
    //     artist && artist.me && artist.me.slug ? (
    //         <Link to={'/artists/' + artist.me.slug}>
    //             <ListItemIcon>
    //                 <AccountBoxTwoToneIcon></AccountBoxTwoToneIcon>
    //             </ListItemIcon>
    //             My Artist Profile
    //         </Link>
    //     ) : (
    //         ''
    //     ),
    //     artist.me && artist.me._id ? (
    //         <Link to="/edit-artist-profile">
    //             <ListItemIcon>
    //                 <EditTwoToneIcon></EditTwoToneIcon>
    //             </ListItemIcon>
    //             Edit My Artist Profile
    //         </Link>
    //     ) : (
    //         <Link to="/edit-artist-profile">
    //             <ListItemIcon>
    //                 <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
    //             </ListItemIcon>
    //             Create My Artist Profile
    //         </Link>
    //     ),
    //     (artist.me &&
    //         artist.me._id &&
    //         artist.me.active &&
    //         artist.me.bookingWhen.length > 0) ||
    //     (isAuthenticated &&
    //         Array.isArray(user.role) &&
    //         user.role.indexOf('ADMIN') != -1 &&
    //         artist.me &&
    //         artist.me._id &&
    //         artist.me.bookingWhen.length > 0) ? ( //if ADMIN
    //         <Link to="/edit-artist-booking">
    //             <ListItemIcon>
    //                 <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
    //             </ListItemIcon>
    //             Edit My Booking Info
    //         </Link>
    //     ) : (artist.me && artist.me._id && artist.me.active) ||
    //       (isAuthenticated &&
    //           Array.isArray(user.role) &&
    //           user.role.indexOf('ADMIN') != -1) ? (
    //         <Link to="/edit-artist-booking">
    //             <ListItemIcon>
    //                 <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
    //             </ListItemIcon>
    //             Start booking shows
    //         </Link>
    //     ) : (
    //         ''
    //     ),
    //     isAuthenticated &&
    //     Array.isArray(user.role) &&
    //     user.role.indexOf('ADMIN') != -1 ? ( //if ADMIN
    //         <Link to="/edit-host-profile">
    //             <ListItemIcon>
    //                 <EditTwoToneIcon></EditTwoToneIcon>
    //             </ListItemIcon>
    //             Edit My Host Profile
    //         </Link>
    //     ) : (
    //         ''
    //     ),
    //     <a onClick={logout} href="#!">
    //         <ListItemIcon>
    //             <LogoutIcon></LogoutIcon>
    //         </ListItemIcon>
    //         Logout
    //     </a>,
    // ];
    // const loggedOutLink = [
    //     <Link to="/login">
    //         <ListItemIcon>
    //             <LoginIcon></LoginIcon>
    //         </ListItemIcon>
    //         Login
    //     </Link>,
    // ];

    //let userLinks = isAuthenticated ? loggedInLinks : loggedOutLink;

    const myNavLinks = () => {
        let combinedLinks = [guestLinks];
        if (isAuthenticated) {
            combinedLinks = [dashboardLink];
        }
        if (
            isAuthenticated &&
            Array.isArray(user.role) &&
            user.role.indexOf('ATTENDER') != -1 &&
            user.role.indexOf('HOST') === -1
        ) {
            combinedLinks = combinedLinks.concat(attenderLinks);
        }
        if (
            isAuthenticated &&
            Array.isArray(user.role) &&
            user.role.indexOf('HOST') != -1
        ) {
            combinedLinks = combinedLinks.concat(hostLinks);
        }

        if (
            isAuthenticated &&
            Array.isArray(user.role) &&
            user.role.indexOf('ARTIST') != -1
        ) {
            combinedLinks = combinedLinks.concat(artistLinks);
        }
        if (
            isAuthenticated &&
            Array.isArray(user.role) &&
            user.role.indexOf('ADMIN') != -1
        ) {
            combinedLinks = combinedLinks.concat(adminLinks);
        }

        if (isAuthenticated) {
            combinedLinks = combinedLinks.concat(logoutLink);
        }
        return combinedLinks;
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                borderBottom: '1px solid var(--primary-color)',
                backgroundImage: 'none',
                backgroundColor: 'var(--secondary-dark-color)',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'flex' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={
                                !navDrawer
                                    ? handleOpenNavMenu
                                    : handleCloseNavMenu
                            }
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'flex' },
                        }}
                    >
                        <Alert />
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                {user && user.name && user.avatar !== null ? (
                                    <Avatar
                                        alt={`${user.name}`}
                                        src={`${user.avatar}`}
                                    />
                                ) : (
                                    <Avatar />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            onClick={handleCloseUserMenu}
                        >
                            {user && user.name && user.avatar !== null ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        padding: '20px 20px 0px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {artist.me && artist.me._id
                                            ? artist.me.stageName
                                            : user && user.name
                                            ? user.name
                                            : ''}
                                    </Typography>
                                    <Typography
                                        sx={{ opacity: 0.2, fontSize: '.7em' }}
                                    >
                                        ({user && user.email})
                                    </Typography>
                                </Box>
                            ) : (
                                ''
                            )}
                            {myNavLinks().map((userLink, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={handleCloseNavMenu}
                                    sx={{ padding: 0 }}
                                    className="drawerListItems"
                                >
                                    {userLink}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    artist: PropTypes.object,
    host: PropTypes.object,
    events: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    app: state.app,
    artist: state.artist,
    host: state.host,
    events: state.event,
});
export default connect(mapStateToProps, {
    logout,
    openNavDrawer,
    closeNavDrawer,
    // openUserDrawer,
    // closeUserDrawer,
    getCurrentArtist,
    getCurrentHost,
    getMyEventsOfferedToHost,
    getEventsNearMeToHost,
    getMyArtistEventsOffers,
})(Navbar);
