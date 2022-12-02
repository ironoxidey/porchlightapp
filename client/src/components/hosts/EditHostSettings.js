import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import { ListItemIcon } from '@mui/material';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SettingsIcon from '@mui/icons-material/Settings';

import { createMyHost, getCurrentHost } from '../../actions/host';

const EditHostSettings = ({ createMyHost, hostMe, getCurrentHost }) => {
    useEffect(() => {
        getCurrentHost();
    }, [getCurrentHost]);

    const changesMade = useRef(false);

    const [formData, setFormData] = useState({
        email: '',
        notificationFrequency: 7, //default to 7 days
    });

    useEffect(() => {
        if (hostMe) {
            setFormData({
                email: !hostMe.email ? '' : hostMe.email,
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
            console.log(formData);
            createMyHost(formData, true);
            changesMade.current = false;
        }
    }, [formData]);

    const handleOnChange = () => {
        changesMade.current = true;
        setFormData({
            ...formData,
            notificationFrequency: notificationFrequency != 0 ? 0 : 7,
        });
    };

    const { notificationFrequency } = formData;

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
            >
                <DialogTitle id="alert-dialog-title">
                    Notification Settings
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormGroup
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationFrequency != 0}
                                        onChange={handleOnChange}
                                    />
                                }
                                label={
                                    notificationFrequency != 0
                                        ? 'Send me emails'
                                        : "Don't send me emails"
                                }
                            />
                        </FormGroup>
                    </DialogContentText>
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
                Notification Settings
            </div>
        </>
    );
};

EditHostSettings.propTypes = {
    getCurrentHost: PropTypes.func.isRequired,
    createMyHost: PropTypes.func.isRequired,
    hostMe: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    hostMe: state.host.me,
});

//export default EditHostSettings;
export default connect(mapStateToProps, { createMyHost, getCurrentHost })(
    EditHostSettings
); //withRouter allows us to pass history objects
