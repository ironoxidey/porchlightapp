import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register({ name, email, password });
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

    //Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                <Box
                    component="form"
                    noValidate
                    onSubmit={(e) => onSubmit(e)}
                    sx={{ mt: 3, maxWidth: '350px' }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <FormLabel component="legend">
                                Let's get you signed up!
                            </FormLabel>
                            <Typography component="p">
                                What's your name, email address, and password?
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="My name is"
                                autoComplete="name"
                                name="name"
                                value={name}
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
                                    <Link to="/login">Back to Login</Link>
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
};
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, register })(Register);
