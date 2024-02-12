import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    IconButton,
} from '@mui/material';

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import { StackDateforDisplay } from '../../actions/app';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Button from '../layout/SvgButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditHostEvent from '../events/EditHostEvent';

import EventHostDialog from '../events/EventHostDialog';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

const HostAdminActiveFalse = ({ host }) => {
    return (
        <>
            <Grid
                container
                item
                className={'activationPending'}
                direction="row"
                xs={12}
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    '&:hover': {},
                    padding: '16px',
                    margin: '4px',
                    color: 'var(--light-color)',
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                    position: 'relative',
                    backgroundImage:
                        'repeating-linear-gradient(45deg,     rgba(255,255,255,0.03) 5px,    rgba(255,255,255,.03) 15px,    transparent 15px,    transparent 30px)',
                    border: '4px dashed var(--primary-color)',
                    opacity: '0.7',
                }}
            >
                <Grid
                    container
                    // item
                    flexDirection="row"
                    sx={{
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        justifyContent: 'center',
                    }}
                    // xs={12}
                >
                    <Grid
                        item
                        className="warningIcon"
                        // xs={1}
                        style={{
                            color: 'var(--primary-color)',
                            zIndex: '5',
                            margin: '0 8px 0 0 ',
                        }}
                        // xs={1}
                    >
                        <WarningAmberIcon></WarningAmberIcon>
                    </Grid>
                    <Grid
                        item
                        // xs={11}
                    >
                        <Typography
                            component="p"
                            sx={{
                                textAlign: 'center',
                                color: 'var(--primary-color)',
                            }}
                        >
                            At the moment, your hosting account is pending
                            activation. You won’t be able to host any Porchlight
                            concerts until you've been cleared by a Porchlight
                            representative. Someone should reach out to you
                            soon.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

HostAdminActiveFalse.propTypes = {
    host: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    host: state.host,
});

//export default HostAdminActiveFalse;
// export default connect(mapStateToProps, {})(withRouter(HostAdminActiveFalse)); //withRouter allows us to pass history objects
export default connect(mapStateToProps, {})(HostAdminActiveFalse); //withRouter allows us to pass history objects
