import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist, updateArtists } from '../../actions/artist';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Switch,
    FormGroup,
    FormControlLabel,
    Autocomplete,
    TextField,
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    Checkbox,
    IconButton,
} from '@mui/material';

import Button from '../layout/SvgButton';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const EditArtistAdmin = ({
    theArtist,
    createArtist,
    updateArtists,
    history,
    artist,
}) => {
    const [formData, setFormData] = useState({
        email: '',
        typeformDate: '',
        hadMeeting: '',
        sentFollowUp: '',
        active: '',
        notes: '',
        onboardDate: '',
    });

    useEffect(() => {
        setFormData({
            email: !theArtist.email ? '' : theArtist.email,
            typeformDate: !theArtist.typeformDate ? '' : theArtist.typeformDate,
            hadMeeting:
                theArtist.hadMeeting == null ? false : theArtist.hadMeeting, //because it's a boolean variable, asking !theArtist.hadMeeting could result in it being set '' if theArtist.hadMeeting is FALSE in the database
            sentFollowUp:
                theArtist.sentFollowUp == null ? false : theArtist.sentFollowUp,
            active: theArtist.active == null ? false : theArtist.active,
            notes: !theArtist.notes ? '' : theArtist.notes,
            onboardDate: !theArtist.onboardDate ? '' : theArtist.onboardDate,
        });
    }, [artist]); //depends on changes to 'artist' in the state, because sometimes the email field wouldn't fill in and it would mess up the server update

    const {
        email,
        typeformDate,
        hadMeeting,
        sentFollowUp,
        active,
        notes,
        onboardDate,
    } = formData;

    // const formDataArray = [
    //   email,
    //   typeformDate,
    //   hadMeeting,
    //   sentFollowUp,
    //   active,
    //   notes,
    //   onboardDate,
    // ];

    const changesMade = useRef(false);

    useEffect(() => {
        if (changesMade.current) {
            updateArtists(formData, history, true);
            changesMade.current = false;
        }
    }, [active]);

    const onChange = (e) => {
        changesMade.current = true;
        let targetValue = e.target.value;
        switch (e.target.type) {
            case 'checkbox':
                targetValue = e.target.checked;
                break;
            default:
                targetValue = e.target.value;
        }
        setFormData({ ...formData, [e.target.name]: targetValue });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        updateArtists(formData, history, true);
        changesMade.current = false;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Fragment>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <Grid container spacing={2}>
                        <Grid item className="admin-form-group">
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="active"
                                        checked={!!active}
                                        onChange={(e) => {
                                            onChange(e);
                                        }}
                                        value={active}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>

                        <Grid item className="admin-form-group">
                            <TextField
                                name="typeformDate"
                                id="typeformDate"
                                label="Typeform Date"
                                //type='date'
                                //variant="filled"
                                value={typeformDate}
                                onChange={(e) => onChange(e)}
                            />
                        </Grid>

                        <Grid item className="admin-form-group">
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            label="Had Zoom Meeting"
                                            name="hadMeeting"
                                            value={hadMeeting}
                                            checked={!!hadMeeting}
                                            onChange={(e) => onChange(e)}
                                            inputProps={{
                                                'aria-label': 'controlled',
                                            }}
                                        />
                                    }
                                    label="Had Zoom Meeting"
                                />
                            </FormGroup>
                        </Grid>

                        <Grid item className="admin-form-group">
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="sentFollowUp"
                                            value={sentFollowUp}
                                            checked={!!sentFollowUp}
                                            onChange={(e) => onChange(e)}
                                            inputProps={{
                                                'aria-label': 'controlled',
                                            }}
                                        />
                                    }
                                    label="Sent Follow-up"
                                />
                            </FormGroup>
                        </Grid>

                        <Grid item className="admin-form-group">
                            <TextField
                                variant="standard"
                                name="notes"
                                multiline
                                id="notes"
                                label="Admin Notes"
                                value={notes}
                                onChange={(e) => onChange(e)}
                                sx={{ width: '100%' }}
                            />
                        </Grid>

                        <Grid item className="admin-form-group">
                            <TextField
                                type="text"
                                placeholder="Onboard Date"
                                name="onboardDate"
                                value={onboardDate}
                                onChange={(e) => onChange(e)}
                            />
                            <small className="form-text">Onboard Date</small>
                        </Grid>

                        <input type="submit" className="btn btn-primary my-1" />
                    </Grid>
                </form>
            </Fragment>
        </ThemeProvider>
    );
};

EditArtistAdmin.propTypes = {
    createArtist: PropTypes.func.isRequired,
    updateArtists: PropTypes.func.isRequired,
    theArtist: PropTypes.object.isRequired,
    artist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
});

export default connect(mapStateToProps, { createArtist, updateArtists })(
    withRouter(EditArtistAdmin)
); //withRouter allows us to pass history objects
