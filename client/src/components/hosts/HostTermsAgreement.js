import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import GavelIcon from '@mui/icons-material/Gavel';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

import { agreeToHostTerms } from '../../actions/host';

// import HostEventDetails from './HostEventDetails';

import Button from '../layout/SvgButton';
import { relativeTimeRounding } from 'moment';

const HostTermsAgreement = ({ agreeToHostTerms, hostMe }) => {
    const [hostAgreedToTerms, setHostAgreedToTerms] = useState(false);

    useEffect(() => {
        if (hostMe && hostMe.agreedToTerms) {
            setHostAgreedToTerms(true);
        }
    }, [hostMe.agreedToTerms]);

    //Booking Details Dialog Functions
    const [termsAgreementDialogOpen, setTermsAgreementDialogOpen] =
        useState(false);

    const [wantsToBook, setWantsToBook] = useState(false);

    const termsAgreementDialogHandleClose = () => {
        setDialogDetailsState({});
        setTermsAgreementDialogOpen(false);
        setWantsToBook(false);
    };

    const checkboxOnChange = () => {
        // console.log('hostAgreedToTerms', hostAgreedToTerms);
        if (hostAgreedToTerms === false) {
            //if it's unchecked, check it
            setHostAgreedToTerms(true);
            agreeToHostTerms({
                agreedToTerms: new Date(),
                email: hostMe.email,
            });
        } else {
            //if it's checked, uncheck it
            // setHostAgreedToTerms(
            //     !hostAgreedToTerms
            // )
            setHostAgreedToTerms(false);
            agreeToHostTerms({
                agreedToTerms: false,
                email: hostMe.email,
            });
        }
    };

    const [termsAgreementDialogDetails, setDialogDetailsState] = useState({});

    useEffect(() => {
        //console.log('termsAgreementDialogDetails', termsAgreementDialogDetails);
        setTermsAgreementDialogOpen(true);
    }, [termsAgreementDialogDetails]);

    const handleEventBtnClick = (hostMe) => {
        setDialogDetailsState(hostMe);
    };
    //End of Dialog Functions

    return (
        <>
            {termsAgreementDialogDetails && termsAgreementDialogDetails._id && (
                <Dialog
                    open={termsAgreementDialogOpen}
                    onClose={termsAgreementDialogHandleClose}
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
                        <Grid container className="termsAndConditions">
                            <Typography
                                component="h2"
                                sx={{
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                Porchlight Host Terms and Conditions
                            </Typography>
                            <Typography component="p">
                                As condition for acceptance as a Porchlight HOST
                                with access to its network of performing
                                artists, I agree to the following:
                            </Typography>
                            <ul>
                                <li>
                                    I acknowledge that Porchlight artists create
                                    and perform music that points people toward
                                    an authentic relationship with Christ. As
                                    such, I will strive to exemplify Christ-like
                                    character and hospitality.
                                </li>
                                <li>
                                    I will make my best effort to promote my
                                    event(s) consistent with{' '}
                                    <a
                                        href="https://docs.google.com/document/d/10jINNrRtF1UCXpXnNS21b2riUUJAfnTBDfPG61bZSsk/edit?usp=sharing"
                                        target="_blank"
                                    >
                                        Porchlight’s Hosting Guide
                                    </a>
                                    .
                                </li>
                                <li>
                                    If applicable, I will provide any
                                    accommodations and compensation negotiated
                                    between myself and the Artist in a timely
                                    manner.
                                </li>
                                <li>
                                    I will provide a safe and hospitable setting
                                    for both Artist and audience. As such, I
                                    will not knowingly expose Artist or audience
                                    to any human or environmental risk.
                                </li>
                                <li>
                                    I will abide by all local laws with respect
                                    to the availability of alcoholic beverages,
                                    as well as any local ordinances or
                                    subdivision covenants regarding noise
                                    restrictions.
                                </li>
                                <li>
                                    I acknowledge that I am solely responsible
                                    for any injury or damages suffered by Artist
                                    or audience members while on my property and
                                    will hold harmless and indemnify Porchlight
                                    from any liability related to the event. As
                                    such, I warrant that I have adequate
                                    homeowner’s or renter’s insurance to cover
                                    any potential injuries suffered on my
                                    property.
                                </li>
                                <li>
                                    I acknowledge that Porchlight is simply an
                                    intermediary to help connect concert hosts
                                    with potential artists, that there is no
                                    legal partnership between the parties, and
                                    that Porchlight receives no direct financial
                                    compensation from the event I host.
                                </li>
                                <li>
                                    I acknowledge that Porchlight is not
                                    responsible for any possible financial loss
                                    related to hosting my event or an artist’s
                                    failure to perform.
                                </li>
                                <li>
                                    I acknowledge that this agreement is
                                    governed by the laws of the State of Georgia
                                    and that any legal disputes regarding its
                                    subject matter will be adjudicated in the
                                    appropriate state court situated in Fulton
                                    County, GA.
                                </li>
                                <li>
                                    I acknowledge that Porchlight may—at its
                                    sole discretion—accept or reject any
                                    application to become a Porchlight host and
                                    may suspend or terminate such benefits with
                                    or without cause at any time.
                                </li>
                                <li>
                                    I acknowledge that Porchlight may amend
                                    these conditions at any time for any reason,
                                    and that such amendments shall be in effect
                                    when Porchlight emails them to me. If I am
                                    unwilling or unable to abide by such
                                    amendments, I agree to immediately notify
                                    Porchlight and understand that my
                                    affiliation may be terminated.
                                </li>
                            </ul>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}

            <Grid
                item
                sx={{
                    marginLeft: '0',
                }}
            >
                <Grid
                    container
                    sx={{
                        backgroundColor: 'rgba(0,0,0,.3)',
                        borderRadius: '3px',
                        padding: '16px',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        btnwidth="300"
                        onClick={() => {
                            // !hostMe.agreedToTerms &&
                            //     agreeToHostTerms(hostMe);
                            handleEventBtnClick(hostMe);
                        }}
                        sx={{ margin: '0px auto 8px' }}
                    >
                        <GavelIcon sx={{ marginRight: '8px' }}></GavelIcon>
                        Host Terms And Conditions
                    </Button>
                    <FormGroup>
                        <FormControlLabel
                            sx={{
                                textAlign: 'left',
                                margin: '0 auto',
                                alignItems: 'flex-start',
                            }}
                            control={
                                <Checkbox
                                    onChange={(e) => checkboxOnChange()}
                                    checked={hostAgreedToTerms}
                                    inputProps={{
                                        'aria-label': 'controlled',
                                    }}
                                    sx={{
                                        marginTop: -1,
                                    }}
                                />
                            }
                            label={`By checking this box, I agree to these terms and conditions and will communicate them to any associates involved with the hosting of any event involving a Porchlight artist. I understand that my failure to comply with any element of this agreement may result in suspension or termination of the benefits conferred.`}
                        />
                        {hostMe && hostMe.agreedToTerms && (
                            <Typography
                                component="p"
                                sx={{
                                    margin: '10px auto 0',
                                    fontSize: '.8em',
                                    textAlign: 'center',
                                    color: 'var(--primary-color)',
                                }}
                            >
                                (You agreed to these terms on{' '}
                                {new Date(
                                    hostMe.agreedToTerms
                                ).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                                })}
                                )
                            </Typography>
                        )}
                    </FormGroup>
                </Grid>
            </Grid>
        </>
    );
};

HostTermsAgreement.propTypes = {
    agreeToHostTerms: PropTypes.func.isRequired,
    hostMe: PropTypes.object,
};

const mapStateToProps = (state) => ({
    hostMe: state.host.me,
});

//export default HostTermsAgreement;
export default connect(mapStateToProps, {
    agreeToHostTerms,
    // })(withRouter(HostTermsAgreement)); //withRouter allows us to pass history objects
})(HostTermsAgreement); //withRouter allows us to pass history objects
