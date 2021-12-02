import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const ArtistItem = ({ artist: {
    _id,
    firstName,
    lastName,
    stageName,
    email,
    slug,
    squareImg,
    genre,
    repLink,
    hometown
} }) => {
    return (
        <div className="profile bg-dark p-1 my-1">
            <img src={squareImg} alt="" className="profileImage" />
            <div>
                <Link to={`/artists/${slug}`}>
                    <h2>{stageName}</h2>
                </Link>
                {/* <h4>({firstName} {lastName})</h4> */}
                <p className="my-1">{genre}</p>
                <p className="my-1">{hometown}</p>
                {repLink ? (
                    <a href={repLink} className='btn btn-primary' target="_blank" rel="noopener noreferrer">Check out {stageName}'s work <i className='fas fa-sign-out-alt'></i></a>
                ): ''}
                {/* <a href={`mailto:${email}`} className='btn btn-primary'><i className="fas fa-envelope"></i>
                    <span> Email {firstName}</span>
                </a> */}
                {/* <Link to={`/artists/${slug}`} className='btn btn-primary'>
                    View artist
                </Link> */}
            </div>
        </div>
    )
}

ArtistItem.propTypes = {
    artists: PropTypes.object.isRequired,
}

export default ArtistItem
