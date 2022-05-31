import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentHost } from '../../actions/host';
import Spinner from '../layout/Spinner';
import EditHostProfileForm from './EditHostProfileForm';

const EditMyHostProfile = ({
    auth,
    getCurrentHost,
    host: { me, loading },
    inDialog,
}) => {
    useEffect(() => {
        //if (auth.user.email) {
        getCurrentHost();
        //}
        //}, [getCurrentHost]);
    }, [getCurrentHost, auth]);

    return (
        <Fragment>
            {loading ? (
                <Spinner></Spinner>
            ) : me ? (
                <Fragment>
                    {/* <h1 className='large text-primary'>Edit Your Artist Profile</h1> */}
                    <EditHostProfileForm theHost={me} inDialog={inDialog} />
                    {/* <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link> */}
                </Fragment>
            ) : (
                ''
            )}
        </Fragment>
    );
};

EditMyHostProfile.propTypes = {
    getCurrentHost: PropTypes.func.isRequired,
    host: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    inDialog: PropTypes.object,
};

const mapStateToProps = (state) => ({
    host: state.host,
    auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentHost })(
    withRouter(EditMyHostProfile)
); //withRouter allows us to pass history objects
