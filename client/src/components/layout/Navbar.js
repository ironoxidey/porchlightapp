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
import { getCurrentArtist } from '../../actions/artist';

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
    app: { navDrawer, userDrawer },
    artist,
}) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [avatar, setAvatar] = useState();

    useEffect(() => {
        if (user && user.avatar) {
            setAvatar(user.avatar);
        }
    }, [user]);

    useEffect(() => {
        getCurrentArtist();
    }, [getCurrentArtist]);

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

    const loggedInLinks = [
        <Link to="/dashboard">
            <ListItemIcon>
                <DashboardTwoToneIcon></DashboardTwoToneIcon>
            </ListItemIcon>
            My Dashboard
        </Link>,
        artist && artist.me && artist.me.slug ? (
            <Link to={'/artists/' + artist.me.slug}>
                <ListItemIcon>
                    <AccountBoxTwoToneIcon></AccountBoxTwoToneIcon>
                </ListItemIcon>
                My Profile
            </Link>
        ) : (
            ''
        ),
        artist.me && artist.me._id ? (
            <Link to="/edit-artist-profile">
                <ListItemIcon>
                    <EditTwoToneIcon></EditTwoToneIcon>
                </ListItemIcon>
                Edit My Profile
            </Link>
        ) : (
            <Link to="/edit-artist-profile">
                <ListItemIcon>
                    <AutoAwesomeTwoToneIcon></AutoAwesomeTwoToneIcon>
                </ListItemIcon>
                Create My Profile
            </Link>
        ),
        artist.me &&
        artist.me._id &&
        artist.me.active &&
        artist.me.bookingWhen.length > 0 ? (
            <Link to="/edit-artist-booking">
                <ListItemIcon>
                    <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
                </ListItemIcon>
                Edit My Booking Info
            </Link>
        ) : artist.me && artist.me._id && artist.me.active ? (
            <Link to="/edit-artist-booking">
                <ListItemIcon>
                    <DateRangeTwoToneIcon></DateRangeTwoToneIcon>
                </ListItemIcon>
                Start booking shows
            </Link>
        ) : (
            ''
        ),
        <a onClick={logout} href="#!">
            <ListItemIcon>
                <LogoutIcon></LogoutIcon>
            </ListItemIcon>
            Logout
        </a>,
    ];
    const loggedOutLink = [
        <Link to="/login">
            <ListItemIcon>
                <LoginIcon></LoginIcon>
            </ListItemIcon>
            Login
        </Link>,
    ];

    let userLinks = isAuthenticated ? loggedInLinks : loggedOutLink;

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
                        <Tooltip title="Open settings">
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
                            {userLinks.map((userLink, index) => (
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
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    app: state.app,
    artist: state.artist,
});
export default connect(mapStateToProps, {
    logout,
    openNavDrawer,
    closeNavDrawer,
    // openUserDrawer,
    // closeUserDrawer,
    getCurrentArtist,
})(Navbar);
