import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, IconButton, Dialog, DialogContent } from '@mui/material';

import GoogleMapForHosts from '../layout/GoogleMapForHosts';

import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import HostProfile from './HostProfile';

const HostDataGridMap = ({ auth: { loading }, host }) => {
    //Host Grid Map Dialog Functions
    const [theMapDialogOpen, setTheMapDialogOpen] = useState(false);
    const [theClickedHost, setTheClickedHost] = useState({});

    const theMapDialogHandleClose = () => {
        setTheMapDialogOpen(false);
    };

    const onAutocompleteTagChange = (e, theFieldName, val) => {
        console.log('clicked host:', val[0]);
        setTheClickedHost(val[0]);
        //console.log(Object.keys(formGroups).length);
        // changesMade.current = true;
        // let targetValue = val;
        // setFormData({ ...formData, [theFieldName]: targetValue });
    };

    const [theHosts, setTheHosts] = useState([]);

    useEffect(() => {
        if (host && host.hosts) {
            setTheHosts(
                host.hosts.filter((thisHost) => {
                    if (
                        thisHost.active === true &&
                        thisHost.latLong &&
                        thisHost.latLong.coordinates &&
                        thisHost.latLong.coordinates.length === 2
                    ) {
                        // console.log('thisHost', thisHost);
                        return thisHost;
                    } else {
                        // console.log('not thisHost', thisHost);
                        return false;
                    }
                })
            );
        }
    }, [host.hosts]);

    // useEffect(() => {
    //     console.log('theHosts', theHosts);
    // }, [theHosts]);

    //End of Dialog Functions
    return (
        <>
            {theMapDialogOpen && (
                <Dialog
                    open={theMapDialogOpen}
                    onClose={() => setTheMapDialogOpen(false)}
                    // aria-labelledby="alert-dialog-title"
                    // aria-describedby="alert-dialog-description"
                    scroll="body"
                    fullWidth
                    maxWidth="lg"
                    className="porchlightBG"
                >
                    {/* <DialogTitle id="alert-dialog-title"></DialogTitle> */}
                    <DialogContent
                        sx={{
                            margin: '8px',
                            border: '1px solid var(--primary-color)',
                        }}
                    >
                        {theClickedHost && theClickedHost._id && (
                            <HostProfile theHost={theClickedHost}></HostProfile>
                        )}
                        <Box className="feoyGoogleMap">
                            <GoogleMapForHosts
                                markers={theHosts}
                                markerClick={onAutocompleteTagChange}
                                // radius={Number(hostReachRadius)}
                                circleCenter={{
                                    coordinates: {
                                        lat: 36.974,
                                        lng: -97.03,
                                    },
                                }}
                                preferredArtists={[]}
                                zoom={4.25}
                            />
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
            {theHosts && theHosts.length > 0 && (
                <Box className="mapButton">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={() => setTheMapDialogOpen(true)}
                        color="inherit"
                    >
                        <MapTwoToneIcon />
                    </IconButton>
                </Box>
            )}
        </>
    );
};

HostDataGridMap.propTypes = {
    auth: PropTypes.object.isRequired,
    host: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    host: state.host,
});

export default connect(mapStateToProps, {
    // generateReferral
})(HostDataGridMap);
