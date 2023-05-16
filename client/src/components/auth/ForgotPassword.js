import React, { Fragment, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forgotPassword } from '../../actions/auth';
//import axios from 'axios';
import { TextField, Grid, Box, FormLabel, Typography } from '@mui/material';

import Button from '../layout/SvgButton';

const ForgotPassword = ({ forgotPassword, isAuthenticated, forgotSuccess }) => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        email: '',
    });

    const { email } = formData;

    const onChange = async (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

    const onSubmit = async (e) => {
        e.preventDefault();
        const forgotThePassword = await forgotPassword({ email });
        console.log(forgotThePassword);
        history.push('/login');
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
                    sx={{ mt: 3, maxWidth: '400px' }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <FormLabel component="legend">
                                Oh no! Did you forget your password?
                            </FormLabel>
                            <Typography component="p">
                                No worries! We can send you a reset link! What's
                                your email address?
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
                                Submit
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="flex-end">
                        <small>
                            Oh! I remembered the password!{' '}
                            <Link to="/login">Back to Login</Link>
                        </small>
                    </Grid>
                </Box>
            </Box>
        </Fragment>
    );
};
ForgotPassword.propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    forgotSuccess: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    forgotSuccess: state.auth.forgotSuccess,
});
export default connect(mapStateToProps, { forgotPassword })(ForgotPassword);
