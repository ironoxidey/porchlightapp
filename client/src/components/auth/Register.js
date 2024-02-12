import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

import {
    TextField,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputLabel,
    InputAdornment,
    Grid,
    Box,
    Paper,
    Autocomplete,
    withStyles,
    Typography,
} from '@mui/material';

import Button from '../layout/SvgButton';

//import axios from 'axios';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Register = ({ setAlert, register, isAuthenticated, bookingDialog }) => {
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, firstName, lastName, email, password, password2 } = formData;

    let query = useQuery();
    const referralKey = query.get('referralKey');
    const urlForm = query.get('form');
    //console.log('referralKey', referralKey);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value
    };

    useEffect(() => {
        if (firstName !== '' && lastName !== '') {
            let regName = firstName + ' ' + lastName;
            setFormData({ ...formData, name: regName }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value
        } else {
            setFormData({ ...formData, name: '' }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value
        }
    }, [firstName, lastName]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            console.log(name);
            register({ name, email, password, referralKey });
            //   const newUser = {
            //     name,
            //     email,
            //     password,
            //   };
            //   try {
            //     const config = {
            //       headers: {
            //         'Content-Type': 'application/json',
            //       },
            //     };
            //     const body = JSON.stringify(newUser);
            //     const res = await axios.post('/api/users', body, config);
            //     console.log(res.data);
            //   } catch (err) {
            //     console.error(err.response.data);
            //   }
            //   await console.log(formData);
        }
    };

    //Navigate if logged in
    if (isAuthenticated && !bookingDialog) {
        if (urlForm === 'host') {
            return <Navigate to="/edit-host-profile" />;
        } else {
            return <Navigate to="/dashboard" />;
        }
    }

    return (
        <Fragment>
            <Box
                sx={{
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                {urlForm === 'host' && (
                    <>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            //spacing={2}
                            sx={{
                                width: '100%',
                                margin: '0 auto',
                            }}
                        >
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <FormLabel
                                    component="h3"
                                    sx={{
                                        fontSize: '1.5em',
                                        textAlign: 'center',
                                    }}
                                >
                                    Thanks for your interest in becoming a host!
                                </FormLabel>
                                <FormLabel
                                    component="small"
                                    sx={{
                                        textAlign: 'left',
                                        display: 'block',
                                        maxWidth: '600px',
                                    }}
                                >
                                    Just so you know: answering these questions
                                    does not obligate you to host any particular
                                    event. This questionnaire signifies your
                                    interest to host, and loops you in to
                                    updates and opportunities to host.
                                    <br />
                                    <br />
                                    <em>
                                        Also, the information you submit will be
                                        used by Porchlight only, and will never
                                        be sold to a third party.
                                    </em>
                                </FormLabel>
                            </Grid>
                        </Grid>
                    </>
                )}

                <Box
                    component="form"
                    noValidate
                    onSubmit={(e) => onSubmit(e)}
                    sx={{ mt: 3, maxWidth: '350px' }}
                >
                    <Grid container spacing={2}>
                        {urlForm !== 'host' && (
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <>
                                    <FormLabel component="legend">
                                        Let’s get you signed up!
                                    </FormLabel>
                                    <Typography component="p">
                                        What’s your name, email address, and
                                        password?
                                    </Typography>
                                </>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="My first name is"
                                autoComplete="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="My last name is"
                                autoComplete="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="My email address is"
                                type="email"
                                autoComplete="email"
                                name="email"
                                value={email}
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="I would like my password to be"
                                type="password"
                                name="password"
                                minLength="6"
                                value={password}
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="To confirm, that password is"
                                type="password"
                                name="password2"
                                minLength="6"
                                value={password2}
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{ textAlign: 'center', margin: '8px auto' }}
                        >
                            <Button
                                type="submit"
                                value="Register"
                                onClick={(e) => {
                                    onSubmit(e);
                                }}
                            >
                                Register
                            </Button>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <small>
                                    I already have an account.{' '}
                                    <Link to="/login">Go to Login</Link>
                                </small>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Fragment>
    );
};
Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    bookingDialog: PropTypes.object,
};
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, register })(Register);
