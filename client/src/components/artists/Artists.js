import React, {Fragment,useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import ArtistItem from './ArtistItem';
import { getArtists } from '../../actions/artist';

const Artists = ({ getArtists, auth: { user }, artist: { artists, loading }}) => {
    useEffect(() => {
        getArtists();
    }, [getArtists]);
    return (
        <Fragment>
           { loading ? <Spinner></Spinner> : <Fragment>
               <h1 className="large text-primary">Artists</h1> 
               <p className="lead">
                   <i className="fab fa-connectdevelop"></i> Browse and connect with artists
               </p>
               <div className="artists">
                   {artists.length > 0 ? (
                       artists.map(artist => (
                           <ArtistItem key={artist._id} artist={artist} />
                       ))
                   ): <h4>No artists found...</h4>}
               </div>
               </Fragment>
            }
        </Fragment>
    )
}

Artists.propTypes = {
   getArtists: PropTypes.func.isRequired, 
   artist: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    artist: state.artist,
    auth: state.auth,
});

export default connect(mapStateToProps, {getArtists}) (Artists);
