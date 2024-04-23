import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Grid, Typography, FormGroup, Tooltip } from '@mui/material';

import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import { hostDeclines } from '../../actions/event';

import Button from '../layout/SvgButton';

const HostDeclineBtn = ({
    hostDeclines,
    hostMe,
    thisEvent,
    nearMeToHost,
    hostID,
}) => {
    const [showDeclineBtn, setShowDeclineBtn] = useState(false);

    const theHostID = (hostMe && hostMe._id) || hostID;

    useEffect(() => {
        // console.log('declinedHosts useEffect triggered');
        if (
            !thisEvent.declinedHosts ||
            thisEvent.declinedHosts.length <= 0 ||
            (thisEvent.declinedHosts &&
                thisEvent.declinedHosts.length > 0 &&
                thisEvent.declinedHosts.filter((declinedHost) => {
                    if (declinedHost.host && declinedHost.host === theHostID) {
                        return 1;
                    } else {
                        return 0; //don't return
                    }
                }).length <= 0)
        ) {
            setShowDeclineBtn(true);
        } else {
            setShowDeclineBtn(false);
        }
    }, [nearMeToHost]);
    return (
        <>
            <Grid
                item
                sx={{
                    marginLeft: '8px',
                }}
            >
                {showDeclineBtn ? ( //as long as the declinedHosts array is empty, or at least hostMe is not in the array, show the declineBtn
                    <Tooltip
                        title={`Declining gives the artist the opportunity to make other plans. NONE of your information is shared.`}
                        sx={{ textAlign: 'center' }}
                        arrow
                    >
                        <Button
                            btnwidth="140"
                            onClick={() => {
                                hostDeclines(hostMe._id, thisEvent);
                            }}
                            sx={{ margin: '0px auto' }}
                        >
                            <ThumbDownAltTwoToneIcon
                                sx={{ margin: '0px 8px 0 0!important' }}
                            ></ThumbDownAltTwoToneIcon>
                            Decline
                        </Button>
                    </Tooltip>
                ) : (
                    <Grid
                        container
                        className="declined-container"
                        sx={{
                            flexDirection: 'row',
                            color: 'var(--primary-color)',
                            margin: '10px',
                        }}
                    >
                        <ThumbDownAltTwoToneIcon
                            sx={{ margin: '0px 8px 0 8px!important' }}
                        ></ThumbDownAltTwoToneIcon>
                        <Typography component="p">You declined</Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

HostDeclineBtn.propTypes = {
    hostDeclines: PropTypes.func.isRequired,
    hostMe: PropTypes.object,
    thisEvent: PropTypes.object.isRequired,
    nearMeToHost: PropTypes.array,
    hostID: PropTypes.string,
};

const mapStateToProps = (state) => ({
    hostMe: state.host.me,
    nearMeToHost: state.event.nearMeToHost, //to watch it for changes in the useEffect
});

export default connect(mapStateToProps, {
    hostDeclines,
    // })(withRouter(HostDeclineBtn)); //withRouter allows us to pass history objects
})(HostDeclineBtn); //withRouter allows us to pass history objects
