import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

import { getAllEvents } from '../../actions/event';

import { Avatar, Autocomplete, Chip, TextField, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
            <Fragment>
                {adminAlertUser && adminAlertUser.value && (
                    <Dialog
                        open={adminAlertOpen}
                        onClose={adminAlertHandleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <Avatar
                                alt={`${adminAlertUser.row.avatar}`}
                                src={`${adminAlertUser.row.avatar}`}
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
                        // console.log();
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
            </Fragment>
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
            <Fragment>
                {artistSlug && (
                    <Link to={'/artists/' + artistSlug}>{artistStageName}</Link>
                )}
            </Fragment>
        );
    }

    function renderProfileCell(params) {
        return <ProfileCell {...params}></ProfileCell>;
    }

    useEffect(() => {
        getAllEvents();
    }, [getAllEvents]);

    const profileSort = (v1, v2) => {
        if (v1.slug && v2.slug) {
            console.log(
                'v1(' + v1.slug + ') and v2(' + v2.slug + ') returns: ',
                v1.slug.localeCompare(v2.slug)
            );
            return v1.slug.localeCompare(v2.slug);
        } else if (v1.slug) {
            return -1;
        } else if (v2.slug) {
            return 1;
        }
        return 0;
    };

    const eventColumns = [
        //https://codesandbox.io/s/e9o2j?file=/demo.js
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Avatar alt={`${params.value}`} src={`${params.value}`} />
            ),
        },
        { field: 'name', headerName: 'Name', width: 180 },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: false,
        },
        // {
        //     field: 'role',
        //     headerName: 'Role(s)',
        //     width: 500,
        //     // editable: true,
        //     sortable: false,
        //     renderCell: renderAutoCompleteEditInputCell,
        //     // renderEditCell: renderAutoCompleteEditInputCell,
        // },
        {
            field: 'profile',
            headerName: 'Artist Profile',
            width: 200,
            sortable: true,
            //valueParser: (params) => params.row.profile.slug,
            renderCell: renderProfileCell,
            sortComparator: profileSort,
        },
        {
            field: 'bookingWhen',
            headerName: 'Event Date',
            width: 200,
            editable: false,
            type: 'date',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Date(params.value).toLocaleDateString(
                        undefined,
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    );
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
                        id: adminEvent._id,
                        avatar: adminEvent.artist.squareImg,
                        name:
                            adminEvent.artist.firstName +
                            ' ' +
                            adminEvent.artist.lastName,
                        email: adminEvent.artistEmail,
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
            console.log(eventRows);
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
                            sortModel: [{ field: 'lastLogin', sort: 'desc' }],
                        },
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
