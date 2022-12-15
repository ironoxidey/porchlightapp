import React, { Fragment, useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import {
    TextField,
    //Button ,
    Grid,
    Box,
    FormLabel,
    FormControlLabel,
    Checkbox,
    Paper,
    Typography,
} from '@mui/material';
import porchlightLogo from '../../img/Porchlight_logo05-17.svg';

import Button from '../layout/SvgButton';

//import axios from 'axios';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Login = ({ login, isAuthenticated, bookingDialog }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    let query = useQuery();
    const eventID = query.get('eventID');

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

    const onSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

    //Redirect if logged in
    if (isAuthenticated && !bookingDialog) {
        if (eventID) {
            return <Redirect to={`/dashboard?eventID=` + eventID} />;
        } else {
            return <Redirect to="/dashboard" />;
        }
    }

    return (
        <Fragment>
            <Box
                sx={{
                    marginTop: !bookingDialog ? 8 : 0,
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
                            {!bookingDialog ? (
                                <FormLabel component="legend">
                                    Let’s get you logged in!
                                </FormLabel>
                            ) : (
                                ''
                            )}
                            <Typography component="p">
                                What’s your email address and password?
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                id="email"
                                label="My email address is"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => onChange(e)} //call seperate onChange function above
                                value={email}
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                name="password"
                                label="And my password is"
                                type="password"
                                id="password"
                                value={password}
                                autoComplete="password"
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
                                onClick={(e) => {
                                    onSubmit(e);
                                }}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <small>
                                I don’t have an account.{' '}
                                <Link to="/register">Sign Up</Link>
                            </small>
                        </Grid>
                        <Grid item>
                            <small>
                                I forgot my password.{' '}
                                <Link to="/forgot-password">
                                    Request a reset link
                                </Link>
                            </small>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Fragment>
    );
};
Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    bookingDialog: PropTypes.object,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
