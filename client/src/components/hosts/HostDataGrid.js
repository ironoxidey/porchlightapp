import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';

import {
    getAllHosts,
    toggleHostActiveStatus,
    toggleHostAdminActiveStatus,
} from '../../actions/host';
import { getArtistByEmail } from '../../actions/artist';

import {
    Avatar,
    Autocomplete,
    Chip,
    TextField,
    Button,
    Switch,
    Tooltip,
    tooltipClasses,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ProfileAvatar } from '../../common/components';
import EventHostDialog from '../events/EventHostDialog';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

import states from 'us-state-converter';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

const HostDataGrid = ({
    getArtistByEmail,
    getAllHosts,
    toggleHostActiveStatus,
    toggleHostAdminActiveStatus,
    hosts,
    auth: { user },
}) => {
    const changesMade = useRef(false);
    const [editRowsModel, setEditRowsModel] = React.useState({});

    const handleEditRowsModelChange = React.useCallback((model) => {
        //console.log('model', model);
        setEditRowsModel(model);
    }, []);

    // AutocompleteEditInputCell.propTypes = {
    //     /**
    //      * GridApi that let you manipulate the grid.
    //      * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
    //      */
    //     api: PropTypes.any.isRequired,
    //     /**
    //      * The column field of the cell that triggered the event.
    //      */
    //     field: PropTypes.string.isRequired,
    //     /**
    //      * The grid row id.
    //      */
    //     id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    //         .isRequired,
    //     /**
    //      * The cell value, but if the column has valueGetter, use getValue.
    //      */
    //     value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    //         .isRequired,
    // };

    // function AutocompleteEditInputCell(props) {
    //     //console.log('AutocompleteEditInputCell props', props);
    //     const { id, value, api, field } = props;

    //     const [adminAlertHost, setAdminAlertHostState] = useState({});
    //     const autoCompleteInput = useRef(null);

    //     const [roleState, setRoleState] = useState([]);
    //     const changesMade = useRef(false);

    //     useEffect(() => {
    //         if (value) {
    //             setRoleState(value);
    //         }
    //     }, []);
    //     useEffect(() => {
    //         //console.log('roleState changed to', roleState);
    //         if (changesMade.current) {
    //             // updateUserRole({ userID: id, role: roleState });
    //             changesMade.current = false;
    //         }
    //     }, [roleState]);

    //     useEffect(() => {
    //         //console.log('adminAlertHost', adminAlertHost);
    //         setAdminAlertOpen(true);
    //     }, [adminAlertHost]);

    //     const onAutocompleteConfirmTagChange = (e, theFieldName, val) => {
    //         if (
    //             (value.indexOf('ADMIN') === -1 && val.indexOf('ADMIN') > -1) ||
    //             (value.indexOf('BOOKING') === -1 && val.indexOf('BOOKING') > -1)
    //         ) {
    //             //if adding ADMIN to a user's roles, prompt for confirmation--checking 'value' to be sure they weren't already an admin
    //             //if adding BOOKING to a user's roles, prompt for confirmation--checking 'value' to be sure they weren't already an admin
    //             //console.log(val);
    //             setAdminAlertHostState({ ...props, value: val });
    //         } else {
    //             onAutocompleteTagChange(val);
    //         }
    //     };

    //     const onAutocompleteTagChange = (val) => {
    //         //console.log('onAutocompleteTagChange val', val);
    //         changesMade.current = true;
    //         autoCompleteInput.current.value = val;
    //         //console.log('autoCompleteInput', autoCompleteInput.current.value);
    //         setRoleState(autoCompleteInput.current.value);
    //         //setFormData({ ...formData, [theFieldName]: targetValue });
    //     };

    //     return (
    //         user &&
    //         user.role &&
    //         user.role.indexOf('ADMIN') > -1 && (
    //             <Fragment>
    //                 {adminAlertHost && adminAlertHost.value && (
    //                     <Dialog
    //                         open={adminAlertOpen}
    //                         onClose={adminAlertHandleClose}
    //                         aria-labelledby="alert-dialog-title"
    //                         aria-describedby="alert-dialog-description"
    //                         className="porchlightBG"
    //                     >
    //                         <DialogTitle id="alert-dialog-title">
    //                             <Avatar
    //                                 alt={`${adminAlertHost.row.avatar}`}
    //                                 src={`${adminAlertHost.row.avatar}`}
    //                                 sx={{
    //                                     width: '150px',
    //                                     height: '150px',
    //                                     margin: '0 auto',
    //                                 }}
    //                             />

    //                             {`Are you sure you want set ` +
    //                                 adminAlertHost.row.firstName +
    //                                 `  ` +
    //                                 adminAlertHost.row.lastName +
    //                                 ` (` +
    //                                 adminAlertHost.row.email +
    //                                 `) to ${
    //                                     adminAlertHost.active
    //                                         ? ` inactive`
    //                                         : ` active`
    //                                 }?`}
    //                         </DialogTitle>
    //                         <DialogContent>
    //                             <DialogContentText id="alert-dialog-description">
    //                                 {value.indexOf('ADMIN') === -1 &&
    //                                 adminAlertHost.value.indexOf('ADMIN') > -1
    //                                     ? `Giving this user the ADMIN role will give
    //                                 them access to everything. You should only
    //                                 do this if you really trust
    //                                 ${adminAlertHost.row.name}.`
    //                                     : `Giving this user the BOOKING role will give
    //                                 them access to our entire network of hosts. You should only
    //                                 do this if you really trust
    //                                 ${adminAlertHost.row.name}.`}
    //                             </DialogContentText>
    //                         </DialogContent>
    //                         <DialogActions>
    //                             <Button onClick={adminAlertHandleClose}>
    //                                 No
    //                             </Button>
    //                             <Button
    //                                 onClick={(e) => {
    //                                     adminAlertHandleClose();
    //                                     onAutocompleteTagChange(
    //                                         adminAlertHost.value
    //                                     );
    //                                 }}
    //                             >
    //                                 Yes
    //                             </Button>
    //                         </DialogActions>
    //                     </Dialog>
    //                 )}
    //                 <Autocomplete
    //                     ref={autoCompleteInput}
    //                     //id="role"
    //                     name="role"
    //                     multiple
    //                     disableCloseOnSelect
    //                     disableClearable
    //                     value={roleState || value}
    //                     options={[
    //                         'ADMIN',
    //                         'ARTIST',
    //                         'ATTENDER',
    //                         'BOOKING',
    //                         'HOST',
    //                         'TESTING',
    //                     ]}
    //                     onChange={(event, value) => {
    //                         // console.log();
    //                         onAutocompleteConfirmTagChange(
    //                             event,
    //                             'role',
    //                             value
    //                         );
    //                     }}
    //                     renderTags={(value, getTagProps) =>
    //                         value.map((option, index) => (
    //                             <Chip
    //                                 variant="outlined"
    //                                 name="role"
    //                                 label={option}
    //                                 {...getTagProps({ index })}
    //                             />
    //                         ))
    //                     }
    //                     renderInput={(params) => (
    //                         <TextField
    //                             {...params}
    //                             error={params.length > 0}
    //                             sx={{ width: '100%' }}
    //                             variant="standard"
    //                             //label={`Role`}
    //                             name="role"
    //                         />
    //                     )}
    //                     sx={{
    //                         width: '100%',
    //                     }}
    //                 />
    //             </Fragment>
    //         )
    //     );
    // }

    // function renderAutoCompleteEditInputCell(params) {
    //     //console.log('renderAutoCompleteEditInputCell params', params);
    //     return <AutocompleteEditInputCell {...params} />;
    // }

    // ProfileCell.propTypes = {
    //     /**
    //      * GridApi that let you manipulate the grid.
    //      * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
    //      */
    //     api: PropTypes.any.isRequired,
    //     /**
    //      * The column field of the cell that triggered the event.
    //      */
    //     field: PropTypes.string.isRequired,
    //     /**
    //      * The grid row id.
    //      */
    //     id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    //         .isRequired,
    //     /**
    //      * The cell value, but if the column has valueGetter, use getValue.
    //      */
    //     value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    //         .isRequired,
    // };

    // function ProfileCell(props) {
    //     const { id, value, api, field } = props;
    //     //console.log('ProfileCell props', props);
    //     const artistEmail = props.row.email;

    //     const [artistSlug, setArtistSlug] = useState('');
    //     const [artistStageName, setArtistStageName] = useState('');

    //     const getArtistSlug = async () => {
    //         const gottenArtistSlug = value; //await getArtistByEmail(artistEmail);
    //         setArtistSlug(gottenArtistSlug.slug);
    //         setArtistStageName(gottenArtistSlug.stageName);
    //     };

    //     useEffect(() => {
    //         getArtistSlug();
    //     }, []);

    //     //console.log('artistSlug', artistSlug);
    //     return (
    //         <Fragment>
    //             {artistSlug && (
    //                 <Link to={'/artists/' + artistSlug}>{artistStageName}</Link>
    //             )}
    //         </Fragment>
    //     );
    // }

    // function renderProfileCell(params) {
    //     return <ProfileCell {...params}></ProfileCell>;
    // }

    useEffect(() => {
        getAllHosts();
    }, [getAllHosts]);

    // useEffect(() => {
    //     if (hosts) {
    //         console.log(
    //             hosts.filter((host) => {
    //                 return host.events.length > 0;
    //             })
    //         );
    //     }
    // }, [hosts]);

    const profileSort = (v1, v2) => {
        if (v1.lastName && v2.lastName) {
            // console.log(
            //     'v1(' + v1.slug + ') and v2(' + v2.slug + ') returns: ',
            //     v1.slug.localeCompare(v2.slug)
            // );
            return v1.lastName.localeCompare(v2.lastName);
        } else if (v1.lastName) {
            return -1;
        } else if (v2.lastName) {
            return 1;
        }
        return 0;
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

    const [adminAlertHost, setAdminAlertHostState] = useState({});
    const [adminAlertOpen, setAdminAlertOpen] = useState(false);

    function AdminActiveSwitchEditCell(params) {
        const adminAlertHandleClose = () => {
            setAdminAlertHostState({});
            setAdminAlertOpen(false);
        };
        const adminActiveSwitchChange = (params) => {
            // console.log('activeSwitchChange', params);
            setAdminAlertOpen(true);
            setAdminAlertHostState({ ...params });
        };

        return (
            user &&
            user.role &&
            user.role.indexOf('ADMIN') > -1 && (
                <Fragment>
                    {adminAlertHost &&
                        adminAlertHost.row &&
                        adminAlertHost.row.id === params.row.id && (
                            <Dialog
                                open={adminAlertOpen}
                                onClose={adminAlertHandleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                className="porchlightBG"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    <Avatar
                                        alt={`${adminAlertHost.row.profileImg}`}
                                        src={`${adminAlertHost.row.profileImg}`}
                                        sx={{
                                            width: '150px',
                                            height: '150px',
                                            margin: '0 auto',
                                        }}
                                    />

                                    {`Are you sure you want to ${
                                        adminAlertHost.row.adminActive
                                            ? `deactivate `
                                            : `activate `
                                    }` +
                                        adminAlertHost.row.firstName +
                                        `  ` +
                                        adminAlertHost.row.lastName +
                                        ` (` +
                                        adminAlertHost.row.email +
                                        `)?`}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`${
                                            adminAlertHost.row.adminActive
                                                ? `${
                                                      adminAlertHost.row
                                                          .firstName +
                                                      ' ' +
                                                      adminAlertHost.row
                                                          .lastName
                                                  }’s location will no longer be added to the artist map, and ${
                                                      adminAlertHost.row
                                                          .firstName
                                                  } will not receive host email digests, until an ADMIN reactivates the account.`
                                                : `${
                                                      adminAlertHost.row
                                                          .firstName +
                                                      ' ' +
                                                      adminAlertHost.row
                                                          .lastName
                                                  }’s location will be added to the artist map, and ${
                                                      adminAlertHost.row
                                                          .firstName
                                                  } will receive host email digests as often as once every 7 days.`
                                        }`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={adminAlertHandleClose}>
                                        No
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            toggleHostActiveStatus({
                                                email: adminAlertHost.row.email,
                                                adminActive:
                                                    !adminAlertHost.value,
                                                active: !adminAlertHost.value,
                                                notificationFrequency:
                                                    !adminAlertHost.value
                                                        ? 7
                                                        : 0,
                                            });
                                            adminAlertHandleClose();
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    <Switch
                        checked={params.value}
                        onChange={() => adminActiveSwitchChange(params)}
                    />
                </Fragment>
            )
        );
    }

    const [activeAlertHost, setActiveAlertHostState] = useState({});
    const [activeAlertOpen, setActiveAlertOpen] = useState(false);

    function ActiveSwitchEditCell(params) {
        const activeAlertHandleClose = () => {
            setActiveAlertHostState({});
            setActiveAlertOpen(false);
        };
        const activeSwitchChange = (params) => {
            // console.log('activeSwitchChange', params);
            setActiveAlertOpen(true);
            setActiveAlertHostState({ ...params });
        };

        return (
            user &&
            user.role &&
            user.role.indexOf('ADMIN') > -1 && (
                <Fragment>
                    {activeAlertHost &&
                        activeAlertHost.row &&
                        activeAlertHost.row.id === params.row.id && (
                            <Dialog
                                open={activeAlertOpen}
                                onClose={activeAlertHandleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                className="porchlightBG"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    <Avatar
                                        alt={`${activeAlertHost.row.profileImg}`}
                                        src={`${activeAlertHost.row.profileImg}`}
                                        sx={{
                                            width: '150px',
                                            height: '150px',
                                            margin: '0 auto',
                                        }}
                                    />

                                    {`Are you sure you want to ${
                                        activeAlertHost.row.active
                                            ? `deactivate `
                                            : `activate `
                                    }` +
                                        activeAlertHost.row.firstName +
                                        `  ` +
                                        activeAlertHost.row.lastName +
                                        ` (` +
                                        activeAlertHost.row.email +
                                        `)?`}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`${
                                            activeAlertHost.row.active
                                                ? `${
                                                      activeAlertHost.row
                                                          .firstName +
                                                      ' ' +
                                                      activeAlertHost.row
                                                          .lastName
                                                  }’s location will no longer be added to the artist map, and ${
                                                      activeAlertHost.row
                                                          .firstName
                                                  } will no longer receive host email digests.`
                                                : `${
                                                      activeAlertHost.row
                                                          .firstName +
                                                      ' ' +
                                                      activeAlertHost.row
                                                          .lastName
                                                  }’s location will be added to the artist map, and ${
                                                      activeAlertHost.row
                                                          .firstName
                                                  } will receive host email digests as often as once every 7 days.`
                                        } ${
                                            activeAlertHost.row.firstName
                                        } is free to change this.`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={activeAlertHandleClose}>
                                        No
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            toggleHostActiveStatus({
                                                email: activeAlertHost.row
                                                    .email,
                                                active: !activeAlertHost.value,
                                                notificationFrequency:
                                                    !activeAlertHost.value
                                                        ? 7
                                                        : 0,
                                            });
                                            activeAlertHandleClose();
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    <Switch
                        checked={params.value}
                        onChange={() => activeSwitchChange(params)}
                    />
                </Fragment>
            )
        );
    }

    const hostColumns = [
        //https://codesandbox.io/s/e9o2j?file=/demo.js
        {
            field: 'adminActive',
            headerName: 'Admin Active',
            width: 100,
            sortable: true,
            renderCell: (params) => {
                return AdminActiveSwitchEditCell(params);
            },
        },
        {
            field: 'active',
            headerName: 'Active',
            width: 100,
            sortable: true,
            renderCell: (params) => {
                return ActiveSwitchEditCell(params);
            },
        },
        {
            field: 'profileImg',
            headerName: 'Avatar',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Avatar alt={`${params.value}`} src={`${params.value}`} />
            ),
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 100,
            sortable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 100,
            sortable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: false,
            sortable: true,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
            editable: false,
        },
        {
            field: 'streetAddress',
            headerName: 'Street Address',
            width: 200,
            editable: false,
            sortable: true,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: 'state',
            headerName: 'State',
            width: 80,
            editable: false,
            sortable: true,
        },
        {
            field: 'events',
            headerName: 'Events Hosted',
            width: 300,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: lengthSort,
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    let eventsHosted = params.value.map((eventHosted, i) => {
                        //console.log('eventHosted params', params);
                        return (
                            <EventHostDialog
                                theHost={eventHosted.confirmedHost}
                                theEvent={eventHosted}
                                theOffer={eventHosted.offersFromHosts.filter(
                                    (offer) => {
                                        return (
                                            offer.host ===
                                            eventHosted.confirmedHost
                                        );
                                    }
                                )}
                                key={'eventHosted' + i}
                            >
                                <ProfileAvatar
                                    firstName={eventHosted.artist.stageName}
                                    city={params.row.city}
                                    state={params.row.state}
                                    profileImg={eventHosted.artist.squareImg}
                                    eventHosted={eventHosted}
                                    tooltip={
                                        <>
                                            {/* <HostProfile
                                            theHost={eventHosted.host}
                                            theEvent={params.row}
                                            theOffer={eventHosted}
                                            // eventDetailsDialogHandleClose={
                                            //     eventDetailsDialogHandleClose
                                            // }
                                        ></HostProfile> */}
                                            <div
                                                style={{ textAlign: 'center' }}
                                            >{`${eventHosted.artist.stageName}`}</div>
                                            <div
                                                style={{ textAlign: 'center' }}
                                            >
                                                {/* <PlaceTwoToneIcon
                                                    sx={{
                                                        marginRight: '2px',
                                                        fontSize: '1.4em',
                                                        marginBottom: '2px',
                                                    }}
                                                ></PlaceTwoToneIcon> */}

                                                {`${new Date(
                                                    eventHosted.bookingWhen
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                                                    }
                                                )}`}
                                            </div>
                                        </>
                                    }
                                />
                            </EventHostDialog>
                        );
                    });
                    return eventsHosted;
                } else {
                    return;
                }
            },
        },
        {
            field: 'notificationFrequency',
            headerName: 'Notify At Most Every',
            width: 140,
            editable: false,
            sortable: true,
            valueFormatter: (params) => {
                if (params.value > 1) {
                    return params.value + ' days';
                } else if (params.value === 1) {
                    return params.value + ' day';
                } else if (params.value === 0) {
                    return 'Never';
                } else {
                    return '7 days';
                }
            },
        },
        {
            field: 'lastEmailed',
            headerName: 'Last Emailed',
            width: 200,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: (v1, v2) => {
                if (v1 && v2) {
                    if (Array.isArray(v1) && Array.isArray(v2)) {
                        // console.log('lastEmailed: Both are arrays');
                        if (v1[v1.length - 1] > v2[v2.length - 1]) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else if (Array.isArray(v1) && !Array.isArray(v2)) {
                        // console.log('lastEmailed: v1 is the only array');
                        if (v1[v1.length - 1] > v2) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else if (!Array.isArray(v1) && Array.isArray(v2)) {
                        // console.log('lastEmailed: v2 in the only array');
                        if (v1 > v2[v2.length - 1]) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        // console.log('lastEmailed:neither are arrays');
                        if (v1 > v2) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                } else if (v1 && !v2) {
                    return 1;
                } else {
                    return -1;
                }
            },

            renderCell: (params) => {
                if (
                    params.value &&
                    params.value.length > 0 &&
                    Array.isArray(params.value)
                ) {
                    let emailHistory = params.value.map((emailedOn, i) => {
                        return (
                            <div key={'emailedOn' + i}>
                                {new Date(emailedOn).toLocaleString('en-US')}
                            </div>
                        );
                    });
                    return (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={<>{emailHistory}</>}
                        >
                            <span
                                style={{
                                    color: 'var(--link-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                {new Date(
                                    params.value[params.value.length - 1]
                                ).toLocaleString('en-US')}
                            </span>
                        </CustomWidthTooltip>
                    );
                } else if (params.value && params.value != '') {
                    return new Date(params.value).toLocaleString('en-US');
                } else {
                    return;
                }
            },
        },
        {
            field: 'lastLogin',
            headerName: 'Last Logged in',
            width: 200,
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
        {
            field: 'id',
            headerName: 'Database ID',
            width: 220,
            editable: false,
            type: 'string',
        },
    ];

    useEffect(() => {
        if (
            hosts &&
            hosts.length > 0 &&
            hosts[0]._id //check to be sure we have the hosts in the state that are for admins (_id is not returned for anyone else)
        ) {
            setHostRows(
                hosts.map((host) => {
                    const hostRow = {
                        id: host._id,
                        profileImg: host.profileImg,
                        name: host.name,
                        email: host.email,
                        firstName: host.firstName,
                        lastName: host.lastName,
                        phone: host.phone,
                        streetAddress: host.streetAddress,
                        city: host.city,
                        // state: host.state,
                        state: states(host.state.trim()).usps,
                        // events:
                        //     host.events && host.events.length > 0
                        //         ? host.events.length
                        //         : 0,
                        events: host.events ? host.events : 0,
                        lastEmailed: host.everyTimeEmailed || host.lastEmailed,
                        notificationFrequency: host.notificationFrequency,
                        profile: host.artistProfile || '',
                        lastLogin: host.lastLogin || host.date,
                        dateRegistered: host.date,
                        adminActive: host.adminActive,
                        active: host.active,
                    };

                    return hostRow;
                })
            );
            //console.log(hostRows);
        }
    }, [hosts]);

    const [hostRows, setHostRows] = useState([]);

    return (
        user &&
        user.role &&
        user.role.indexOf('ADMIN') > -1 && (
            <DataGrid
                rows={hostRows}
                columns={hostColumns}
                pageSize={100}
                rowsPerPageOptions={[]}
                editRowsModel={editRowsModel}
                onEditRowsModelChange={handleEditRowsModelChange}
                getRowClassName={(params) =>
                    `${!params.row.active ? 'inactive-host' : ''}`
                }
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'lastLogin', sort: 'desc' }],
                    },
                }}
            />
        )
    );
};

HostDataGrid.propTypes = {
    auth: PropTypes.object.isRequired,
    hosts: PropTypes.array.isRequired,
    getAllHosts: PropTypes.func.isRequired,
    toggleHostAdminActiveStatus: PropTypes.func.isRequired,
    toggleHostActiveStatus: PropTypes.func.isRequired,
    getArtistByEmail: PropTypes.func.isRequired,
    // updateUserRole: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    hosts: state.host.hosts,
});

export default connect(mapStateToProps, {
    getAllHosts,
    toggleHostAdminActiveStatus,
    toggleHostActiveStatus,
    getArtistByEmail,
    // updateUserRole,
})(HostDataGrid);
