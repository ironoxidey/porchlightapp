import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import {
	toTitleCase,
	youTubeEmbed,
	getFontAwesomeIcon,
	pullDomainFrom,
	convert24HourTime
} from '../../actions/app';

const ArtistTileBack = ({
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
		allowKids,
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
	return (
		<Fragment>
			{wideImg ? (
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
			) : (
				''
			)}
			<Grid
				item
				container
				justifyContent='start'
				direction='row'
				sx={{ height: '100%', padding: '0 20px!important' }}
			>
				{artist.artistStatementVideo ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						
						className='artistStatementVideo'
						xs={6}
					>
						{ youTubeEmbed(artist.artistStatementVideo)}
					</Grid>
				: ''}
				{artist.bio ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						className='bio'
						xs={6}
					>
						{ artist.bio }
					</Grid>
				: ''}
			</Grid>
			<Grid
				item
				container
				justifyContent='start'
				direction='column'
				sx={{ height: '100%', padding: '0 20px!important' }}
				className="bookingDetails"
			>
				{artist.costStructure && artist.namedPrice ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					{artist.costStructure === 'donation' ? <VolunteerActivismTwoToneIcon></VolunteerActivismTwoToneIcon> : <ConfirmationNumberTwoToneIcon></ConfirmationNumberTwoToneIcon> }
					{' $'}{ artist.namedPrice }{' '}{ artist.costStructure }
					</Grid>
				: ''}
				{artist.tourVibe ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<GroupsTwoToneIcon></GroupsTwoToneIcon>
					{' '}{ artist.tourVibe }
					</Grid>
				: ''}
				{bookingWhenWhere && bookingWhenWhere.length > 0 && bookingWhenWhere[0].when ? //check to be sure there's a valid first entry
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

							<FontAwesomeIcon icon='calendar-day'></FontAwesomeIcon> {whenBooking && whenBooking.where && (new Date(whenBooking.when).toDateString() + ': '+ whenBooking.where.city + ', '+whenBooking.where.state)}
								
						</Grid>
					))}
					</Grid>
					: ''}
					{artist.showSchedule ?
						<Fragment>
							<Grid
								item
								sx={{ marginTop: '0' }}
								xs={2}
							>
								<AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
								{' Setup at: '}{ convert24HourTime(artist.showSchedule.setupTime) }
							</Grid>
							<Grid
								item
								sx={{ marginTop: '0' }}
								xs={2}
							>
								<AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
								{' Doors open at: '}{ convert24HourTime(artist.showSchedule.doorsOpen) }
							</Grid>
							<Grid
								item
								sx={{ marginTop: '0' }}
								xs={2}
							>
								<AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
								{' Show starts at: '}{ convert24HourTime(artist.showSchedule.startTime) }
							</Grid>
							<Grid
								item
								sx={{ marginTop: '0' }}
								xs={2}
							>
								<AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
								{' Hard wrap at: '}{ convert24HourTime(artist.showSchedule.hardWrap) }
							</Grid>
						</Fragment>
				: ''}
				{artist.overnight ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<HotelTwoToneIcon></HotelTwoToneIcon>
					{' '}{ artist.overnight + (artist.overnight > 1 ? ' beds' : ' bed') }
					</Grid>
				: ''}
				{artist.merchTable ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
					{' '}{ artist.merchTable }
					</Grid>
				: ''}
				{artist.allergies ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
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
					{' '}{ artist.allergies.constructor.name === "Array" && artist.allergies.map(((allergy, ind) => { 
						if (ind !== artist.allergies.length - 1) {
							return allergy + ', '
						}
						else {
							return allergy
						}
					})) }
					</Grid>
				: ''}
				{artist.allowKids ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon>
					{' '}{ artist.allowKids }
					</Grid>
				: ''}
				{artist.soundSystem ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<SpeakerTwoToneIcon></SpeakerTwoToneIcon>
					{' '}{ artist.soundSystem }
					</Grid>
				: ''}
				{artist.covidPrefs ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<CoronavirusTwoToneIcon></CoronavirusTwoToneIcon>
					{' '}{ artist.covidPrefs.constructor.name === "Array" && artist.covidPrefs.map(((covidPref, ind) => { 
						if (ind !== artist.covidPrefs.length - 1) {
							return covidPref + ', '
						}
						else {
							return covidPref
						}
					})) }
					</Grid>
				: ''}
				{artist.financialHopes ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<SavingsTwoToneIcon></SavingsTwoToneIcon>
					{' '}{ artist.financialHopes }
					</Grid>
				: ''}
				{artist.fanActions ?
					<Grid
						item
						sx={{ marginTop: '0' }}
						xs={6}
					>
					<ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
					{' '}{ artist.fanActions.map(((fanAction, ind) => { 
						if (ind !== artist.fanActions.length - 1) {
							return fanAction + ', '
						}
						else {
							return fanAction
						}
					})) }
					</Grid>
				: ''}

			</Grid>
			
		</Fragment>
	);
};

ArtistTileBack.propTypes = {
	artist: PropTypes.object.isRequired,
};

export default ArtistTileBack;
