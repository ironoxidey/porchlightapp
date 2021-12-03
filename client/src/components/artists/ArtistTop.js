import React from 'react'
import PropTypes from 'prop-types'

const ArtistTop = ({ artist: {
    firstName,
    genre,
    lastName,
    medium,
    repLink,
    stageName,
    squareImg,
    wideImg,
}}) => {
    return (
        <div className="profile-top bg-primary p-2">
          <img
            className="my-1"
            src={squareImg}
            alt=""
          />
          <h1 className="large">{stageName}</h1>
          <p className="lead">({firstName} {lastName})</p>
          {/* <p>{location && <span>{location}</span>}</p>
          <div class="icons my-1">
          {
              website && (
                <a href={website} target="_blank" rel="noopener noreferrer">
                <i class="fas fa-globe fa-2x"></i>
                </a>
              )
          }
          {
              social && social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                <i class="fab fa-twitter fa-2x"></i>
                </a>
              )
          }
          {
            social && social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            )
          }
          {
            social && social.linkedin && (
                <a href={social.linkedin}  target="_blank" rel="noopener noreferrer">
              <i class="fab fa-linkedin fa-2x"></i>
            </a>
            )
          }
          {
            social && social.youtube && (
                <a href={social.youtube}  target="_blank" rel="noopener noreferrer">
              <i class="fab fa-youtube fa-2x"></i>
            </a>
            )
          }
          {
            social && social.instagram && (
                <a href={social.instagram}  target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            )
          } 
           
          </div>*/}
        </div>
    )
}

ArtistTop.propTypes = {
    artist: PropTypes.object.isRequired,
}

export default ArtistTop
