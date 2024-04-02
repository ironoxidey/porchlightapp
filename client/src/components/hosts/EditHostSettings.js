import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import { Grid, ListItemIcon, Typography } from '@mui/material';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SettingsIcon from '@mui/icons-material/Settings';

import HostAdminActiveFalse from '../hosts/HostAdminActiveFalse';

import {
    createMyHost,
    getCurrentHost,
    toggleMyHostActiveStatus,
} from '../../actions/host';

const EditHostSettings = ({
    createMyHost,
    hostMe,
    getCurrentHost,
    toggleMyHostActiveStatus,
}) => {
    useEffect(() => {
        getCurrentHost();
    }, [getCurrentHost]);

    const changesMade = useRef(false);

    const [formData, setFormData] = useState({
        email: '',
        notificationFrequency: 7, //default to 7 days
        active: false,
    });

    useEffect(() => {
        if (hostMe) {
            setFormData({
                email: !hostMe.email ? '' : hostMe.email,
                active: !hostMe.active ? false : hostMe.active,
                notificationFrequency:
                    !hostMe.notificationFrequency &&
                    hostMe.notificationFrequency !== 0
                        ? 7
                        : hostMe.notificationFrequency, //default to 7 days
            });
        }
    }, [hostMe]);
    useEffect(() => {
        if (changesMade.current) {
            //console.log(formData);
            createMyHost(formData, true);
            changesMade.current = false;
        }
    }, [formData]);

    const handleSwitchOnChange = () => {
        changesMade.current = true;
        setFormData({
            ...formData,
            notificationFrequency: notificationFrequency != 0 ? 0 : 7,
        });
    };
    const handleOnChange = (e) => {
        //console.log('e.target.value: ', e.target.value);
        if (Number(e.target.value) === 0) {
            //e.target.value is a string; have to convert it to a Number
            //if entering 0, it toggles the switch, but the switch doesn't register an onChange, and the textField doesn't register an onBlur
            //don't set changesMade.current = true on all onChanges because it creates a stutter in the ui, when it tries to update the database everytime the value changes
            //console.log('notificationFrequency should change to 0');
            changesMade.current = true;
        }
        setFormData({
            ...formData,
            notificationFrequency: e.target.value < 1 ? 0 : e.target.value,
        });
    };
    const onHandleBlur = (e) => {
        changesMade.current = true;
        setFormData({
            ...formData,
            notificationFrequency: e.target.value < 1 ? 0 : e.target.value,
        });
    };

    const { notificationFrequency, active } = formData;

    //Booking Details Dialog Functions
    const [editSettingsDialogOpen, setEditSettingsDialogOpen] = useState(false);

    const editSettingsDialogHandleClose = () => {
        setEditSettingsDialogOpen(false);
    };

    return (
        <>
            <Dialog
                open={editSettingsDialogOpen}
                onClose={editSettingsDialogHandleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                scroll="body"
                fullWidth
                maxWidth={'sm'}
                className="porchlightBG"
            >
                <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
                <DialogContent>
                    {hostMe.adminActive !== true && (
                        <HostAdminActiveFalse></HostAdminActiveFalse>
                    )}
                    <FormGroup
                        sx={{
                            alignItems: 'center',
                            marginTop: hostMe.adminActive !== true ? '16px' : 0,
                        }}
                    >
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={active}
                                        onChange={() =>
                                            toggleMyHostActiveStatus({
                                                active: !hostMe.active,
                                                notificationFrequency:
                                                    !hostMe.active ? 7 : 0,
                                            })
                                        }
                                        disabled={!hostMe.adminActive}
                                    />
                                }
                                label={
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            width: '100%',
                                            lineHeight: '1.3',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {active ? (
                                            <>
                                                I want to be an Active Host on
                                                the Porchlight network.{' '}
                                                <span
                                                    style={{
                                                        fontSize: '.8em',
                                                        display: 'block',
                                                        color: 'var(--primary-color)',
                                                    }}
                                                >
                                                    Represent me on the map, and
                                                    show on my dashboard when an
                                                    artist is looking to book in
                                                    my area.
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                Deactive my account, for now.{' '}
                                                <span
                                                    style={{
                                                        fontSize: '.8em',
                                                        display: 'block',
                                                        color: 'var(--primary-color)',
                                                    }}
                                                >
                                                    Don’t represent me on the
                                                    map, nor consider me a host
                                                    on the Porchlight network.
                                                </span>
                                            </>
                                        )}
                                    </Typography>
                                }
                                sx={{
                                    // display: '',
                                    margin: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            ></FormControlLabel>
                        </Grid>
                    </FormGroup>
                    <FormGroup
                        sx={{
                            alignItems: 'center',
                            marginTop: '16px',
                        }}
                    >
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationFrequency != 0}
                                        onChange={handleSwitchOnChange}
                                        disabled={!active}
                                    />
                                }
                                label={
                                    notificationFrequency != 0
                                        ? 'Send me emails'
                                        : "Don't send me emails"
                                }
                                sx={{ display: 'inline', margin: '0' }}
                            ></FormControlLabel>
                            {notificationFrequency != 0 && (
                                <>
                                    <Typography sx={{ display: 'inline' }}>
                                        {' '}
                                        as often as once every{' '}
                                    </Typography>
                                    <TextField
                                        sx={{
                                            width: '40px',
                                            margin: '3px 0 -3px',
                                            textAlign: 'center',
                                            '& input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        variant="standard"
                                        name="notificationFrequency"
                                        id="notificationFrequency"
                                        value={notificationFrequency}
                                        onChange={(e) => handleOnChange(e)}
                                        onBlur={(e) => onHandleBlur(e)}
                                        // autocomplete="none"
                                        type="number"
                                        // InputProps={{
                                        //     endAdornment: (
                                        //         <InputAdornment position="end">
                                        //             {notificationFrequency > 1
                                        //                 ? 'days'
                                        //                 : 'day'}
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                    />
                                    <Typography sx={{ display: 'inline' }}>
                                        {' '}
                                        {notificationFrequency > 1
                                            ? 'days.'
                                            : 'day.'}{' '}
                                        <span
                                            style={{
                                                fontSize: '.8em',
                                                display: 'block',
                                                color: 'var(--primary-color)',
                                            }}
                                        >
                                            (When an artist proposes a concert
                                            in my area, don’t email me about it
                                            if you’ve emailed me about another
                                            proposal in the last{' '}
                                            {notificationFrequency > 1
                                                ? notificationFrequency +
                                                  ' days. '
                                                : ' day. '}
                                            Multiple proposals will be batched
                                            and sent together in one email
                                            notification.)
                                        </span>
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </FormGroup>
                </DialogContent>
            </Dialog>

            <div
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    color: 'var(--link-color)',
                }}
                onClick={() => setEditSettingsDialogOpen(true)}
            >
                <ListItemIcon
                    sx={{ minWidth: '36px', alignItems: 'flex-start' }}
                >
                    <SettingsIcon></SettingsIcon>
                </ListItemIcon>{' '}
                Settings
            </div>
        </>
    );
};

EditHostSettings.propTypes = {
    toggleMyHostActiveStatus: PropTypes.func.isRequired,
    getCurrentHost: PropTypes.func.isRequired,
    createMyHost: PropTypes.func.isRequired,
    hostMe: PropTypes.object,
};

const mapStateToProps = (state) => ({
    hostMe: state.host.me,
});

//export default EditHostSettings;
export default connect(mapStateToProps, {
    createMyHost,
    getCurrentHost,
    toggleMyHostActiveStatus,
})(EditHostSettings); //withRouter allows us to pass history objects
