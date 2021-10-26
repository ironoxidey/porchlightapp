import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import EditArtistItem from './EditArtistItem';
import { getEditArtists } from '../../actions/artist';

const EditArtists = ({ getEditArtists, auth: { user }, artist: { artists, loading }}) => {
    
    const [filterBy, setFilterBy] = useState('');
    const [filterString, setFilterString] = useState('');

    const filterArtists = (artists) => {
        if (artists.filter((artist) => {return artist[filterBy] == filterString}).length > 0) {
            return artists.filter((artist) => {return artist[filterBy] == filterString})
        }
        else if (artists.filter((artist) => {
            for (var i in artist) {
                if (artist[i]){
                    if (artist[i].toString().toLowerCase().indexOf(filterString.toString().toLowerCase()) > -1) return artist;
                }
            }
        }).length > 0) {
            return artists.filter((artist) => {
                for (var i in artist) {
                    if (artist[i]){
                        if (artist[i].toString().toLowerCase().indexOf(filterString.toString().toLowerCase()) > -1) return artist;
                    }
                }
            })
        }
        else if (filterString.length > 0) {
            return {};
        }
        else if (artists.length > 0) {
            return artists;
        }
    }

    useEffect(() => {
        getEditArtists();
    }, [getEditArtists]);
    return (
        <Fragment>
           { loading ? <Spinner></Spinner> : <Fragment>
               <h1 className="large text-primary">Artists</h1> 
               <p className="lead">
                   <i className="fab fa-connectdevelop"></i> Browse and connect with artists
               </p>
               <div className='my-2'>
                    <button
                        onClick={() => {
                            setFilterBy('');
                            setFilterString('');
                        }}
                        type='button'
                        className='btn btn-light'
                    >
                        Show All {artists.length} Artists
                    </button>
                    <button
                        onClick={() => {
                            setFilterBy('active');
                            setFilterString(false);
                        }}
                        type='button'
                        className='btn btn-light'
                    >
                        Show Only {artists.filter((artist) => {return artist.active == false}).length} Inactive Artists
                    </button>
                    <button
                        onClick={() => {
                            setFilterBy('active');
                            setFilterString(true);
                        }}
                        type='button'
                        className='btn btn-light'
                    >
                        Show Only {artists.filter((artist) => {return artist.active == true}).length} Active Artists
                    </button>
                    
                    <div className='form-group'>
                        <input
                        type='text'
                        placeholder='Search...'
                        name='search'
                        onChange={(e) => setFilterString(e.target.value)}
                        />
                    </div>
                </div>
               <div className="artists">
                   {
                        filterArtists(artists).length > 0 ? (
                            filterArtists(artists).map(theArtist => (
                                <EditArtistItem key={theArtist._id} theArtist={theArtist}/>
                            ))
                        ): <h4>No artists found...</h4>
                   }
                
               </div>
               </Fragment>
            }
        </Fragment>
    )
}

EditArtists.propTypes = {
   getEditArtists: PropTypes.func.isRequired, 
   artist: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    artist: state.artist,
    auth: state.auth,
});

export default connect(mapStateToProps, {getEditArtists}) (EditArtists);
