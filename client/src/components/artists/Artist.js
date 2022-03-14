import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { PAGE_LOAD } from '../../actions/types';
import Spinner from '../layout/Spinner';
import ArtistProfile from './ArtistProfile';
import ArtistAbout from './ArtistAbout';
// import ProfileExperience from './ProfileExperience';
// import ProfileEducation from './ProfileEducation';
import { getArtistBySlug } from '../../actions/artist';

import { Grid, Box } from '@mui/material';

const Artist = ({
    getArtistBySlug,
    artist: { artist, loading },
    auth,
    match,
    app,
}) => {
    const dispatch = useDispatch();

    const [artistTitle, setArtistTitle] = useState('');

    useEffect(() => {
        //this is only really to trigger the PAGE_LOAD so that the page title will update
        if (artist && artist.stageName) {
            setArtistTitle(artist.stageName);
        }
    }, [artist]);

    useEffect(() => {
        if (artist && artist.stageName) {
            dispatch({
                type: PAGE_LOAD,
                payload: { pageTitle: artist.stageName },
            });
        } else {
            getArtistBySlug(match.params.slug);
        }
        //}, [artist, dispatch]);
    }, [artistTitle]);

    useEffect(() => {
        getArtistBySlug(match.params.slug);
    }, [getArtistBySlug, match.params.slug]);

    return (
        <Fragment>
            {artist === null || loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    {/* <Link to="/artists" className="btn btn-Light">
                        Back to Artists
                    </Link> */}
                    {/* {auth.isAuthenticated &&
						auth.loading === false &&
						auth.user.id === artist.user && (
							<Link to='/edit-artist-profile' className='btn btn-dark'>
								Edit
							</Link>
						)} */}
                    <Box
                        className=""
                        sx={{
                            padding: '20px',
                            maxWidth: 'calc(2 * 70vh)',
                            m: '0 auto',
                        }}
                    >
                        <ArtistProfile artist={artist} />
                    </Box>
                </Fragment>
            )}
        </Fragment>
    );
};

Artist.propTypes = {
    getArtistBySlug: PropTypes.func.isRequired,
    artist: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    artist: state.artist,
    auth: state.auth,
    app: state.app,
});

export default connect(mapStateToProps, { getArtistBySlug })(Artist);
