import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Link,
    // withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
import EmojiObjectsTwoToneIcon from '@mui/icons-material/EmojiObjectsTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import HotelTwoToneIcon from '@mui/icons-material/HotelTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import FamilyRestroomTwoToneIcon from '@mui/icons-material/FamilyRestroomTwoTone';
import SpeakerTwoToneIcon from '@mui/icons-material/SpeakerTwoTone';
import CoronavirusTwoToneIcon from '@mui/icons-material/CoronavirusTwoTone';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import WcTwoToneIcon from '@mui/icons-material/WcTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import LiquorTwoToneIcon from '@mui/icons-material/LiquorTwoTone';
import NoDrinksTwoToneIcon from '@mui/icons-material/NoDrinksTwoTone';
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
import MoneyOffTwoToneIcon from '@mui/icons-material/MoneyOffTwoTone';
import InterpreterModeTwoToneIcon from '@mui/icons-material/InterpreterModeTwoTone'; //for opener
import DownloadIcon from '@mui/icons-material/Download';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import prependHttp from 'prepend-http';

// import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import {
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    IconButton,
    Divider,
} from '@mui/material';

import {
    toTitleCase,
    //youTubeEmbed,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
    StackDateforDisplay,
} from '../../actions/app';

const ArtistTop = ({ artist, user, isAuthenticated, me }) => {
    let isMe = false;
    if (me && me._id === artist._id) {
        isMe = true;
    }

    return (
        <>
            <Tooltip
                arrow={true}
                disableHoverListener={!isMe}
                disableFocusListener={!isMe}
                disableTouchListener={!isMe}
                title={
                    <Link to="/edit-artist-profile?field=wideImg">Edit</Link>
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
                        //borderRadius: '8px 8px 0 0',
                        borderRadius: '0 0',
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${artist.wideImg}")`,
                        backgroundColor: 'var(--secondary-dark-color)',
                        backgroundPosition: '50% 50%',
                        backgroundSize: 'cover',
                        alignItems: 'center',
                        justifyContent: {
                            md: 'start',
                            xs: 'center',
                        },
                        position: 'relative',
                    }}
                >
                    {artist.email && (
                        <Grid
                            item
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgba(0 0 0 /.5)',
                                textAlign: 'center',
                                padding: '8px 0 4px',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '50px',
                                // color: 'var(--link-color)',
                            }}
                        >
                            <a href={artist.wideImg} target="_blank">
                                <DownloadIcon></DownloadIcon>
                            </a>
                        </Grid>
                    )}
                    {artist.squareImg && (
                        <Grid item>
                            <Tooltip
                                arrow={true}
                                disableHoverListener={!isMe}
                                disableFocusListener={!isMe}
                                disableTouchListener={!isMe}
                                title={
                                    <Link to="/edit-artist-profile?field=squareImg">
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
                                        backgroundImage: `url("${artist.squareImg}")`,
                                        backgroundPosition: '50% 25%',
                                        backgroundSize: 'cover',
                                        padding: '4px',
                                        backgroundClip: 'content-box',
                                        border: '1px solid var(--primary-color)',
                                        margin: '0 8px 0 0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'end',
                                        aspectRatio: '1 / 1',
                                    }}
                                >
                                    {artist.email && (
                                        <Grid
                                            item
                                            sx={{
                                                width: '100%',
                                                backgroundColor:
                                                    'rgba(0 0 0 /.5)',
                                                textAlign: 'center',
                                                padding: '8px 0 4px',
                                                // color: 'var(--link-color)',
                                            }}
                                        >
                                            <a
                                                href={artist.squareImg}
                                                target="_blank"
                                            >
                                                <DownloadIcon></DownloadIcon>
                                            </a>
                                        </Grid>
                                    )}
                                </Box>
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
                        {artist.stageName && (
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
                                        {artist.stageName}
                                    </Typography>{' '}
                                </Grid>
                            </Grid>
                        )}
                        {artist.email && (
                            <Grid item>
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    sx={{
                                        margin: '-8px auto 8px',
                                        width: '100%',
                                    }}
                                >
                                    <Typography component="small">
                                        {artist.email}
                                    </Typography>{' '}
                                </Grid>
                            </Grid>
                        )}
                        {artist.phone && (
                            <Grid item>
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    sx={{
                                        margin: '-8px auto 8px',
                                        width: '100%',
                                    }}
                                >
                                    <Typography component="small">
                                        {artist.phone}
                                    </Typography>{' '}
                                </Grid>
                            </Grid>
                        )}
                        {artist.genres &&
                        artist.genres.constructor.name === 'Array' ? (
                            <Grid item>
                                <Tooltip
                                    title={
                                        !isMe ? (
                                            'Genre'
                                        ) : (
                                            <Link to="/edit-artist-profile?field=genres">
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
                                {artist.genres.map((genre, key) => (
                                    <Chip
                                        key={key}
                                        label={genre}
                                        size="small"
                                        sx={{ margin: '0 4px' }}
                                    ></Chip>
                                ))}
                            </Grid>
                        ) : (
                            ''
                        )}
                        {artist.city && artist.state ? (
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
                                            <Link to="/edit-artist-profile?field=location">
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
                                    {artist.streetAddress
                                        ? artist.streetAddress + ', '
                                        : ''}
                                    {toTitleCase(artist.city)}, {artist.state}
                                    {artist.streetAddress
                                        ? ' ' + artist.zip
                                        : ''}
                                </Typography>
                            </Grid>
                        ) : (
                            ''
                        )}
                        {artist.soundsLike &&
                        artist.soundsLike.constructor.name === 'Array' ? (
                            <Grid
                                item
                                container
                                alignItems="center"
                                sx={{ marginTop: '8px' }}
                            >
                                <Tooltip
                                    title={
                                        !isMe ? (
                                            'Inspired by'
                                        ) : (
                                            <Link to="/edit-artist-profile?field=soundsLike">
                                                Edit
                                            </Link>
                                        )
                                    }
                                    placement="bottom"
                                    arrow
                                >
                                    <EmojiObjectsTwoToneIcon
                                        sx={{ marginRight: '8px' }}
                                    ></EmojiObjectsTwoToneIcon>
                                </Tooltip>
                                {artist.soundsLike.map((sndsLike, key) => (
                                    <Chip
                                        key={key}
                                        label={sndsLike}
                                        size="small"
                                        sx={{ margin: '0 4px' }}
                                    ></Chip>
                                ))}
                            </Grid>
                        ) : (
                            ''
                        )}

                        <Grid
                            container
                            item
                            direction="row"
                            sx={{
                                margin: '8px auto',
                                width: '100%',
                            }}
                        >
                            <Grid
                                item
                                xs={1}
                                //md={0.5}
                                className="link-icon"
                                sx={{
                                    marginRight: '4px',
                                }}
                            >
                                {artist.artistWebsite ? (
                                    <Tooltip
                                        title={
                                            !isMe ? (
                                                'Check out ' +
                                                artist.stageName +
                                                '’s website'
                                            ) : (
                                                <Link to="/edit-artist-profile?field=artistWebsite">
                                                    Edit
                                                </Link>
                                            )
                                        }
                                        placement="bottom"
                                        arrow
                                    >
                                        <a
                                            href={prependHttp(
                                                artist.artistWebsite
                                            )}
                                            target="_blank"
                                        >
                                            <FontAwesomeIcon
                                                icon={['fas', 'globe-americas']}
                                                size="lg"
                                                fixedWidth
                                            />
                                        </a>
                                    </Tooltip>
                                ) : (
                                    ''
                                )}
                            </Grid>

                            {artist.socialLinks &&
                            Object.keys(artist.socialLinks).length > 0
                                ? artist.socialLinks.map(
                                      (eachSocialLink, idx) =>
                                          eachSocialLink.link && (
                                              <Grid
                                                  item
                                                  xs={1}
                                                  //md={0.5}
                                                  className="link-icon"
                                                  key={`eachSocialLink${idx}`}
                                                  sx={{
                                                      marginRight: '4px',
                                                  }}
                                              >
                                                  <Tooltip
                                                      title={
                                                          !isMe ? (
                                                              toTitleCase(
                                                                  pullDomainFrom(
                                                                      prependHttp(
                                                                          eachSocialLink.link
                                                                      )
                                                                  )
                                                              )
                                                          ) : (
                                                              <Link to="/edit-artist-profile?field=socialLinks">
                                                                  Edit
                                                              </Link>
                                                          )
                                                      }
                                                      placement="bottom"
                                                      arrow
                                                  >
                                                      <a
                                                          href={prependHttp(
                                                              eachSocialLink.link
                                                          )}
                                                          target="_blank"
                                                      >
                                                          {getFontAwesomeIcon(
                                                              prependHttp(
                                                                  eachSocialLink.link
                                                              ),
                                                              'lg'
                                                          )}
                                                      </a>
                                                  </Tooltip>
                                              </Grid>
                                          )
                                  )
                                : ''}
                        </Grid>
                    </Grid>
                </Grid>
            </Tooltip>
            {/* ) : (
				''
			)} */}
            {artist.bio && (
                <Grid
                    item
                    container
                    sx={{
                        margin: '4px 0 0',
                        color: 'var(--light-color)',
                        // padding: '20px',
                        // border: '3px solid var(--primary-color)',
                    }}
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    className="bio"
                    //md={4}
                    xs={12}
                >
                    <Tooltip
                        arrow={true}
                        disableHoverListener={!isMe}
                        disableFocusListener={!isMe}
                        disableTouchListener={!isMe}
                        title={
                            <Link to={`/edit-artist-profile?field=bio`}>
                                Edit
                            </Link>
                        }
                    >
                        <Typography
                            component="h2"
                            sx={{
                                // fontFamily: 'var(--secondary-font)',
                                // textTransform: 'uppercase',
                                //letterSpacing: '1px',
                                color: 'var(--primary-color)',
                            }}
                        >
                            About {artist.stageName}:
                        </Typography>
                    </Tooltip>

                    <Typography
                        component="pre"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block',
                            width: '100%',
                            lineHeight: '1.7',
                        }}
                    >
                        {artist.bio}
                    </Typography>
                </Grid>
            )}
        </>
    );
};

ArtistTop.propTypes = {
    artist: PropTypes.object.isRequired,
    me: PropTypes.object,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    me: state.artist.me,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
});

// export default connect(mapStateToProps, {})(withRouter(ArtistTop));
export default connect(mapStateToProps, {})(ArtistTop);
