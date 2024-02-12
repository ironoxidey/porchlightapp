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

import { agreeToArtistTerms } from '../../actions/artist';

// import HostEventDetails from './HostEventDetails';

import Button from '../layout/SvgButton';
import { relativeTimeRounding } from 'moment';

const ArtistTermsAgreement = ({ agreeToArtistTerms, artistMe }) => {
    const [artistAgreedToTerms, setArtistAgreedToTerms] = useState(false);

    useEffect(() => {
        if (artistMe && artistMe.agreedToTerms) {
            setArtistAgreedToTerms(true);
        }
    }, [artistMe, artistMe.agreedToTerms]);

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
        console.log('artistAgreedToTerms', artistAgreedToTerms);
        if (artistAgreedToTerms === false) {
            //if it's unchecked, check it
            setArtistAgreedToTerms(true);
            agreeToArtistTerms({
                agreedToTerms: new Date(),
                email: artistMe.email,
            });
        } else {
            //if it's checked, uncheck it
            // setArtistAgreedToTerms(
            //     !artistAgreedToTerms
            // )
            setArtistAgreedToTerms(false);
            agreeToArtistTerms({
                agreedToTerms: false,
                email: artistMe.email,
            });
        }
    };

    const [termsAgreementDialogDetails, setDialogDetailsState] = useState({});

    useEffect(() => {
        //console.log('termsAgreementDialogDetails', termsAgreementDialogDetails);
        setTermsAgreementDialogOpen(true);
    }, [termsAgreementDialogDetails]);

    const handleEventBtnClick = (artistMe) => {
        setDialogDetailsState(artistMe);
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
                                Porchlight Artist Terms and Conditions
                            </Typography>
                            <Typography component="p">
                                As condition for acceptance as a Porchlight Arts
                                + Hospitality Network ARTIST with access to its
                                network of event hosts, I agree to the
                                following:
                            </Typography>
                            <ul>
                                <li>
                                    I acknowledge that Porchlight artists create
                                    and perform music that points people toward
                                    an authentic relationship with Christ. As
                                    such, I will strive to exemplify Christ-like
                                    character and selflessness.
                                </li>
                                <li>
                                    I will make my best effort to provide a
                                    compelling live performance consistent with{' '}
                                    <a
                                        href="https://docs.google.com/document/d/1skxIQjIhEOs07k06ymmss1lMO-Q9Q4j8kI68Vc0u5hE/edit?usp=sharing"
                                        target="_blank"
                                    >
                                        Porchlight’s Musician Guide
                                    </a>
                                    . Likewise, I will promote each event
                                    through my website and social media
                                    platforms to the best of my ability.
                                </li>
                                <li>
                                    I will communicate clearly and promptly with
                                    the event host to negotiate and confirm
                                    details regarding production, promotion,
                                    accommodations, and compensation.
                                </li>
                                <li>
                                    I will not knowingly expose event host or
                                    audience to any human or environmental risk.
                                    As such, I will refrain from being alone
                                    with minors to avoid possible accusations of
                                    inappropriate behavior. Likewise, I will
                                    make sure all sound and light equipment is
                                    safely situated to prevent harm to any
                                    party.
                                </li>
                                <li>
                                    I will respect the event host’s prerogative
                                    with respect to the availability of alcohol
                                    or other regulated substances and abide by
                                    any local ordinances or subdivision
                                    covenants regarding noise restrictions.
                                </li>
                                <li>
                                    I acknowledge that I am solely responsible
                                    for any injury or damages suffered on the
                                    way to or from the event and will hold
                                    harmless and indemnify Porchlight from any
                                    liability related to the event.
                                </li>
                                <li>
                                    I acknowledge that Porchlight is simply an
                                    intermediary to help connect concert hosts
                                    with potential artists, that there is no
                                    legal partnership between the parties, and
                                    that Porchlight receives no direct financial
                                    compensation from the event I perform.
                                </li>
                                <li>
                                    I acknowledge that Porchlight is not
                                    responsible for any possible financial loss
                                    related to the event or an event host’s
                                    failure to meet their obligations.
                                </li>
                                <li>
                                    I agree that this agreement is governed by
                                    the laws of the State of Georgia and that
                                    any legal disputes regarding its subject
                                    matter will be adjudicated in the
                                    appropriate state court situated in Fulton
                                    County, GA.
                                </li>
                                <li>
                                    I acknowledge that Porchlight may—at its
                                    sole discretion—accept or reject any
                                    application to become a Porchlight artist
                                    and may suspend or terminate such benefits
                                    with or without cause at any time.
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
                            // !artistMe.agreedToTerms &&
                            //     agreeToArtistTerms(artistMe);
                            handleEventBtnClick(artistMe);
                        }}
                        sx={{ margin: '0px auto 8px' }}
                    >
                        <GavelIcon sx={{ marginRight: '8px' }}></GavelIcon>
                        Artist Terms And Conditions
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
                                    checked={artistAgreedToTerms}
                                    inputProps={{
                                        'aria-label': 'controlled',
                                    }}
                                    sx={{
                                        marginTop: -1,
                                    }}
                                />
                            }
                            label={`By checking this box, I agree to these terms and conditions and will communicate them to any associates involved with my performing at any event involving a Porchlight host. I understand that my failure to comply with any element of this agreement may result in suspension or termination of the benefits conferred.`}
                        />
                        {artistMe && artistMe.agreedToTerms && (
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
                                    artistMe.agreedToTerms
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

ArtistTermsAgreement.propTypes = {
    agreeToArtistTerms: PropTypes.func.isRequired,
    artistMe: PropTypes.object,
};

const mapStateToProps = (state) => ({
    artistMe: state.artist.me,
});

//export default ArtistTermsAgreement;
export default connect(mapStateToProps, {
    agreeToArtistTerms,
    // })(withRouter(ArtistTermsAgreement)); //withRouter allows us to pass history objects
})(ArtistTermsAgreement); //withRouter allows us to pass history objects
