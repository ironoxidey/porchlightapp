import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import prependHttp from 'prepend-http';

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
//import Masonry from '@mui/lab/Masonry';
import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';
import ReactPlayer from 'react-player/lazy';

import { useTransition, animated, config } from '@react-spring/web';

import {
    toTitleCase,
    //youTubeEmbed,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
} from '../../actions/app';

function StackDateforDisplay(props) {
    let theDate = new Date(props.date).toDateString().split(' ');
    return (
        <Grid
            item
            container
            className="dateStack"
            sx={{
                fontFamily: 'var(--secondary-font)',
                textTransform: 'uppercase',
                lineHeight: '1',
                textAlign: 'center',
                border: '1px solid var(--link-color)',
                width: '55px',
            }}
            direction="column"
        >
            <Grid
                className="weekday"
                item
                sx={{
                    color: 'var(--dark-color)',
                    backgroundColor: 'var(--link-color)',
                    margin: '0',
                    padding: '2px',
                }}
            >
                {theDate[0]}
            </Grid>
            <Grid
                className="month"
                item
                sx={{
                    marginTop: '4px',
                }}
            >
                {theDate[1]}
            </Grid>
            <Grid
                className="date"
                item
                sx={{
                    fontSize: '1.8em',
                    marginBottom: '-2px',
                }}
            >
                {theDate[2]}
            </Grid>
            <Grid
                item
                className="year"
                sx={{
                    color: 'var(--primary-color)',
                    fontSize: '.9em',
                    marginBottom: '4px',
                }}
            >
                {theDate[3]}
            </Grid>
        </Grid>
    );
}

