import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import EditArtistItem from './EditArtistItem';
import { getEditArtists } from '../../actions/artist';
import {
    getCalendlyScheduledEvents,
    getCalendlyEventInvitee,
    getCalendlyUserInfo,
    refreshCalendlyAuth,
} from '../../actions/calendly';

import {
    Autocomplete,
    TextField,
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    IconButton,
} from '@mui/material';

import Button from '../layout/SvgButton';
import UserDataGrid from '../users/UserDataGrid';

const EditArtists = ({
    auth: { user },
    artist: { artists, loading },
    calendly,
    getEditArtists,
    getCalendlyUserInfo,
    getCalendlyScheduledEvents,
    getCalendlyEventInvitee,
    refreshCalendlyAuth,
}) => {
    const [filterBy, setFilterBy] = useState('');
    const [filterString, setFilterString] = useState('');

    const filterArtists = (artists) => {
        if (
            artists.filter((artist) => {
                return artist[filterBy] === filterString;
            }).length > 0
        ) {
            return artists.filter((artist) => {
                return artist[filterBy] === filterString;
            });
        } else if (
            artists.filter((artist) => {
                for (var i in artist) {
                    if (artist[i]) {
                        if (
                            artist[i]
                                .toString()
                                .toLowerCase()
                                .indexOf(
                                    filterString.toString().toLowerCase()
                                ) > -1
                        )
                            return artist;
                    }
                }
            }).length > 0
        ) {
            return artists.filter((artist) => {
                for (var i in artist) {
                    if (artist[i]) {
                        if (
                            artist[i]
                                .toString()
                                .toLowerCase()
                                .indexOf(
                                    filterString.toString().toLowerCase()
                                ) > -1
                        )
                            return artist;
                    }
                }
            });
        } else if (filterString.length > 0) {
            return {};
        } else if (artists.length > 0) {
            return artists;
        }
    };

    useEffect(() => {
        getEditArtists();
        //console.log("There are "+filterArtists(artists).length+" artists to display.")
    }, [getEditArtists]);

    // useEffect(() => {
    //     if (user && user.calendly) {
    //         refreshCalendlyAuth(); //just go ahead and refresh the token all the time... why not? ... is that bad practice?
    //         getCalendlyUserInfo(user.calendly.accessToken);
    //         getCalendlyScheduledEvents(user.calendly.accessToken, user.calendly.owner );
    //     }
    // }, [user]);

    // useEffect(() => {
    //     if (calendly.events) {
    //         //console.log("Access Token: " + user.calendly.accessToken + " | Event URI: " + calendly.events.data.collection[0].uri);
    //         //console.log("Should run getCalendlyEventInvitee() now.");
    //         getCalendlyEventInvitee(user.calendly.accessToken, calendly.events.data.collection[0].uri);
    //     }
    // }, [calendly.events]);

    return (
        <Fragment>
            {loading ? (
                <Spinner></Spinner>
            ) : (
                <Fragment>
                    <Grid container sx={{ padding: '20px' }}>
                        <Grid
                            container
                            item
                            direction="row"
                            justifyContent="center"
                        >
                            <Button
                                onClick={() => {
                                    setFilterBy('');
                                    setFilterString('');
                                }}
                                btnwidth="250"
                            >
                                Show All {artists && artists.length} Artists
                            </Button>
                            <Button
                                onClick={() => {
                                    setFilterBy('active');
                                    setFilterString(false);
                                }}
                                btnwidth="320"
                            >
                                Show Only{' '}
                                {artists &&
                                    artists.filter((artist) => {
                                        return artist.active === false;
                                    }).length}{' '}
                                Inactive Artists
                            </Button>
                            <Button
                                onClick={() => {
                                    setFilterBy('active');
                                    setFilterString(true);
                                }}
                                btnwidth="300"
                            >
                                Show Only{' '}
                                {artists &&
                                    artists.filter((artist) => {
                                        return artist.active === true;
                                    }).length}{' '}
                                Active Artists
                            </Button>
                        </Grid>
                        <Grid
                            container
                            justifyContent="center"
                            sx={{
                                padding: '20px',
                            }}
                        >
                            <TextField
                                type="text"
                                placeholder="Search..."
                                name="search"
                                onChange={(e) =>
                                    setFilterString(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid container className="artists">
                            {!loading &&
                            artists &&
                            filterArtists(artists) &&
                            filterArtists(artists).length > 0 ? (
                                filterArtists(artists).map((theArtist) => (
                                    <EditArtistItem
                                        key={theArtist._id}
                                        theArtist={theArtist}
                                    />
                                ))
                            ) : (
                                <h4>No artists found...</h4>
                            )}
                        </Grid>
                    </Grid>
                </Fragment>
            )}
        </Fragment>
    );
};

EditArtists.propTypes = {
    getEditArtists: PropTypes.func.isRequired,
    getCalendlyScheduledEvents: PropTypes.func.isRequired,
    getCalendlyEventInvitee: PropTypes.func.isRequired,
    getCalendlyUserInfo: PropTypes.func.isRequired,
    refreshCalendlyAuth: PropTypes.func.isRequired,
    artist: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    calendly: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
    auth: state.auth,
    calendly: state.calendly,
});

export default connect(mapStateToProps, {
    getEditArtists,
    getCalendlyScheduledEvents,
    getCalendlyEventInvitee,
    getCalendlyUserInfo,
    refreshCalendlyAuth,
})(EditArtists);
