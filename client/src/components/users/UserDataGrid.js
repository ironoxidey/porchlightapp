import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';

import { getAllUsers, updateUserRole } from '../../actions/auth';
import { getArtistByEmail } from '../../actions/artist';

import { Avatar, Autocomplete, Chip, TextField, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UserDataGrid = ({
    getArtistByEmail,
    getAllUsers,
    updateUserRole,
    users,
}) => {
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
                updateUserRole({ userID: id, role: roleState });
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
            setRoleState(autoCompleteInput.current.value);
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
        console.log('ProfileCell props', props);
        const artistEmail = props.row.email;

        const [artistSlug, setArtistSlug] = useState('');
        const [artistStageName, setArtistStageName] = useState('');

        const getArtistSlug = async () => {
            const gottenArtistSlug = await getArtistByEmail(artistEmail);
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
        getAllUsers();
    }, [getAllUsers]);

    const userColumns = [
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
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: false,
        },
        {
            field: 'role',
            headerName: 'Role(s)',
            width: 350,
            // editable: true,
            sortable: false,
            renderCell: renderAutoCompleteEditInputCell,
            // renderEditCell: renderAutoCompleteEditInputCell,
        },
        {
            field: 'profile',
            headerName: 'Profile',
            width: 250,
            sortable: true,
            renderCell: renderProfileCell,
        },
        {
            field: 'lastLogin',
            headerName: 'Last Logged in',
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
        {
            field: 'dateRegistered',
            headerName: 'Registered on',
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
        if (users) {
            setUserRows(
                users.map((user) => {
                    const userRow = {
                        id: user._id,
                        avatar: user.avatar,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        profile: '',
                        lastLogin: user.lastLogin || user.date,
                        dateRegistered: user.date,
                    };

                    return userRow;
                })
            );
            //console.log(userRows);
        }
    }, [users]);

    const [userRows, setUserRows] = useState([]);

    return (
        <DataGrid
            rows={userRows}
            columns={userColumns}
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
    );
};

UserDataGrid.propTypes = {
    users: PropTypes.array.isRequired,
    getAllUsers: PropTypes.func.isRequired,
    getArtistByEmail: PropTypes.func.isRequired,
    updateUserRole: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    users: state.auth.users,
});

export default connect(mapStateToProps, {
    getAllUsers,
    getArtistByEmail,
    updateUserRole,
})(UserDataGrid);
