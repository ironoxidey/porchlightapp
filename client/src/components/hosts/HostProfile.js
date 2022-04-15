import React from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    SvgIcon,
    Chip,
} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

import { toTitleCase } from '../../actions/app';

const HostProfile = ({ theHost, isMe = false }) => {
    return (
        <>
            {' '}
            <Grid
                container
                className="theHostProfile"
                sx={{
                    paddingBottom: '80px!important',
                }}
            >
                {/* {wideImg ? ( */}
                <Tooltip
                    arrow={true}
                    disableHoverListener={!isMe}
                    disableFocusListener={!isMe}
                    disableTouchListener={!isMe}
                    title={
                        <Link to="/edit-host-profile?field=venueImg">Edit</Link>
                    }
                >
                    <Grid
                        container
                        className="wideImgBG"
                        sx={{
                            padding: '20px!important',
                            height: {
                                xs: '100%',
                                md: '55vh',
                            },
                            maxHeight: {
                                xs: '100%',
                                md: '55vh',
                            },
                            //width: 'calc(100% - 40px)',
                            //maxWidth: '960px',
                            margin: '0 auto',
                            borderRadius: '8px 8px 0 0',
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${theHost.venueImg}")`,
                            backgroundColor: 'var(--secondary-dark-color)',
                            backgroundPosition: '50% 50%',
                            backgroundSize: 'cover',
                            alignItems: 'center',
                            justifyContent: {
                                md: 'start',
                                xs: 'center',
                            },
                        }}
                    >
                        {theHost.profileImg && (
                            <Grid item>
                                <Tooltip
                                    arrow={true}
                                    disableHoverListener={!isMe}
                                    disableFocusListener={!isMe}
                                    disableTouchListener={!isMe}
                                    title={
                                        <Link to="/edit-host-profile?field=profileImg">
                                            Edit
                                        </Link>
                                    }
                                >
                                    <Box
                                        className="squareImgInACircle"
                                        sx={{
                                            height: '200px',
                                            width: '200px',
                                            maxHeight: '200px',
                                            maxWidth: '200px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            backgroundImage: `url("${theHost.profileImg}")`,
                                            backgroundPosition: '50% 25%',
                                            backgroundSize: 'cover',
                                            padding: '4px',
                                            backgroundClip: 'content-box',
                                            border: '1px solid var(--primary-color)',
                                            margin: '0 8px 0 0',
                                        }}
                                    ></Box>
                                </Tooltip>
                            </Grid>
                        )}
                        <Grid
                            item
                            container
                            md={8}
                            sx={{
                                marginTop: '0',
                                textShadow: '0 0 10px rgba(0,0,0,.8)',
                                width: 'fit-content',
                                maxWidth: 'fit-content',
                            }}
                            direction="column"
                            alignItems="start"
                            className="topInfo"
                        >
                            {theHost.firstName && theHost.lastName && (
                                <Grid item>
                                    <Grid
                                        container
                                        item
                                        direction="row"
                                        sx={{
                                            margin: '8px auto',
                                            width: '100%',
                                        }}
                                    >
                                        <Typography component="h2">
                                            {theHost.firstName}{' '}
                                            {theHost.lastName}
                                        </Typography>{' '}
                                    </Grid>
                                </Grid>
                            )}
                            {theHost.genres &&
                                theHost.genres.constructor.name === 'Array' && (
                                    <Grid item>
                                        <Tooltip
                                            title={
                                                !isMe ? (
                                                    'Genre'
                                                ) : (
                                                    <Link to="/edit-host-profile?field=genres">
                                                        Edit
                                                    </Link>
                                                )
                                            }
                                            placement="bottom"
                                            arrow
                                        >
                                            <SvgIcon
                                                style={{
                                                    marginRight: '8px',
                                                    fontSize: '1.3rem',
                                                    verticalAlign: 'baseline',
                                                }}
                                            >
                                                <FontAwesomeIcon icon="guitar"></FontAwesomeIcon>
                                            </SvgIcon>
                                        </Tooltip>
                                        {theHost.genres.map((genre, key) => (
                                            <Chip
                                                key={key}
                                                label={genre}
                                                size="small"
                                                sx={{ margin: '0 4px' }}
                                            ></Chip>
                                        ))}
                                    </Grid>
                                )}
                            {theHost.city && theHost.state && (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    sx={{ marginTop: '8px' }}
                                >
                                    <Tooltip
                                        title={
                                            !isMe ? (
                                                'Location'
                                            ) : (
                                                <Link to="/edit-host-profile?field=location">
                                                    Edit
                                                </Link>
                                            )
                                        }
                                        placement="bottom"
                                        arrow
                                    >
                                        <PlaceTwoToneIcon
                                            sx={{ marginRight: '8px' }}
                                        ></PlaceTwoToneIcon>
                                    </Tooltip>
                                    <Typography component="h3">
                                        {toTitleCase(theHost.city)},{' '}
                                        {theHost.state}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Tooltip>
            </Grid>
        </>
    );
};

HostProfile.propTypes = {
    theHost: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(withRouter(HostProfile)); //withRouter allows us to pass history objects