const ArtistProfile = ({
    me,
    artist,
    artist: {
        slug,
        email,
        firstName,
        lastName,
        stageName,
        medium,
        genres,
        repLinks,
        helpKind,
        phone,
        hometown,
        city,
        state,
        zip,
        costStructure,
        namedPrice,
        payoutPlatform,
        payoutHandle,
        bookingWhen,
        bookingWhenWhere,
        setLength,
        schedule,
        showSchedule,
        overnight,
        openers,
        travelingCompanions,
        companionTravelers,
        hangout,
        merchTable,
        allergies,
        familyFriendly,
        soundSystem,
        agreeToPayAdminFee,
        wideImg,
        squareImg,
        covidPrefs,
        artistNotes,
        financialHopes,
        bio,
    },
}) => {
    let isMe = false;
    if (me && me._id === artist._id) {
        isMe = true;
    }

    const wideImgBW =
        wideImg &&
        wideImg.replace(
            'https://res.cloudinary.com/porchlight/image/upload/',
            'https://res.cloudinary.com/porchlight/image/upload/e_saturation:-100/'
        );

    const [mediaTabs, setMediaTab] = useState([]);
    useEffect(() => {
        setMediaTab([]); //reset to [] so we don't get duplicates
        // if (mediaTabs.length < 3) {
        if (artist.artistStatementVideo)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'artistStatementVideo',
                    title: 'Artist Statement',
                    mediaLink: artist.artistStatementVideo,
                    width: 200,
                },
            ]);
        if (artist.repLink)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'repLink',
                    title: `Listen`,
                    mediaLink: artist.repLink,
                    width: 140,
                },
            ]);
        if (artist.livePerformanceVideo)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'livePerformanceVideo',
                    title: `Live performance`,
                    mediaLink: artist.livePerformanceVideo,
                    width: 200,
                },
            ]);
        // }
    }, [artist]);

    const [mediaTabIndex, setTabIndex] = useState(0);

    const transitions = useTransition(mediaTabIndex, {
        key: mediaTabIndex,
        initial: null,
        from: { opacity: 0, transform: `scale(1.1,1.1)` },
        enter: { opacity: 1, transform: 'scale(1,1)' },
        leave: {
            opacity: 0,
            transform: `scale(0.9,0.9)`,
        },
        config: config.molasses,
        // onRest: (_a, _b, item) => {
        //   if (formCardIndex === item) {
        //     set(cardIndex => (cardIndex + 1) % formGroups.length)
        //   }
        // },
        exitBeforeEnter: false,
    });

    return (
        <Fragment>
            <Grid
                container
                className="artistProfile"
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
                        <Link to="/edit-artist-profile?field=wideImg">
                            Edit
                        </Link>
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
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${wideImg}")`,
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
                        {artist.squareImg ? (
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
                                        }}
                                    ></Box>
                                </Tooltip>
                            </Grid>
                        ) : (
                            ''
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
                            {artist.stageName ? (
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
                            ) : (
                                ''
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
                                        {toTitleCase(artist.city)},{' '}
                                        {artist.state}
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
                                                'Sounds Like'
                                            ) : (
                                                <Link to="/edit-artist-profile?field=soundsLike">
                                                    Edit
                                                </Link>
                                            )
                                        }
                                        placement="bottom"
                                        arrow
                                    >
                                        <HearingTwoToneIcon
                                            sx={{ marginRight: '8px' }}
                                        ></HearingTwoToneIcon>
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
                                                href={artist.artistWebsite}
                                                target="_blank"
                                            >
                                                <FontAwesomeIcon
                                                    icon={[
                                                        'fas',
                                                        'globe-americas',
                                                    ]}
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
                            {/* {artist.streamingLinks &&
                            Object.keys(artist.streamingLinks).length > 0 ? (
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    sx={{
                                        margin: '8px auto',
                                        width: '100%',
                                    }}
                                >
                                    {artist.streamingLinks.map(
                                        (eachStreamingLink, idx) => (
                                            <Grid
                                                item
                                                xs={1}
                                                //md={0.5}
                                                className="link-icon"
                                                key={`eachStreamingLink${idx}`}
                                                sx={{
                                                    marginRight: '8px',
                                                }}
                                            >
                                                <Tooltip
                                                    title={
                                                        !isMe ? (
                                                            toTitleCase(
                                                                pullDomainFrom(
                                                                    eachStreamingLink.link
                                                                )
                                                            )
                                                        ) : (
                                                            <Link to="/edit-artist-profile?field=streamingLinks">
                                                                Edit
                                                            </Link>
                                                        )
                                                    }
                                                    placement="bottom"
                                                    arrow
                                                >
                                                    <a
                                                        href={
                                                            eachStreamingLink.link
                                                        }
                                                        target="_blank"
                                                    >
                                                        {getFontAwesomeIcon(
                                                            eachStreamingLink.link
                                                        )}
                                                    </a>
                                                </Tooltip>
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            ) : (
                                ''
                            )} */}
                        </Grid>
                    </Grid>
                </Tooltip>
                {/* ) : (
				''
			)} */}
                {artist.bio ? (
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
                                About {stageName}:
                            </Typography>
                        </Tooltip>

                        {artist.bio}
                    </Grid>
                ) : (
                    ''
                )}
                <Grid
                    item
                    container
                    justifyContent="start"
                    direction="row"
                    className="mediaRow"
                    sx={{
                        padding: '8px 0px 0!important',
                        height: 'fit-content',
                    }}
                >
                    <Grid
                        item
                        container
                        sx={{
                            margin: '0 auto',
                            height: '100%',
                        }}
                        className="mediaTabEmbed"
                        direction="column"
                        md={8}
                        xs={12}
                    >
                        <Grid
                            item
                            container
                            sx={{
                                marginTop: '0',
                                width: '100%',

                                flexDirection: 'row',
                                justifyContent: {
                                    md: 'space-between',
                                    xs: 'center',
                                },
                            }}
                            className="mediaTabNav"
                        >
                            {mediaTabs.map((mediaTab, i) => (
                                <Grid
                                    item
                                    key={i}
                                    sx={{
                                        marginRight: {
                                            md: '8px',
                                        },
                                        marginBottom: '8px',
                                    }}
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link
                                                to={`/edit-artist-profile?field=${mediaTab.fieldName}`}
                                            >
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <Button
                                            variant="contained"
                                            component="span"
                                            onClick={(e) => setTabIndex(i)}
                                            btnwidth={mediaTab.width}
                                        >
                                            {mediaTab.title}
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid
                            item
                            sx={{
                                position: 'relative',
                                height: '400px',
                            }}
                        >
                            {mediaTabs.length > 0
                                ? transitions((style, i) => (
                                      <animated.div
                                          className={'animatedMediaTab'}
                                          key={'animatedMediaTab' + i}
                                          style={{
                                              ...style,
                                              position: 'absolute',
                                              width: '100%',
                                              height: '400px',
                                              //paddingBottom: '100%',
                                          }}
                                      >
                                          <ReactPlayer
                                              light={
                                                  (new URL(
                                                      mediaTabs[i].mediaLink
                                                  ).hostname !==
                                                      'music.youtube.com' &&
                                                      pullDomainFrom(
                                                          mediaTabs[i].mediaLink
                                                      ) === 'youtube') ||
                                                  pullDomainFrom(
                                                      mediaTabs[i].mediaLink
                                                  ) === 'youtu'
                                              }
                                              url={mediaTabs[i].mediaLink}
                                              width="100%"
                                              style={{
                                                  width: '100%',
                                                  padding: '0 8px 0 0',
                                              }}
                                          />
                                      </animated.div>
                                  ))
                                : ''}
                        </Grid>
                    </Grid>
                </Grid>
                {bookingWhenWhere &&
                bookingWhenWhere.length > 0 &&
                bookingWhenWhere[0].when ? ( //check to be sure there's a valid first entry
                    <Grid
                        item
                        container
                        justifyContent="start"
                        direction="row"
                        sx={{
                            height: '100%',
                            padding: '0 20px!important',
                            color: 'var(--primary-color)',

                            justifyContent: {
                                xs: 'center',
                            },
                        }}
                        className="bookingDetails"
                    >
                        <Grid direction="column" xs={12} md={12}>
                            <Grid item xs={12}>
                                <Typography component="h2">
                                    {stageName} is looking to book shows on
                                    these dates and in these locations:
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
                            >
                                {bookingWhenWhere
                                    .filter((e) => e)
                                    .map(
                                        (
                                            whenBooking,
                                            idx,
                                            whenWhereOrig //.filter(e => e) to remove any null values
                                        ) => (
                                            <Grid
                                                container
                                                item
                                                className="whenBooking"
                                                key={`whenBooking${idx}`}
                                                direction="row"
                                                md={3.7}
                                                sm={5.5}
                                                xs={12}
                                                sx={{
                                                    backgroundColor:
                                                        'rgba(0,0,0,0.35)',
                                                    '&:hover': {},
                                                    padding: '8px',
                                                    margin: '4px',
                                                    color: 'var(--light-color)',
                                                }}
                                            >
                                                <Tooltip
                                                    arrow={true}
                                                    disableHoverListener={!isMe}
                                                    disableFocusListener={!isMe}
                                                    disableTouchListener={!isMe}
                                                    title={
                                                        <Link to="/edit-artist-booking?field=bookingWhen">
                                                            Edit
                                                        </Link>
                                                    }
                                                >
                                                    {whenBooking &&
                                                    whenBooking.where ? (
                                                        <Grid
                                                            container
                                                            item
                                                            direction="row"
                                                            alignItems="center"
                                                            className="dateLocationForBooking"
                                                        >
                                                            <Grid item>
                                                                <StackDateforDisplay
                                                                    date={
                                                                        whenBooking.when
                                                                    }
                                                                ></StackDateforDisplay>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                sx={{
                                                                    fontSize:
                                                                        '1.5em',
                                                                    marginLeft:
                                                                        '8px',
                                                                }}
                                                            >
                                                                {whenBooking
                                                                    .where
                                                                    .city +
                                                                    ', ' +
                                                                    whenBooking
                                                                        .where
                                                                        .state}
                                                            </Grid>
                                                        </Grid>
                                                    ) : (
                                                        ''
                                                    )}
                                                </Tooltip>
                                            </Grid>
                                        )
                                    )}
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            xs={12}
                            md={8}
                            spacing={2}
                            sx={{
                                paddingLeft: {
                                    md: '16px',
                                    xs: '0px',
                                },
                                paddingTop: {
                                    md: '0px',
                                    xs: '16px',
                                },
                            }}
                            className="bookingSpecifics"
                        >
                            {artist.costStructure && artist.namedPrice ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="costStructure"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=costStructure">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        {artist.costStructure === 'donation' ? (
                                            <VolunteerActivismTwoToneIcon></VolunteerActivismTwoToneIcon>
                                        ) : (
                                            <ConfirmationNumberTwoToneIcon></ConfirmationNumberTwoToneIcon>
                                        )}
                                    </Tooltip>{' '}
                                    {'Concerts will be '}
                                    <strong>
                                        {artist.costStructure == 'ticket'
                                            ? 'ticketed'
                                            : 'donation-based'}
                                    </strong>
                                    {', at '}
                                    <strong>
                                        {' $'}
                                        {artist.namedPrice}
                                    </strong>
                                    {' per '}
                                    {artist.costStructure}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.tourVibe.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="tourVibe"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=tourVibe">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <GroupsTwoToneIcon></GroupsTwoToneIcon>
                                    </Tooltip>
                                    {
                                        ' Feels most comfortable performing for an audience who is: '
                                    }
                                    <strong>
                                        {artist.tourVibe.join(', ')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.showSchedule ? (
                                <Fragment>
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="showSchedule"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=showSchedule">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
                                        </Tooltip>
                                        {' Setup at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.setupTime
                                            )}
                                        </strong>
                                        {', doors open at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.doorsOpen
                                            )}
                                        </strong>
                                        {', show starts at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.startTime
                                            )}
                                        </strong>
                                        {', with a hard wrap at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.hardWrap
                                            )}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                </Fragment>
                            ) : (
                                ''
                            )}
                            {artist.overnight && artist.overnight > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=overnight">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <HotelTwoToneIcon></HotelTwoToneIcon>
                                    </Tooltip>
                                    {
                                        ' If possible, overnight accommodation appreciated for '
                                    }
                                    <strong>
                                        {artist.overnight +
                                            (artist.overnight > 1
                                                ? ' people'
                                                : ' person')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.merchTable ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="merchTable"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=merchTable">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would like a <strong>merch table</strong>{' '}
                                    (for CDs, t-shirts, etc.){' '}
                                    {artist.merchTable}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {/* {!artist.merchTable ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
					{' '}<strong>{'Does NOT need a merch table'}</strong>{' '}
					</Grid>
				: ''} */}
                            {artist.allergies.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="allergies"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=allergies">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SvgIcon
                                            style={{
                                                width: '26px',
                                                verticalAlign: 'baseline',
                                            }}
                                        >
                                            <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                                        </SvgIcon>
                                    </Tooltip>
                                    {' Has these allergies: '}
                                    <strong>
                                        {artist.allergies.constructor.name ===
                                            'Array' &&
                                            artist.allergies.map(
                                                (allergy, ind) => {
                                                    if (
                                                        ind !==
                                                        artist.allergies
                                                            .length -
                                                            1
                                                    ) {
                                                        return allergy + ', ';
                                                    } else {
                                                        return allergy;
                                                    }
                                                }
                                            )}{' '}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.familyFriendly ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'“Family-friendly”'}</strong>
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {!artist.familyFriendly ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <WcTwoToneIcon></WcTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would prefer to have an{' '}
                                    <strong>adults-only</strong> show
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'yes' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        {'Able to bring their own sound system'}
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'noButNeed' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'Needs a sound system'}</strong>{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'no' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        Able to play an acoustic show
                                    </strong>{' '}
                                    if it makes sense for the size of the space.{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.covidPrefs.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="covidPrefs"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=covidPrefs">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <CoronavirusTwoToneIcon></CoronavirusTwoToneIcon>
                                    </Tooltip>
                                    {' Considering Covid, would prefer: '}
                                    <strong>
                                        {artist.covidPrefs.constructor.name ===
                                            'Array' &&
                                            artist.covidPrefs.map(
                                                (covidPref, ind) => {
                                                    if (
                                                        ind !==
                                                        artist.covidPrefs
                                                            .length -
                                                            1
                                                    ) {
                                                        return covidPref + ', ';
                                                    } else {
                                                        return covidPref;
                                                    }
                                                }
                                            )}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.financialHopes ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="financialHopes"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=financialHopes">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SavingsTwoToneIcon></SavingsTwoToneIcon>
                                    </Tooltip>
                                    {' It would be hard to make less than '}
                                    <strong>${artist.financialHopes}</strong>
                                    {' per show'}

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.fanActions &&
                            artist.fanActions.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="fanActions"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=fanActions">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
                                    </Tooltip>
                                    {' How new fans can show support: '}
                                    <strong>
                                        {artist.fanActions.map(
                                            (fanAction, ind) => {
                                                if (
                                                    ind !==
                                                    artist.fanActions.length - 1
                                                ) {
                                                    return fanAction + ', ';
                                                } else {
                                                    return fanAction;
                                                }
                                            }
                                        )}{' '}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                        </Grid>
                    </Grid>
                ) : (
                    ''
                )}
            </Grid>
        </Fragment>
    );
};

ArtistProfile.propTypes = {
    artist: PropTypes.object.isRequired,
    me: PropTypes.object,
};

const mapStateToProps = (state) => ({
    me: state.artist.me,
});

export default connect(mapStateToProps)(withRouter(ArtistProfile)); //withRouter allows us to pass history objects