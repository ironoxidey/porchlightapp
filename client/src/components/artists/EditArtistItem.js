import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { createArtist } from '../../actions/artist';
import EditArtistAdmin from './EditArtistAdmin';

import {
    Autocomplete,
    TextField,
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    IconButton,
} from '@mui/material';

import Button from '../layout/SvgButton';

const EditArtistItem = ({ theArtist, theArtist: { loading }, history }) => {
    const [displayEdit, toggleEdit] = useState(false);

    const mailtoSubject = encodeURIComponent(
        'Hey, ' +
            theArtist.firstName +
            '! Just following up about our Zoom conversation on ' +
            theArtist.typeformDate
    );
    const mailtoBody = encodeURIComponent(
        `When we talked, you mentioned that you're from ` +
            theArtist.hometown +
            `.
What is it like there this time of year?`
    );

    return (
        <Grid
            container
            direction="row"
            xs={12}
            className={`${theArtist.active ? 'active' : ''}`}
            sx={{
                padding: '20px',
                border: `${
                    theArtist.active
                        ? '4px double var(--light-color)'
                        : '4px solid var(--secondary-dark-color)'
                }`,
                transition: 'all 400ms ease-in-out',
                margin: '4px auto',
            }}
        >
            <Grid item xs={12} md={3} sx={{}}>
                <Box
                    className="squareImgInACircle"
                    sx={{
                        height: '250px',
                        width: '250px',
                        maxHeight: '250px',
                        maxWidth: '250px',
                        borderRadius: `${theArtist.active ? '50%' : '1%'}`,
                        overflow: 'hidden',
                        backgroundImage: `url("${theArtist.squareImg}")`,
                        backgroundPosition: '50% 25%',
                        backgroundSize: 'cover',
                        padding: `${theArtist.active ? '4px' : '0'}`,
                        backgroundClip: 'content-box',
                        border: `${
                            theArtist.active
                                ? '1px solid var(--primary-color)'
                                : '1px solid transparent'
                        }`,
                        margin: '20px auto',
                        transition: 'all 400ms ease-in-out',
                    }}
                ></Box>
                <Link
                    to={`/artists/${theArtist.slug}`}
                    className="btn btn-primary profileBtn"
                >
                    View Frontend Profile
                </Link>
                <a
                    href={`mailto:${theArtist.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
                    className="btn btn-primary"
                >
                    <i className="fas fa-envelope"></i>
                    <span> Send a follow-up email</span>
                </a>
            </Grid>
            <Grid container item xs={12} md={9} className="artistAdminButtons">
                <Grid item className="artist-info">
                    <Typography component="h2" className="stageName">
                        {theArtist.stageName}
                        {theArtist.active && (
                            <Chip
                                label="Active"
                                size="small"
                                sx={{ margin: '0 4px' }}
                            ></Chip>
                        )}
                    </Typography>
                    {theArtist.email && <small>({theArtist.email})</small>}
                    {theArtist.city && (
                        <p className="hometown">
                            {theArtist.city}, {theArtist.state}
                        </p>
                    )}
                    <p className="genre">
                        {theArtist.genres && theArtist.genres.join(', ')}
                    </p>
                    {/* {theArtist.repLink ? (
                        <a
                            href={theArtist.repLink}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Check out {theArtist.stageName}'s work
                        </a>
                    ) : (
                        ''
                    )} */}
                    {/* <button
						onClick={() => toggleEdit(!displayEdit)}
						type='button'
						className='btn btn-light editBtn'
					>
						Edit
					</button> */}
                </Grid>

                {!loading && (
                    <Fragment>
                        <div className="editArtistItem">
                            <EditArtistAdmin theArtist={theArtist} />
                            {/* {displayEdit && (
                <Fragment>
                    <EditArtistForm theArtist={theArtist} />
                </Fragment>
              )} */}
                        </div>
                    </Fragment>
                )}
            </Grid>
        </Grid>
    );
};

EditArtistItem.propTypes = {
    theArtist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(withRouter(EditArtistItem)); //withRouter allows us to pass history objects
