import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';
import EditArtistAdmin from './EditArtistAdmin';

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
		<div
			className={`profile bg-dark p-1 my-1 ${theArtist.active ? 'active' : ''}`}
		>
			<Fragment>
				<img src={theArtist.squareImg} alt='' className='profileImage' />
				<div className='artistAdminButtons'>
					<Link
						to={`/artists/${theArtist.slug}`}
						className='btn btn-primary profileBtn'
					>
						View Frontend Profile
					</Link>
					<a
						href={`mailto:${theArtist.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
						className='btn btn-primary'
					>
						<i className='fas fa-envelope'></i>
						<span> Send a follow-up email</span>
					</a>
				</div>

				<div className='artist-info'>
					<h2 className='text-primary stageName'>{theArtist.stageName}</h2>
					{theArtist.active && <small>Active</small>}
					<p className='hometown'>{theArtist.hometown}</p>
					<p className='genre'>{theArtist.genre}</p>
					<p className='bio'>{theArtist.bio}</p>
					{theArtist.repLink ? (
						<a
							href={theArtist.repLink}
							className='btn btn-primary'
							target='_blank'
							rel='noopener noreferrer'
						>
							Check out {theArtist.stageName}'s work
						</a>
					) : (
						''
					)}
					{/* <button
						onClick={() => toggleEdit(!displayEdit)}
						type='button'
						className='btn btn-light editBtn'
					>
						Edit
					</button> */}
				</div>

				{!loading && (
					<Fragment>
						<div className='editArtistItem'>
							<EditArtistAdmin theArtist={theArtist} />
							{/* {displayEdit && (
                <Fragment>
                    <EditArtistForm theArtist={theArtist} />
                </Fragment>
              )} */}
						</div>
					</Fragment>
				)}
			</Fragment>
		</div>
	);
};

EditArtistItem.propTypes = {
	theArtist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(withRouter(EditArtistItem)); //withRouter allows us to pass history objects
