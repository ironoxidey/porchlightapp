import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Grid, Chip, Typography, Box, Tooltip, SvgIcon } from '@mui/material';
import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import HotelTwoToneIcon from '@mui/icons-material/HotelTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import FamilyRestroomTwoToneIcon from '@mui/icons-material/FamilyRestroomTwoTone';
import SpeakerTwoToneIcon from '@mui/icons-material/SpeakerTwoTone';
import CoronavirusTwoToneIcon from '@mui/icons-material/CoronavirusTwoTone';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import WcTwoToneIcon from '@mui/icons-material/WcTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';
import ReactPlayer from 'react-player/lazy';


import {
	toTitleCase,
	youTubeEmbed,
	getFontAwesomeIcon,
	pullDomainFrom,
	convert24HourTime
} from '../../actions/app';

const ArtistTileBack = ({
	me,
	artist,
	artist: {
		slug,
		email,
		firstName,
		lastName,
		stageName,
		medium,
		genres,
		repLinks,
		helpKind,
		phone,
		hometown,
		city,
		state,
		zip,
		costStructure,
		namedPrice,
		payoutPlatform,
		payoutHandle,
		bookingWhen,
		bookingWhenWhere,
		setLength,
		schedule,
		showSchedule,
		overnight,
		openers,
		travelingCompanions,
		companionTravelers,
		hangout,
		merchTable,
		allergies,
		familyFriendly,
		soundSystem,
		agreeToPayAdminFee,
		wideImg,
		squareImg,
		covidPrefs,
		artistNotes,
		financialHopes,
		bio,
	},
}) => {
	let isMe = false;
	if ( me && me._id === artist._id ){
		isMe = true;
	}
	return (
		<Fragment>
			<Grid
					container
					className='artistTileBack'
					sx={{
						paddingBottom: '80px!important',
					}}
				>
			{/* {wideImg ? ( */}
				<Grid
					container
					className='wideImgBG'
					sx={{
						padding: '20px!important',
						height: '50vw',
						maxHeight: '50vh',
						//width: 'calc(100% - 40px)',
						//maxWidth: '960px',
						margin: '0 auto',
						borderRadius: '8px',
						backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${wideImg}")`,
						backgroundColor: 'var(--secondary-dark-color)',
						backgroundPosition: '50% 50%',
						backgroundSize: 'cover',
						alignItems: 'center',
					}}
				>
					{artist.squareImg ? (
						<Grid item>
							<Box
								className='squareImgInACircle'
								sx={{
									height: '200px',
									width: '200px',
									maxHeight: '200px',
									maxWidth: '200px',
									borderRadius: '50%',
									overflow: 'hidden',
									backgroundImage: `url("${artist.squareImg}")`,
									backgroundPosition: '50% 25%',
									backgroundSize: 'cover',
									padding: '4px',
									backgroundClip: 'content-box',
									border: '1px solid var(--primary-color)',
									margin: '0 8px 0 0',
								}}
							></Box>
						</Grid>
					) : (
						''
					)}
					<Grid
						item
						container
						xs={8}
						sx={{ marginTop: '0', textShadow: '0 0 10px rgba(0,0,0,.8)' }}
						direction='column'
						alignItems='start'
					>
						{artist.stageName && artist.artistWebsite ? (
							<Grid item>
								<a href={artist.artistWebsite} target='_blank'>
									<Typography component='h2'>{artist.stageName}</Typography>
								</a>
							</Grid>
						) : artist.stageName ? (
							<Grid item>
								<Typography component='h2'>{artist.stageName}</Typography>
							</Grid>
						) : (
							''
						)}
						{artist.genres && artist.genres.constructor.name === "Array" ? (
							<Grid item>
								<Tooltip title='Genre' placement='bottom' arrow>
									<SvgIcon
										style={{
											marginRight: '8px',
											fontSize: '1.3em',
											verticalAlign: 'middle',
										}}
									>
										<FontAwesomeIcon icon='guitar'></FontAwesomeIcon>
									</SvgIcon>
								</Tooltip>
								{artist.genres.map((genre, key) => (
										<Chip
											key={key}
											label={genre}
											size='small'
											sx={{ margin: '0 4px' }}
										></Chip>
								  ))}
							</Grid>
						)
								: ''}
						{artist.city && artist.state ? (
							<Grid
								item
								container
								alignItems='center'
								sx={{ marginTop: '8px' }}
							>
								<Tooltip title='Location' placement='bottom' arrow>
									<PlaceTwoToneIcon
										sx={{ marginRight: '8px' }}
									></PlaceTwoToneIcon>
								</Tooltip>
								<Typography component='h3'>
									{toTitleCase(artist.city)}, {artist.state}
								</Typography>
							</Grid>
						) : (
							''
						)}
						{artist.soundsLike && artist.soundsLike.constructor.name === "Array" ? (
							<Grid
								item
								container
								alignItems='center'
								sx={{ marginTop: '8px' }}
							>
								<Tooltip title='Sounds Like' placement='bottom' arrow>
									<HearingTwoToneIcon
										sx={{ marginRight: '8px' }}
									></HearingTwoToneIcon>
								</Tooltip>
								{artist.soundsLike.map((sndsLike, key) => (
											<Chip
												key={key}
												label={sndsLike}
												size='small'
												sx={{ margin: '0 4px' }}
											></Chip>
									  ))}
							</Grid>
						) : (
							''
						)}
						{artist.socialLinks &&
						Object.keys(artist.socialLinks).length > 0 ? (
							<Grid
								container
								item
								direction='row'
								sx={{
									margin: '8px auto',
									width: '100%',
								}}
							>
								{artist.socialLinks.map((eachSocialLink, idx) => (
									<Grid
										item
										xs={1}
										//md={0.5}
										className='link-icon'
										key={`eachSocialLink${idx}`}
									>
										<Tooltip
											title={toTitleCase(pullDomainFrom(eachSocialLink.link))}
											placement='bottom'
											arrow
										>
											<a href={eachSocialLink.link} target='_blank'>
												{getFontAwesomeIcon(eachSocialLink.link)}
											</a>
										</Tooltip>
									</Grid>
								))}
							</Grid>
						) : (
							''
						)}
					</Grid>
				</Grid>
			{/* ) : (
				''
			)} */}
			<Grid
				item
				container
				justifyContent='start'
				direction='row'
				sx={{ height: '100%', padding: '8px 20px 0!important' }}
			>
				{artist.artistStatementVideo ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						
						className='artistStatementVideo'
						xs={6}
					>
					<Typography component='h3'>Artist Statement:</Typography>
						<ReactPlayer light={true} url={artist.artistStatementVideo} width="100%" style={{width: "100%", padding: '0 8px 0 0'}}/>
					</Grid>
				: ''}
				{artist.bio ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						className='bio'
						xs={6}
					>
						<Typography component='h3'>Bio:</Typography>

						{ artist.bio }
					</Grid>
				: ''}
			</Grid>
			<Grid
				item
				container
				justifyContent='start'
				direction='row'
				sx={{ height: '100%', padding: '8px 20px!important' }}
			>
				{artist.repLink ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						
						className='repLink'
						xs={6}
					>
						<Typography component='h3'>Listen to {artist.stageName}:</Typography>
						<ReactPlayer url={artist.repLink} width="100%" style={{width: "100%", padding: '0 8px 0 0'}}/>
					</Grid>
				: ''}
				{artist.livePerformanceVideo ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						
						className='livePerformanceVideo'
						xs={6}
					>
						<Typography component='h3'>Live performance of {artist.stageName}:</Typography>
						<ReactPlayer url={artist.livePerformanceVideo} width="100%" style={{width: "100%", padding: '0 8px 0 0'}}/>
					</Grid>
				: ''}
			</Grid>
		{bookingWhenWhere && bookingWhenWhere.length > 0 && bookingWhenWhere[0].when ? //check to be sure there's a valid first entry
			<Grid
				item
				container
				justifyContent='start'
				direction='column'
				sx={{ height: '100%', padding: '0 20px!important' }}
				className="bookingDetails"
			>
				<Typography component='h2'>Booking Info:</Typography>
				{/* {bookingWhenWhere && bookingWhenWhere.length > 0 && bookingWhenWhere[0].when ? //check to be sure there's a valid first entry */}
					<Grid
							className='whenBooking'
							container
							direction='row'
							justifyContent='center'
							alignItems='start'
							spacing={2}
							sx={{
								margin: '0px auto',
								width: '100%',
							}}
						>

					{bookingWhenWhere.filter(e => e).map((whenBooking, idx, whenWhereOrig) => ( //.filter(e => e) to remove any null values
						<Grid
							className='whenBooking'
							key={`whenBooking${idx}`}
							item
							xs={3}
							sx={{
								backgroundColor: 'rgba(0,0,0,0.35)',
								'&:hover': {},
								padding: '0 10px 10px',
								margin: '0px auto',
							}}
						>

							<TodayTwoToneIcon></TodayTwoToneIcon> 
							{whenBooking && whenBooking.where && (new Date(whenBooking.when).toDateString() + ': '+ whenBooking.where.city + ', '+whenBooking.where.state)}
								
						</Grid>
					))}
					</Grid>
					
				{artist.costStructure && artist.namedPrice ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='costStructure'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=costStructure">Edit</Link>}
						>
					{artist.costStructure === 'donation' ? <VolunteerActivismTwoToneIcon></VolunteerActivismTwoToneIcon> : <ConfirmationNumberTwoToneIcon></ConfirmationNumberTwoToneIcon> }
					</Tooltip>
					{' '}{'Concerts will be '}<strong>{artist.costStructure == 'ticket' ? 'ticketed' : 'donation-based'}</strong>{', at '}<strong>{' $'}{ artist.namedPrice }</strong>{' per '}{ artist.costStructure }
					</Grid>
				: ''}
				{artist.tourVibe ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='tourVibe'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=tourVibe">Edit</Link>}
						>
					<GroupsTwoToneIcon></GroupsTwoToneIcon></Tooltip>
					{' '}<strong>{'Audience:'}</strong>{' '}{ artist.tourVibe }
					</Grid>
				: ''}
				{artist.showSchedule ?
					<Fragment>
						<Grid
							item
							sx={{ marginTop: '0' }}
							xs={2}
							className='showSchedule'
						>
						<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=showSchedule">Edit</Link>}
						>
							<AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
							</Tooltip>
							{' Setup at '}<strong>{ convert24HourTime(artist.showSchedule.setupTime) }</strong>
							{', doors open at '}<strong>{ convert24HourTime(artist.showSchedule.doorsOpen) }</strong>
							{', show starts at '}<strong>{ convert24HourTime(artist.showSchedule.startTime) }</strong>
							{', with a hard wrap at '}<strong>{ convert24HourTime(artist.showSchedule.hardWrap) }</strong>
						</Grid>
					</Fragment>
				: ''}
				{artist.overnight ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='overnight'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=overnight">Edit</Link>}
						>
					<HotelTwoToneIcon></HotelTwoToneIcon></Tooltip>
					{' If possible, to be hosted overnight! Overnight accommodation desired: '}<strong>{ artist.overnight + (artist.overnight > 1 ? ' beds' : ' bed') }</strong>
					</Grid>
				: ''}
				{artist.merchTable ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='merchTable'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=merchTable">Edit</Link>}
						>
					<TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon></Tooltip>
					{' '}<strong>{'Would like a merch table (for CDs, t-shirts, etc.)'}</strong>{' '}{ artist.merchTable }
					</Grid>
				: ''}
				{/* {!artist.merchTable ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
					{' '}<strong>{'Does NOT need a merch table'}</strong>{' '}
					</Grid>
				: ''} */}
				{artist.allergies.length > 0 ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='allergies'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=allergies">Edit</Link>}
						>
						<SvgIcon
							style={{
								marginRight: '4px',
								fontSize: '1.3em',
								verticalAlign: 'middle',
							}}
						>
							<FontAwesomeIcon icon='allergies'></FontAwesomeIcon>
						</SvgIcon>
						</Tooltip>
						{' Has these allergies: '}<strong>{ artist.allergies.constructor.name === "Array" && artist.allergies.map(((allergy, ind) => { 
						if (ind !== artist.allergies.length - 1) {
							return allergy + ', '
						}
						else {
							return allergy
						}
					})) } </strong>
					</Grid>
				: ''}
				{artist.familyFriendly ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='familyFriendly'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=familyFriendly">Edit</Link>}
						>
					<FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon></Tooltip>
					{' '}<strong>{'“Family-friendly”'}</strong>
					</Grid>
				: ''}
				{!artist.familyFriendly ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='familyFriendly'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=familyFriendly">Edit</Link>}
						>
					<WcTwoToneIcon></WcTwoToneIcon></Tooltip>
					{' '}<strong>{'Would prefer to have an adults-only show'}</strong>
					</Grid>
				: ''}
				{artist.soundSystem == 'yes' ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='soundSystem'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=soundSystem">Edit</Link>}
						>
					<SpeakerTwoToneIcon></SpeakerTwoToneIcon></Tooltip>
					{' '}<strong>{'Able to bring their own sound system'}</strong>{' '}
					</Grid>
				: ''}
				{artist.soundSystem == 'noButNeed' ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='soundSystem'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=soundSystem">Edit</Link>}
						>
					<SpeakerTwoToneIcon></SpeakerTwoToneIcon></Tooltip>
					{' '}<strong>{'Needs a sound system'}</strong>{' '}
					</Grid>
				: ''}
				{artist.soundSystem == 'no' ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='soundSystem'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=soundSystem">Edit</Link>}
						>
					<SpeakerTwoToneIcon></SpeakerTwoToneIcon></Tooltip>
					{' '}<strong>{'Able to play an acoustic show if it makes sense for the size of the space.'}</strong>{' '}
					</Grid>
				: ''}
				{artist.covidPrefs.length > 0 ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='covidPrefs'
					><Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=covidPrefs">Edit</Link>}
						>
					<CoronavirusTwoToneIcon></CoronavirusTwoToneIcon></Tooltip>
						{' Considering Covid, would prefer: '}<strong>{ artist.covidPrefs.constructor.name === "Array" && artist.covidPrefs.map(((covidPref, ind) => { 
						if (ind !== artist.covidPrefs.length - 1) {
							return covidPref + ', '
						}
						else {
							return covidPref
						}
					})) }</strong>
					</Grid>
				: ''}
				{artist.financialHopes ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
						className='financialHopes'
					>
					<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=financialHopes">Edit</Link>}
						>
					<SavingsTwoToneIcon></SavingsTwoToneIcon></Tooltip>
					{' It would be hard to make less than '}<strong>${ artist.financialHopes }</strong>{' per show'}
					</Grid>
					
				: ''}
				{artist.fanActions ?
					
						<Grid
							item
							sx={{ marginTop: '0' }}
							xs={6}
							className='fanActions'
						>
						<Tooltip
							arrow={true}
							disableHoverListener={ !isMe }
							
							title={<Link to="/edit-artist-booking?field=fanActions">Edit</Link>}
						>
							<ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
						</Tooltip>
							{' How new fans can show support: '}<strong>{ artist.fanActions.map(((fanAction, ind) => { 
								if (ind !== artist.fanActions.length - 1) {
									return fanAction + ', '
								}
								else {
									return fanAction
								}
							})) } </strong>
						
						</Grid>
					
				: ''}

			</Grid>
			: ''}
			</Grid>
		</Fragment>
	);
};

ArtistTileBack.propTypes = {
	artist: PropTypes.object.isRequired,
	me: PropTypes.object,
};

const mapStateToProps = (state) => ({
	me: state.artist.me
});

export default connect(mapStateToProps)(
	withRouter(ArtistTileBack)
); //withRouter allows us to pass history objects