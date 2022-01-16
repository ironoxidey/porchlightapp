import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { openNavDrawer, closeNavDrawer } from '../../actions/app';

import { logout } from '../../actions/auth';

const SwipeableTemporaryDrawer = ({ auth: { isAuthenticated, loading, user }, openNavDrawer, closeNavDrawer, logout, app: { navDrawer }  }) => {
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

    (open) ? openNavDrawer() : closeNavDrawer();

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    if (navDrawer){
        toggleDrawer(anchor, true);
        setState({ ...state, ['left']: true });
    }
    else{
        toggleDrawer(anchor, false);
        setState({ ...state, ['left']: false });
    }
  }, [navDrawer]);

  const adminLinks = [
        <Link to='/edit-artists'>
            <ListItemIcon>
                <PeopleOutlineIcon></PeopleOutlineIcon>
            </ListItemIcon>
          Edit Artists
        </Link>,
        <Link to='/dashboard'>
            <ListItemIcon>
                <DashboardIcon></DashboardIcon>
            </ListItemIcon>
            Dashboard
        </Link>       
    ];
    const attenderLinks = [
        <Link to='/artists'>
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>,
        <Link to='/dashboard'>
            <ListItemIcon>
                <DashboardIcon></DashboardIcon>
            </ListItemIcon>
            Dashboard
        </Link>
    ];
    const guestLinks = [
        <Link to='/artists'>
            <ListItemIcon>
                <PeopleIcon></PeopleIcon>
            </ListItemIcon>
            Artists
        </Link>
    ];
    const loginLink = [
        <Link to='/login'>
            <ListItemIcon>
                <LoginIcon></LoginIcon>
            </ListItemIcon>
            Login
        </Link>
    ];
    const logoutLink = [
        <a onClick={logout} href='#!'>
        <ListItemIcon> 
            <LogoutIcon></LogoutIcon>
        </ListItemIcon>Logout
        </a>
    ];

    let navLinks = (isAuthenticated && user.role === "ADMIN") ? (adminLinks) : isAuthenticated ? (attenderLinks) : guestLinks;
    let userLinks = (isAuthenticated) ? (logoutLink) : loginLink;


  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {navLinks.map((link, index) => (
          <ListItem button key={index}>
            {link}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userLinks.map((link, index) => (
          <ListItem button key={index}>
            {link}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
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
}

SwipeableTemporaryDrawer.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
    app: state.app
  });
  export default connect(mapStateToProps, { logout, openNavDrawer, closeNavDrawer })(SwipeableTemporaryDrawer);
  
