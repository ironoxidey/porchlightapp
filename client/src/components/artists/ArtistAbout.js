import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const ArtistAbout = ({ artist: {
  firstName,
  genre,
  lastName,
  medium,
  repLink,
  stageName,
  squareImg,
  wideImg,
  bio
}}) => {
    return (
        <div class="profile-about bg-light p-2">
        {bio && (
            <Fragment>
            <h2 class="text-primary">About {stageName}</h2>
          <div class="line"></div>
          <p>
            {bio}
          </p>
            </Fragment>
        )}
          
          {/* <h2 class="text-primary">Skill Set</h2>
          <div class="skills">
          {skills.map((skill, index) => (
            <div key={index} className="p-1">
                <i className="fas fa-check"></i> {skill}
            </div>
          ))}
          </div> */}
        </div>
    )
}

ArtistAbout.propTypes = {
    artist: PropTypes.object.isRequired,
}

export default ArtistAbout
