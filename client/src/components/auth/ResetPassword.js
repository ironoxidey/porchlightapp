import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { resetPassword } from '../../actions/auth';
import PropTypes from 'prop-types';
import { TextField, Grid, Box, FormLabel, Typography } from '@mui/material';
import Button from '../layout/SvgButton';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = ({
    setAlert,
    resetPassword,
    isAuthenticated,
    resetSuccess,
}) => {
    const [formData, setFormData] = useState({
        password: '',
        password2: '',
    });

    const { password, password2 } = formData;

    let query = useQuery();
    const resetLink = query.get('token');

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            let newPass = password;
            resetPassword({ newPass, resetLink });
        }
    };

    //Redirect if logged in
    if (resetSuccess) {
        return <Redirect to="/login" />;
    }

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
                                Thank you for verifying your email address.
                            </FormLabel>
                            <Typography component="p">
                                What would you like your new password to be?
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                label="I would like my new password to be"
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
                                Reset Password
                            </Button>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <small>
                                    Oh! I remembered the password!{' '}
                                    <Link to="/login">Back to login.</Link>
                                </small>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Fragment>
    );
};
ResetPassword.propTypes = {
    setAlert: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    resetSuccess: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    resetSuccess: state.auth.resetSuccess,
});
export default connect(mapStateToProps, { setAlert, resetPassword })(
    ResetPassword
);
