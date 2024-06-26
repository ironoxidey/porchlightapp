import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { getAllEvents, deleteAdminEvent } from '../../actions/event';

// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import {
    Avatar,
    Autocomplete,
    Chip,
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    IconButton,
    Rating,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { toTitleCase } from '../../actions/app';
import states from 'us-state-converter';

import { ProfileAvatar } from '../../common/components';
import HostProfile from '../hosts/HostProfile';
import EventHostDialog from './EventHostDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArtistReviewsHostDisplay from '../artists/ArtistReviewsHostDisplay';
import HostReviewsEventDisplay from '../hosts/HostReviewsEventDisplay';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

const EventDataGrid = ({
    getAllEvents,
    deleteAdminEvent,
    auth: { user },
    adminEvents,
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
                        className="porchlightBG"
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
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        //.isRequired,
    };

    function ProfileCell(props) {
        const { id, value, api, field } = props;
        // console.log('ProfileCell props', props);
        // console.log('ProfileCell value', value);
        const artistEmail = props.row.email;

        const [artistSlug, setArtistSlug] = useState('');
        const [artistStageName, setArtistStageName] = useState('');

        const getArtistSlug = async () => {
            if (value) {
                const gottenArtistSlug = value || { slug: '', stageName: '' }; //await getArtistByEmail(artistEmail);
                setArtistSlug(gottenArtistSlug.slug);
                setArtistStageName(gottenArtistSlug.stageName);
            }
        };

        useEffect(() => {
            getArtistSlug();
        }, []);

        let preferredArtists = props.row.theEvent.preferredArtists.map(
            (thePrefArtist, i) => {
                const artistDeclined =
                    !props.row.theEvent.declinedArtists ||
                    props.row.theEvent.declinedArtists.filter(
                        (declinedArtist) => {
                            return declinedArtist.artist === thePrefArtist._id;
                        }
                    ).length <= 0
                        ? false
                        : true;
                // console.log(
                //     'props.row.theEvent.confirmedArtist',
                //     props.row.theEvent.confirmedArtist
                // );
                const artistConfirmed =
                    props.row.theEvent.confirmedArtist &&
                    props.row.theEvent.confirmedArtist._id === thePrefArtist._id
                        ? true
                        : false;

                return (
                    <>
                        <Grid
                            container
                            sx={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'center',
                                width: 'max-content',
                            }}
                        >
                            <>
                                <Grid item sx={{ padding: '4px 4px 4px 0px' }}>
                                    <Box
                                        className="squareImgInACircle"
                                        sx={{
                                            display: 'flex',

                                            width: '40px',
                                            height: '40px',
                                            maxHeight: '40px',
                                            maxWidth: '40px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            backgroundImage: `url("${thePrefArtist.squareImg}")`,
                                            backgroundBlendMode: 'normal',
                                            // filter: declined
                                            //     ? 'grayscale(100%)'
                                            //     : '',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            backgroundPosition: '50% 25%',
                                            backgroundSize: 'cover',
                                            padding: '4px',
                                            backgroundClip: 'content-box',
                                            border: artistConfirmed
                                                ? '1px solid var(--link-color)'
                                                : artistDeclined
                                                ? '1px solid #777'
                                                : '1px dashed var(--primary-color)',
                                            // margin: '0 8px 0 0',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            aspectRatio: '1 / 1',
                                        }}
                                    ></Box>
                                </Grid>

                                <Grid
                                    container
                                    item
                                    sx={{ flexDirection: 'column' }}
                                >
                                    <Grid
                                        item
                                        sx={{
                                            display: 'block',
                                            width: 'auto',
                                            // whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {thePrefArtist.stageName}
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            display: 'block',
                                            width: 'auto',
                                            color: `${
                                                artistConfirmed
                                                    ? 'var(--link-color)'
                                                    : artistDeclined
                                                    ? '#bbb'
                                                    : 'var(--primary-color)'
                                            }`,
                                            fontSize: '.9em',
                                        }}
                                    >
                                        {artistConfirmed
                                            ? '(Accepted)'
                                            : artistDeclined
                                            ? '(Declined)'
                                            : '(Hasn’t responded)'}
                                    </Grid>
                                </Grid>
                            </>
                        </Grid>
                    </>
                );
            }
        );

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

                {props.row.theEvent.preferredArtists &&
                    props.row.theEvent.preferredArtists.length > 0 && (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={<>{preferredArtists}</>}
                        >
                            <Grid
                                item
                                sx={{
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    // margin: '0 8px 0 0',
                                    margin: 'auto 4px',
                                    justifyContent: 'space-around',
                                    // alignItems: 'space-between',
                                    alignContent: 'space-evenly',
                                }}
                                className="preferredArtistsWrapper"
                            >
                                {props.row.theEvent.preferredArtists.map(
                                    (prefArtist) => {
                                        let avatarSize =
                                            30 /
                                                props.row.theEvent
                                                    .preferredArtists.length -
                                            4 *
                                                (props.row.theEvent
                                                    .preferredArtists.length -
                                                    1);

                                        let confirmed = false;

                                        const declined =
                                            !props.row.theEvent
                                                .declinedArtists ||
                                            props.row.theEvent.declinedArtists.filter(
                                                (declinedArtist) => {
                                                    return (
                                                        declinedArtist.artist ===
                                                        prefArtist._id
                                                    );
                                                }
                                            ).length <= 0
                                                ? false
                                                : true;

                                        if (
                                            props.row.theEvent
                                                .confirmedArtist &&
                                            props.row.theEvent.confirmedArtist
                                                ._id === prefArtist._id
                                        ) {
                                            confirmed = true;
                                        }

                                        if (
                                            props.row.theEvent.preferredArtists
                                                .length > 2
                                        ) {
                                            // Find the square root of the input number
                                            const squareRoot = Math.sqrt(
                                                props.row.theEvent
                                                    .preferredArtists.length
                                            );

                                            // Round up the square root to the nearest integer
                                            const roundedSquareRoot =
                                                Math.ceil(squareRoot);

                                            // Calculate the square of the rounded square root
                                            const roundedSquare =
                                                roundedSquareRoot *
                                                roundedSquareRoot;

                                            avatarSize = Math.abs(
                                                //to avoid negative numbers
                                                30 / roundedSquareRoot //30, because that's the size of a single profile image
                                                // -
                                                // 4 * (roundedSquareRoot - 1) //add spacing around
                                            );
                                        }

                                        return (
                                            <>
                                                <Grid item>
                                                    {/* <Tooltip
                                                    arrow={true}
                                                    placement="bottom"
                                                    title={prefArtist.stageName}
                                                > */}
                                                    <Box
                                                        className="squareImgInACircle"
                                                        sx={{
                                                            display: 'flex',

                                                            width:
                                                                avatarSize +
                                                                'px',
                                                            height:
                                                                avatarSize +
                                                                'px',
                                                            maxHeight:
                                                                avatarSize +
                                                                'px',
                                                            maxWidth:
                                                                avatarSize +
                                                                'px',
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            backgroundImage: `url("${prefArtist.squareImg}")`,
                                                            backgroundBlendMode:
                                                                confirmed
                                                                    ? 'normal'
                                                                    : 'soft-light',
                                                            backgroundColor:
                                                                'rgba(0,0,0,0.5)',
                                                            backgroundPosition:
                                                                '50% 25%',
                                                            backgroundSize:
                                                                'cover',
                                                            // padding: '4px',
                                                            backgroundClip:
                                                                'content-box',
                                                            border: confirmed
                                                                ? '1px solid var(--link-color)'
                                                                : declined
                                                                ? '1px solid #777'
                                                                : '1px dashed var(--primary-color)',
                                                            // margin: '0 8px 0 0',
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                            aspectRatio:
                                                                '1 / 1',
                                                        }}
                                                    >
                                                        {!confirmed &&
                                                        !declined ? (
                                                            <Typography
                                                                sx={{
                                                                    // width:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // height:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // maxHeight:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // maxWidth:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    fontFamily:
                                                                        'Tahoma',
                                                                    margin: 'auto',
                                                                    fontSize:
                                                                        avatarSize *
                                                                            0.8 +
                                                                        'px',
                                                                    opacity:
                                                                        '.2',
                                                                    lineHeight:
                                                                        '1',
                                                                    textShadow:
                                                                        '0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1);',
                                                                    cursor: 'default',
                                                                }}
                                                            >
                                                                ?
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    // width:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // height:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // maxHeight:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    // maxWidth:
                                                                    //     avatarSize +
                                                                    //     'px',
                                                                    fontFamily:
                                                                        'Tahoma',
                                                                    margin: 'auto',
                                                                    fontSize:
                                                                        avatarSize *
                                                                            0.8 +
                                                                        'px',
                                                                    opacity:
                                                                        '.2',
                                                                    lineHeight:
                                                                        '1',
                                                                    textShadow:
                                                                        '0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1);',
                                                                    cursor: 'default',
                                                                }}
                                                            >
                                                                &nbsp;
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    {/* </Tooltip> */}
                                                </Grid>
                                            </>
                                        );
                                    }
                                )}
                            </Grid>
                        </CustomWidthTooltip>
                    )}
            </>
        );
    }

    function renderProfileCell(params) {
        //console.log('ProfileCell params', params);
        return <ProfileCell {...params}></ProfileCell>;
    }

    function prettifyDate(date) {
        // return new Date(date).toLocaleDateString(undefined, {
        return new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
        });
    }

    useEffect(() => {
        getAllEvents();
    }, [getAllEvents]);

    const [deleteEventId, setDeleteEventID] = useState();

    useEffect(() => {}, []);

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
        { field: 'index', headerName: 'Index', width: 10 },
        { field: 'createdBy', headerName: 'Created By', width: 90 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
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
                if (params.value === 'CONFIRMED') {
                    let confirmedDate = params.row.theEvent.confirmedDate;
                    return (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={<>{confirmedDate}</>}
                        >
                            <span
                                style={{
                                    // color: 'var(--link-color)',
                                    borderBottom:
                                        '1px dotted rgba(255,255,255,.4)',
                                    display: 'block',
                                    cursor: 'pointer',
                                }}
                            >
                                {params.value}
                            </span>
                        </CustomWidthTooltip>
                    );
                } else {
                    return;
                }
            },
        },
        {
            field: 'artist' || 'preferredArtist',
            cellClassName: 'profileCell',
            headerName: 'Artist',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: renderProfileCell,
        },
        // {
        //     field: 'agreeToPayAdminFee',
        //     headerName: 'Agreed to Fee',
        //     width: 75,
        //     sortable: true,
        //     renderCell: (params) => {
        //         if (params.value === true) {
        //             return <ThumbUpIcon></ThumbUpIcon>;
        //         } else {
        //             return (
        //                 <ThumbDownAltOutlinedIcon></ThumbDownAltOutlinedIcon>
        //             );
        //         }
        //     },
        // },
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
            field: 'payoutHandle',
            headerName: 'Payout Handle',
            width: 170,
            editable: false,
            type: 'string',
            sortable: true,
        },
        {
            field: 'bookingWhen',
            headerName: 'Event Date',
            width: 230,
            editable: false,
            type: 'date',
            valueFormatter: (params) => {
                // if (params.value) {
                if (params) {
                    return prettifyDate(params);
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
                } else if (params.city && params.state) {
                    return params.city + ', ' + params.state;
                } else {
                    return;
                }
            },
        },
        {
            field: 'offersFromHosts',
            headerName: 'Offers from Hosts',
            cellClassName: 'profileCell',
            width: 240,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: lengthSort,
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    let hostsOffering = params.value.map((hostOffer, i) => {
                        //console.log('hostOffer params', params);
                        return (
                            <EventHostDialog
                                theHost={hostOffer.host}
                                theEvent={params.row.theEvent}
                                theOffer={hostOffer}
                                key={'hostOffer' + i}
                            >
                                <ProfileAvatar
                                    firstName={hostOffer.host.firstName}
                                    lastName={hostOffer.host.lastName}
                                    city={hostOffer.host.city}
                                    state={hostOffer.host.state}
                                    profileImg={hostOffer.host.profileImg}
                                    hostOffer={hostOffer}
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
                                            <div
                                                style={{ textAlign: 'center' }}
                                            >{`${hostOffer.host.firstName} ${hostOffer.host.lastName}`}</div>
                                            <div
                                                style={{ textAlign: 'center' }}
                                            >
                                                <PlaceTwoToneIcon
                                                    sx={{
                                                        marginRight: '2px',
                                                        fontSize: '1.4em',
                                                        marginBottom: '2px',
                                                    }}
                                                ></PlaceTwoToneIcon>

                                                {`${hostOffer.host.city}, ${hostOffer.host.state}`}
                                            </div>
                                            {hostOffer.status ===
                                                'ACCEPTED' && (
                                                <div
                                                    style={{
                                                        color: 'var(--link-color)',
                                                    }}
                                                >{`This offer was accepted.`}</div>
                                            )}
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
            field: 'hostReachRadius',
            headerName: 'Radius',
            width: 80,
            editable: false,
            type: 'string',
            valueFormatter: (params) => {
                // if (params.value) {
                if (params) {
                    return params + ' miles';
                } else {
                    return;
                }
            },
        },

        {
            field: 'hostsInReach',
            headerName: 'Hosts in Area',
            width: 150,
            editable: false,
            type: 'string',
            sortable: true,
            sortComparator: lengthSort,
            renderCell: (params) => {
                // console.log('hostsInReach params', params);

                if (params.value && params.value.length > 0) {
                    let hostsInReach = params.value.map((hostInReach, i) => {
                        const hostDeclined =
                            params.row.theEvent.declinedHosts &&
                            params.row.theEvent.declinedHosts.some(
                                (declinedHost) =>
                                    declinedHost.host === hostInReach.host._id
                            );

                        const emailBody = `Hi ${
                            (hostInReach.host && hostInReach.host.firstName) ||
                            ''
                        },%0D%0A%0D%0A${encodeURIComponent(
                            params.row.stageName
                        )} is looking to play a Porchlight concert near ${
                            params.row.bookingWhere.city
                        }, ${params.row.bookingWhere.state} on ${prettifyDate(
                            params.row.bookingWhen
                        )}.%0D%0AWould you please visit https://app.porchlight.art/artists/${
                            params.row.profile.slug
                        } to check out the details and let us know if you’re available, and wanting, to host the concert.%0D%0A%0D%0AThank you so much!`;
                        return (
                            // <Tooltip
                            //     arrow={true}
                            //     placement="bottom"
                            //     title={
                            //         <>
                            //             <div>
                            //                 <a
                            //                     target="_blank"
                            //                     href={`mailto:${
                            //                         hostInReach.host.email
                            //                     }?subject=${encodeURIComponent(
                            //                         params.row.stageName
                            //                     )} is looking to play a Porchlight concert near you!&body=${emailBody}`}
                            //                 >
                            //                     {hostInReach.host.email}
                            //                 </a>
                            //             </div>
                            //         </>
                            //     }
                            // >
                            <Grid
                                container
                                sx={{
                                    position: 'relative',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    flexWrap: 'nowrap',
                                    alignItems: 'center',
                                    width: 'max-content',
                                    '&::after': hostDeclined
                                        ? {
                                              content: '"Declined"',
                                              position: 'absolute',
                                              width: '100%',
                                              color: 'var(--primary-color)',
                                              zIndex: '100',
                                              textAlign: 'center',
                                              fontSize: '1.6em',
                                              textShadow:
                                                  '-1px -1px 3px rgba(0,0,0,.6), -1px 1px 3px rgba(0,0,0,.6), 1px -1px 3px rgba(0,0,0,.6), 1px 1px 3px rgba(0,0,0,.6)',
                                          }
                                        : {},
                                }}
                            >
                                {hostInReach && hostInReach.host && (
                                    <Grid
                                        container
                                        sx={{
                                            position: 'relative',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            flexWrap: 'nowrap',
                                            alignItems: 'center',
                                            width: 'max-content',
                                            // filter: hostDeclined
                                            //     ? 'blur(0.8px)'
                                            //     : 'blur(0px)',
                                            opacity: hostDeclined ? '0.6' : '1',
                                            '&::after': hostDeclined
                                                ? {
                                                      content: '""',
                                                      position: 'absolute',
                                                      width: '100%',
                                                      backgroundColor:
                                                          'var(--primary-color)',
                                                      zIndex: '99',
                                                      height: '2px',
                                                      boxShadow:
                                                          '2px 1px 3px rgba(0,0,0,1), -2px 1px 3px rgba(0,0,0,.6), 2px -1px 3px rgba(0,0,0,.6), 2px 1px 3px rgba(0,0,0,.6)',
                                                  }
                                                : {},
                                        }}
                                    >
                                        <Grid
                                            item
                                            sx={{ padding: '4px 4px 4px 0px' }}
                                        >
                                            <ProfileAvatar
                                                profileImg={
                                                    hostInReach.host.profileImg
                                                }
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            sx={{
                                                display: 'inline-block',
                                                width: 'auto',
                                                // whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {hostInReach.host.firstName}{' '}
                                            {hostInReach.host.lastName}
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                display: 'inline-block',
                                                width: 'auto',

                                                padding: '0px 8px 0px 8px',
                                                //whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {toTitleCase(hostInReach.host.city)}
                                            ,{' '}
                                            {
                                                states(hostInReach.host.state)
                                                    .usps
                                            }
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                display: 'inline-block',
                                                width: 'auto',
                                            }}
                                        >
                                            <a
                                                target="_blank"
                                                href={`mailto:${
                                                    hostInReach.host.email
                                                }?subject=${encodeURIComponent(
                                                    params.row.stageName
                                                )} is looking to play a Porchlight concert near you!&body=${emailBody}`}
                                            >
                                                {hostInReach.host.email}
                                            </a>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                            // </Tooltip>
                        );
                    });
                    return (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={<>{hostsInReach}</>}
                        >
                            <span
                                style={{
                                    color: 'var(--link-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                {hostsInReach.length}{' '}
                                {hostsInReach.length > 1 ? ' hosts' : ' host'}
                            </span>
                        </CustomWidthTooltip>
                    );
                } else {
                    return;
                }
            },
        },
        {
            field: 'artistReviewOfHost',
            headerName: 'Artist Review',
            width: 150,
            editable: false,
            type: 'string',
            sortable: true,
            // sortComparator: lengthSort,
            renderCell: (params) => {
                // console.log('artistReviewOfHost params', params);

                if (params.value) {
                    let artistReview = params.value;
                    return (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={
                                <>
                                    <ArtistReviewsHostDisplay
                                        theEvent={params.row.theEvent}
                                    />
                                </>
                            }
                        >
                            <span
                                style={{
                                    color: 'var(--link-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                Artist Review
                            </span>
                        </CustomWidthTooltip>
                    );
                } else {
                    return;
                }
            },
        },
        {
            field: 'hostReviewOfEvent',
            headerName: 'Host Review',
            width: 150,
            editable: false,
            type: 'string',
            sortable: true,
            // sortComparator: lengthSort,
            renderCell: (params) => {
                console.log('hostReviewOfEvent params', params);

                if (
                    params.row.theEvent.hostReviewOfEvent &&
                    params.row.theEvent.hostReviewOfEvent._id
                ) {
                    return (
                        <CustomWidthTooltip
                            arrow={true}
                            placement="bottom"
                            title={
                                <>
                                    <HostReviewsEventDisplay
                                        theEvent={params.row.theEvent}
                                    />
                                </>
                            }
                        >
                            <span
                                style={{
                                    color: 'var(--link-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                Host Review
                            </span>
                        </CustomWidthTooltip>
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
                // if (params.value) {
                if (params) {
                    return new Date(params).toLocaleString('en-US');
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
        {
            field: 'delete', // Custom field for the delete button
            headerName: 'Delete',
            sortable: false,
            width: 70,
            editable: false,
            type: 'string',
            renderCell: (params) => (
                <>
                    {deleteEventId &&
                        deleteEventId === params.row.theEvent._id && (
                            <Dialog
                                open={true}
                                onClose={() => setDeleteEventID('')}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                className="porchlightBG"
                            >
                                <DialogTitle id="alert-dialog-title"></DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <Avatar
                                            // firstName={
                                            //     params.row.theEvent
                                            //         .createdBy === 'ARTIST'
                                            //         ? params.row.theEvent.artist
                                            //               .firstName
                                            //         : params.row.theEvent
                                            //               .offersFromHosts[0]
                                            //               .host.firstName
                                            // }
                                            // lastName={
                                            //     params.row.theEvent
                                            //         .createdBy === 'ARTIST'
                                            //         ? params.row.theEvent.artist
                                            //               .lastName
                                            //         : params.row.theEvent
                                            //               .offersFromHosts[0]
                                            //               .host.lastName
                                            // }
                                            sx={{
                                                width: '150px',
                                                height: '150px',
                                                margin: '0 auto 20px',
                                            }}
                                            src={
                                                params.row.theEvent
                                                    .createdBy === 'ARTIST'
                                                    ? params.row.theEvent.artist
                                                          .squareImg
                                                    : params.row.theEvent
                                                          .offersFromHosts[0]
                                                          .host.profileImg
                                            }
                                            // tooltip={
                                            //     <>
                                            //         <div>{`${
                                            //             params.row.theEvent
                                            //                 .createdBy ===
                                            //             'ARTIST'
                                            //                 ? params.row
                                            //                       .theEvent
                                            //                       .artist
                                            //                       .stageName
                                            //                 : params.row
                                            //                       .theEvent
                                            //                       .offersFromHosts[0]
                                            //                       .host
                                            //                       .firstName +
                                            //                   ' ' +
                                            //                   params.row
                                            //                       .theEvent
                                            //                       .offersFromHosts[0]
                                            //                       .host.lastName
                                            //         }`}</div>
                                            //     </>
                                            // }
                                        />
                                        <Typography
                                            component="h2"
                                            sx={{ textWrap: 'balance' }}
                                        >
                                            You are about to delete the event on{' '}
                                            {new Date(
                                                params.row.theEvent.bookingWhen
                                            ).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                                            })}{' '}
                                            created by (
                                            {params.row.theEvent.createdBy}){' '}
                                            {params.row.theEvent.createdBy ===
                                            'ARTIST'
                                                ? params.row.theEvent.artist
                                                      .stageName
                                                : params.row.theEvent
                                                      .offersFromHosts[0].host
                                                      .firstName +
                                                  ' ' +
                                                  params.row.theEvent
                                                      .offersFromHosts[0].host
                                                      .lastName}
                                            .
                                        </Typography>{' '}
                                        <Typography
                                            component={'p'}
                                            sx={{
                                                textAlign: 'center',
                                                marginTop: '10px',
                                            }}
                                        >
                                            Are you sure you mean to do this?
                                            <br />
                                            (There's no undoing this!)
                                        </Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => setDeleteEventID('')}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            setDeleteEventID('');

                                            deleteAdminEvent(
                                                params.row.theEvent
                                            );
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    <Grid item className="deleteBtn" xs={1}>
                        <IconButton
                            onClick={() => {
                                // console.log('Delete: ', params);
                                setDeleteEventID(params.row.theEvent._id);
                                // deleteAdminEvent(params.row.theEvent);
                            }}
                            size="large"
                        >
                            <DeleteIcon></DeleteIcon>
                        </IconButton>
                    </Grid>
                </>
            ),
        },
    ];

    useEffect(() => {
        //console.log('adminEvents', adminEvents);
        if (adminEvents && adminEvents.length > 0) {
            setEventRows(
                adminEvents.map((adminEvent, i) => {
                    const eventRow = {
                        index: i,
                        theEvent: adminEvent,
                        id: adminEvent._id,
                        agreeToPayAdminFee: adminEvent.agreeToPayAdminFee,
                        artist: adminEvent.artist,
                        name:
                            adminEvent.artist &&
                            adminEvent.artist.firstName +
                                ' ' +
                                adminEvent.artist.lastName,
                        email: adminEvent.artistEmail,
                        stageName:
                            (adminEvent.artist &&
                                adminEvent.artist.stageName) ||
                            (adminEvent.confirmedArtist &&
                                adminEvent.confirmedArtist.stageName) ||
                            '',
                        profile:
                            adminEvent.artist ||
                            adminEvent.confirmedArtist ||
                            '',
                        createdAt: adminEvent.createdAt,
                        hostReachRadius: adminEvent.hostReachRadius,
                        hostsInReach: adminEvent.hostsInReach,
                        offersFromHosts: adminEvent.offersFromHosts,
                        status: adminEvent.status,
                        createdBy: adminEvent.createdBy,
                        bookingWhen: adminEvent.bookingWhen,
                        bookingWhere: adminEvent.bookingWhere,
                        payoutHandle:
                            adminEvent.payoutHandle ||
                            (adminEvent.confirmedArtist &&
                                adminEvent.confirmedArtist.payoutHandle) ||
                            '',
                        artistReviewOfHost: adminEvent.artistReviewOfHost,
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
                <DataGridPro
                    // sx={{ overflowX: 'scroll' }}
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
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    sx={{ width: '100%' }}
                />
            </Grid>
        )
    );
};

EventDataGrid.propTypes = {
    getAllEvents: PropTypes.func.isRequired,
    deleteAdminEvent: PropTypes.func.isRequired,
    adminEvents: PropTypes.array,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    adminEvents: state.event.adminEvents,
});

export default connect(mapStateToProps, {
    getAllEvents,
    deleteAdminEvent,
})(EventDataGrid);
