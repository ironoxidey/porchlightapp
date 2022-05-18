import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { getAllEvents } from '../../actions/event';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Avatar,
    Autocomplete,
    Chip,
    TextField,
    Button,
    Grid,
    Tooltip,
} from '@mui/material';
import { ProfileAvatar } from '../../common/components';
import HostProfile from '../hosts/HostProfile';
import EventHostDialog from './EventHostDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

const EventDataGrid = ({ getAllEvents, auth: { user }, adminEvents }) => {
    const changesMade = useRef(false);
    const [editRowsModel, setEditRowsModel] = React.useState({});

    const handleEditRowsModelChange = React.useCallback((model) => {
        //console.log('model', model);
        setEditRowsModel(model);
    }, []);

    AutocompleteEditInputCell.propTypes = {
        /**
         * GridApi that let you manipulate the grid.
         * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
         */
        api: PropTypes.any.isRequired,
        /**
         * The column field of the cell that triggered the event.
         */
        field: PropTypes.string.isRequired,
        /**
         * The grid row id.
         */
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        /**
         * The cell value, but if the column has valueGetter, use getValue.
         */
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
            .isRequired,
    };

    const [adminAlertOpen, setAdminAlertOpen] = useState(false);
    const adminAlertHandleClose = () => {
        setAdminAlertOpen(false);
    };

    function AutocompleteEditInputCell(props) {
        //console.log('AutocompleteEditInputCell props', props);
        const { id, value, api, field } = props;

        const [adminAlertUser, setAdminAlertUserState] = useState({});
        const autoCompleteInput = useRef(null);

        const [roleState, setRoleState] = useState([]);
        const changesMade = useRef(false);

        useEffect(() => {
            if (value) {
                setRoleState(value);
            }
        }, []);
        useEffect(() => {
            //console.log('roleState changed to', roleState);
            if (changesMade.current) {
                //updateUserRole({ userID: id, role: roleState });
                changesMade.current = false;
            }
        }, [roleState]);

        useEffect(() => {
            //console.log('adminAlertUser', adminAlertUser);
            setAdminAlertOpen(true);
        }, [adminAlertUser]);

        const onAutocompleteConfirmTagChange = (e, theFieldName, val) => {
            if (value.indexOf('ADMIN') === -1 && val.indexOf('ADMIN') !== -1) {
                //if adding ADMIN to a user's roles, prompt for confirmation--checking 'value' to be sure they weren't already an admin
                setAdminAlertUserState({ ...props, value: val });
            } else {
                onAutocompleteTagChange(val);
            }
        };

        const onAutocompleteTagChange = (val) => {
            //console.log('onAutocompleteTagChange val', val);
            changesMade.current = true;
            autoCompleteInput.current.value = val;
            //console.log('autoCompleteInput', autoCompleteInput.current.value);
            //setRoleState(autoCompleteInput.current.value);
            //setFormData({ ...formData, [theFieldName]: targetValue });
        };

        return (
            <>
                {adminAlertUser && adminAlertUser.value && (
                    <Dialog
                        open={adminAlertOpen}
                        onClose={adminAlertHandleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <Avatar
                                alt={`${adminAlertUser.row.artist}`}
                                src={`${adminAlertUser.row.artist}`}
                                sx={{
                                    width: '150px',
                                    height: '150px',
                                    margin: '0 auto',
                                }}
                            />

                            {'Are you sure you want ' +
                                adminAlertUser.row.name +
                                ' (' +
                                adminAlertUser.row.email +
                                ') to have the ADMIN role?'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Giving this user the ADMIN role will give them
                                access to everything. You should only do this if
                                you really trust {adminAlertUser.row.name}.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={adminAlertHandleClose}>No</Button>
                            <Button
                                onClick={(e) => {
                                    adminAlertHandleClose();
                                    onAutocompleteTagChange(
                                        adminAlertUser.value
                                    );
                                }}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                <Autocomplete
                    ref={autoCompleteInput}
                    //id="role"
                    name="role"
                    multiple
                    disableCloseOnSelect
                    disableClearable
                    value={roleState || value}
                    options={['ADMIN', 'ARTIST', 'ATTENDER', 'BOOKING', 'HOST']}
                    onChange={(event, value) => {
                        onAutocompleteConfirmTagChange(event, 'role', value);
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                name="role"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={params.length > 0}
                            sx={{ width: '100%' }}
                            variant="standard"
                            //label={`Role`}
                            name="role"
                        />
                    )}
                    sx={{
                        width: '100%',
                    }}
                />
            </>
        );
    }

    function renderAutoCompleteEditInputCell(params) {
        //console.log('renderAutoCompleteEditInputCell params', params);
        return <AutocompleteEditInputCell {...params} />;
    }

    ProfileCell.propTypes = {
        /**
         * GridApi that let you manipulate the grid.
         * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
         */
        api: PropTypes.any.isRequired,
        /**
         * The column field of the cell that triggered the event.
         */
        field: PropTypes.string.isRequired,
        /**
         * The grid row id.
         */
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        /**
         * The cell value, but if the column has valueGetter, use getValue.
         */
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
            .isRequired,
    };

    function ProfileCell(props) {
        const { id, value, api, field } = props;
        //console.log('ProfileCell props', props);
        const artistEmail = props.row.email;

        const [artistSlug, setArtistSlug] = useState('');
        const [artistStageName, setArtistStageName] = useState('');

        const getArtistSlug = async () => {
            const gottenArtistSlug = value; //await getArtistByEmail(artistEmail);
            setArtistSlug(gottenArtistSlug.slug);
            setArtistStageName(gottenArtistSlug.stageName);
        };

        useEffect(() => {
            getArtistSlug();
        }, []);

        //console.log('artistSlug', artistSlug);
        return (
            <>
                {artistSlug && (
                    <Link to={'/artists/' + artistSlug}>
                        <ProfileAvatar
                            firstName={props.value.firstName}
                            lastName={props.value.lastName}
                            profileImg={props.value.squareImg}
                            tooltip={
                                <>
                                    <div>{`${props.value.firstName} ${props.value.lastName}`}</div>
                                </>
                            }
                        />
                    </Link>
                )}
            </>
        );
    }

    function renderProfileCell(params) {
        //console.log('ProfileCell params', params);
        return <ProfileCell {...params}></ProfileCell>;
    }

    function prettifyDate(date) {
        return new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    useEffect(() => {
        getAllEvents();
    }, [getAllEvents]);

    const profileSort = (v1, v2) => {
        if (v1.slug && v2.slug) {
            // console.log(
            //     'v1(' + v1.slug + ') and v2(' + v2.slug + ') returns: ',
            //     v1.slug.localeCompare(v2.slug)
            // );
            return v1.slug.localeCompare(v2.slug);
        } else if (v1.slug) {
            return -1;
        } else if (v2.slug) {
            return 1;
        }
        return 0;
    };
    const locationSort = (v1, v2) => {
        if (v1.state.localeCompare(v2.state) === 0) {
            return v1.city.localeCompare(v2.city);
        }
        return v1.state.localeCompare(v2.state);
    };

    const lengthSort = (v1, v2) => {
        if (v1.length === v2.length) {
            //console.log('v1(' + v1.length + ') and v2(' + v2.length + ')');
            return 0;
        } else if (v1.length > v2.length) {
            //console.log('v1(' + v1.length + ') and v2(' + v2.length + ')');
            return 1;
        } else if (v1.length < v2.length) {
            return -1;
        }
    };

    const eventColumns = [
        //https://codesandbox.io/s/e9o2j?file=/demo.js
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'artist',
            headerName: 'Artist',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: renderProfileCell,
        },
        // { field: 'name', headerName: 'Name', width: 180 },
        // {
        //     field: 'email',
        //     headerName: 'Email',
        //     width: 250,
        //     editable: false,
        // },
        {
            field: 'stageName',
            headerName: 'Artist Name',
            width: 200,
            sortable: true,
            // valueFormatter: (params) => {
            //     if (params.value && params.value.stageName) {
            //         return params.value.stageName;
            //     }
            // },
            //sortComparator: profileSort,
        },
        // {
        //     field: 'profile',
        //     headerName: 'Artist Profile',
        //     width: 200,
        //     renderCell: renderProfileCell,
        // },
        {
            field: 'bookingWhen',
            headerName: 'Event Date',
            width: 200,
            editable: false,
            type: 'date',
            valueFormatter: (params) => {
                if (params.value) {
                    return prettifyDate(params.value);
                    // return new Date(params.value).toLocaleDateString(
                    //     undefined,
                    //     {
                    //         weekday: 'long',
                    //         year: 'numeric',
                    //         month: 'long',
                    //         day: 'numeric',
                    //     }
                    // );
                } else {
                    return;
                }
            },
        },
        {
            field: 'bookingWhere',
            headerName: 'Location',
            width: 170,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: locationSort,
            valueFormatter: (params) => {
                if (params.value && params.value.city && params.value.state) {
                    return params.value.city + ', ' + params.value.state;
                } else {
                    return;
                }
            },
        },
        {
            field: 'hostsInReach',
            headerName: 'Hosts in Area',
            width: 900,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: lengthSort,
            renderCell: (params) => {
                //console.log('hostsInReach params', params);
                if (params.value && params.value.length > 0) {
                    let hostsInReach = params.value.map((hostInReach, i) => {
                        return (
                            <Tooltip
                                arrow={true}
                                placement="bottom"
                                title={
                                    <>
                                        <div>
                                            {hostInReach.host.city},{' '}
                                            {hostInReach.host.state}
                                        </div>
                                        <div>
                                            <a
                                                target="_blank"
                                                href={`mailto:${
                                                    hostInReach.host.email
                                                }?subject=${
                                                    params.row.stageName
                                                } is looking to play a Porchlight concert near you!&body=Hi ${
                                                    hostInReach.host.firstName
                                                },%0D%0A%0D%0A${
                                                    params.row.stageName
                                                } is looking to play a Porchlight concert near ${
                                                    params.row.bookingWhere.city
                                                }, ${
                                                    params.row.bookingWhere
                                                        .state
                                                } on ${prettifyDate(
                                                    params.row.bookingWhen
                                                )}.%0D%0AWould you please visit https://app.porchlight.art/artists/${
                                                    params.row.profile.slug
                                                } to check out the details and let us know if you’re available, and wanting, to host the concert.%0D%0A%0D%0AThank you so much!`}
                                            >
                                                {hostInReach.host.email}
                                            </a>
                                        </div>
                                    </>
                                }
                            >
                                <span>
                                    {i > 0 && ', '}
                                    {hostInReach.host.firstName}{' '}
                                    {hostInReach.host.lastName}
                                </span>
                            </Tooltip>
                        );
                    });
                    return hostsInReach;
                } else {
                    return;
                }
            },
        },
        {
            field: 'offersFromHosts',
            headerName: 'Offers from Hosts',
            width: 300,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: lengthSort,
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    let hostsOffering = params.value.map((hostOffer, i) => {
                        console.log('hostOffer params', params);
                        return (
                            <EventHostDialog
                                theHost={hostOffer.host}
                                theEvent={params.row.theEvent}
                                theOffer={hostOffer}
                            >
                                <ProfileAvatar
                                    firstName={hostOffer.host.firstName}
                                    lastName={hostOffer.host.lastName}
                                    city={hostOffer.host.city}
                                    state={hostOffer.host.state}
                                    profileImg={hostOffer.host.profileImg}
                                    tooltip={
                                        <>
                                            {/* <HostProfile
                                            theHost={hostOffer.host}
                                            theEvent={params.row}
                                            theOffer={hostOffer}
                                            // eventDetailsDialogHandleClose={
                                            //     eventDetailsDialogHandleClose
                                            // }
                                        ></HostProfile> */}
                                            <div>{`${hostOffer.host.firstName} ${hostOffer.host.lastName}`}</div>
                                            <div>
                                                <PlaceTwoToneIcon
                                                    sx={{
                                                        marginRight: '2px',
                                                        fontSize: '1.4em',
                                                        marginBottom: '2px',
                                                    }}
                                                ></PlaceTwoToneIcon>
                                                {`${hostOffer.host.city}, ${hostOffer.host.state}`}
                                            </div>
                                        </>
                                    }
                                />
                            </EventHostDialog>
                        );
                    });
                    return hostsOffering;
                } else {
                    return;
                }
            },
        },

        {
            field: 'createdAt',
            headerName: 'Created on',
            width: 220,
            editable: false,
            type: 'dateTime',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Date(params.value).toLocaleString('en-US');
                } else {
                    return;
                }
            },
        },
    ];

    useEffect(() => {
        //console.log('adminEvents', adminEvents);
        if (adminEvents && adminEvents.length > 0) {
            setEventRows(
                adminEvents.map((adminEvent) => {
                    const eventRow = {
                        theEvent: adminEvent,
                        id: adminEvent._id,
                        artist: adminEvent.artist,
                        name:
                            adminEvent.artist.firstName +
                            ' ' +
                            adminEvent.artist.lastName,
                        email: adminEvent.artistEmail,
                        stageName: adminEvent.artist.stageName || '',
                        profile: adminEvent.artist || '',
                        createdAt: adminEvent.createdAt,
                        hostsInReach: adminEvent.hostsInReach,
                        offersFromHosts: adminEvent.offersFromHosts,
                        status: adminEvent.status,
                        bookingWhen: adminEvent.bookingWhen,
                        bookingWhere: adminEvent.bookingWhere,
                    };

                    return eventRow;
                })
            );
            //console.log(eventRows);
        }
    }, [adminEvents]);

    const [eventRows, setEventRows] = useState([]);

    return (
        user &&
        user.role &&
        (user.role.indexOf('ADMIN') > -1 ||
            user.role.indexOf('BOOKING') > -1) && (
            <Grid container direction="column" sx={{ height: '88vh' }}>
                <DataGrid
                    rows={eventRows}
                    columns={eventColumns}
                    pageSize={100}
                    rowsPerPageOptions={[]}
                    editRowsModel={editRowsModel}
                    onEditRowsModelChange={handleEditRowsModelChange}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'createdAt', sort: 'desc' }],
                        },
                    }}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                />
            </Grid>
        )
    );
};

EventDataGrid.propTypes = {
    getAllEvents: PropTypes.func.isRequired,
    adminEvents: PropTypes.array,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    adminEvents: state.event.adminEvents,
});

export default connect(mapStateToProps, {
    getAllEvents,
})(EventDataGrid);
