import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { openNavDrawer, closeNavDrawer } from '../../actions/app';

import { logout } from '../../actions/auth';

const SwipeableTemporaryDrawer = ({
    auth: { isAuthenticated, loading, user },
    openNavDrawer,
    closeNavDrawer,
    logout,
    app: { navDrawer },
    artist,
}) => {
    const [state, setState] = React.useState({
        left: false,
    });

    const anchor = 'left';

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        open ? openNavDrawer() : closeNavDrawer();

        setState({ ...state, [anchor]: open });
    };

    useEffect(() => {
        if (navDrawer) {
            toggleDrawer(anchor, true);
            setState({ ...state, ['left']: true });
        } else {
            toggleDrawer(anchor, false);
            setState({ ...state, ['left']: false });
        }
    }, [navDrawer]);

    const adminLinks = [
        <Link to="/edit-users">
            <ListItemIcon>
                <PeopleOutlineIcon></PeopleOutlineIcon>
            </ListItemIcon>
            Edit Users
        </Link>,
        <Link to="/artists">
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
        <Link to="/edit-artists">
            <ListItemIcon>
                <PeopleOutlineIcon></PeopleOutlineIcon>
            </ListItemIcon>
            Edit Artists
        </Link>,
        <Link to="/edit-events">
            <ListItemIcon>
                <PeopleOutlineIcon></PeopleOutlineIcon>
            </ListItemIcon>
            Edit Events
        </Link>,
        // <Link to="/dashboard">
        //     <ListItemIcon>
        //         <DashboardIcon></DashboardIcon>
        //     </ListItemIcon>
        //     Dashboard
        // </Link>,
    ];
    const bookingLinks = [
        <Link to="/artists">
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
        <Link to="/edit-events">
            <ListItemIcon>
                <PeopleOutlineIcon></PeopleOutlineIcon>
            </ListItemIcon>
            Edit Events
        </Link>,
    ];
    const artistLinks = [
        // <Link to="/dashboard">
        //     <ListItemIcon>
        //         <DashboardIcon></DashboardIcon>
        //     </ListItemIcon>
        //     Dashboard
        // </Link>,
        // <Link to="/edit-artist-profile">
        //     <ListItemIcon>
        //         <EditTwoToneIcon></EditTwoToneIcon>
        //     </ListItemIcon>
        //     Edit My Profile
        // </Link>,
        // artist.me && artist.me.slug ? (
        //     <Link to={'/artists/' + artist.me.slug}>
        //         <ListItemIcon>
        //             <EditTwoToneIcon></EditTwoToneIcon>
        //         </ListItemIcon>
        //         My Profile
        //     </Link>
        // ) : (
        //     ''
        // ),
        <a
            target="_blank"
            href="https://docs.google.com/document/d/1skxIQjIhEOs07k06ymmss1lMO-Q9Q4j8kI68Vc0u5hE/edit?usp=sharing"
        >
            <ListItemIcon>
                <MenuBookTwoToneIcon /> Musician Guide
            </ListItemIcon>
        </a>,
        <Link to="/artists">
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
    ];
    const attenderLinks = [
        // <Link to="/dashboard">
        //     <ListItemIcon>
        //         <DashboardIcon></DashboardIcon>
        //     </ListItemIcon>
        //     Dashboard
        // </Link>,
        <Link to="/artists">
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
    ];
    const guestLinks = [
        <Link to="/artists">
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
    ];
    const loginLink = [
        <Link to="/login">
            <ListItemIcon>
                <LoginIcon></LoginIcon>
            </ListItemIcon>
            Login
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

    let navLinks =
        //isAuthenticated && user.role === 'ADMIN' //if ADMIN
        isAuthenticated &&
        Array.isArray(user.role) &&
        user.role.indexOf('ADMIN') != -1 //if ADMIN
            ? adminLinks //return adminLinks
            : isAuthenticated &&
              Array.isArray(user.role) &&
              user.role.indexOf('BOOKING') != -1 //else if BOOKING
            ? bookingLinks //return bookingLinks
            : isAuthenticated //else if isAuthenticated
            ? attenderLinks //return attenderLinks
            : guestLinks; //else return guestLinks

    let loggedInLinks = isAuthenticated ? logoutLink : loginLink;

    const list = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {/* {user && user.name && user.avatar !== null ? (
                <Box
                    sx={{
                        width: '100%',
                        padding: '20px 20px 0px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Avatar alt={`${user.name}`} src={`${user.avatar}`} />
                    <Typography sx={{ textAlign: 'center' }}>
                        {artist.me && artist.me._id
                            ? artist.me.stageName
                            : user && user.name
                            ? user.name
                            : ''}
                    </Typography>
                    <Typography sx={{ opacity: 0.2, fontSize: '.7em' }}>
                        ({user && user.email})
                    </Typography>
                </Box>
            ) : (
                ''
            )}
            <List>
                {loggedInLinks.map((link, index) => (
                    <ListItem
                        button
                        key={'userDrawerLink' + index}
                        className="drawerListItems"
                        sx={{ padding: 0 }}
                    >
                        {link}
                    </ListItem>
                ))}
            </List>
            <Divider /> */}
            <List>
                {navLinks.map((link, index) => (
                    <ListItem
                        button
                        key={'navDrawerLink' + index}
                        className="drawerListItems"
                        sx={{ padding: 0 }}
                    >
                        {link}
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    const iOS =
        typeof navigator !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <div>
            <React.Fragment key={anchor}>
                <SwipeableDrawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    {list(anchor)}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
};

SwipeableTemporaryDrawer.propTypes = {
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
})(SwipeableTemporaryDrawer);
