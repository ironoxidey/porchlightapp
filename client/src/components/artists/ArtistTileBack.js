import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Grid, Chip, Typography, Box, Tooltip, SvgIcon } from '@mui/material';
import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import {
	toTitleCase,
	youTubeEmbed,
	getFontAwesomeIcon,
	pullDomainFrom,
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
						//padding: '20px!important',
						height: '50vw',
						maxHeight: '50vh',
						//width: 'calc(100% - 40px)',
						//maxWidth: '960px',
						margin: '0 auto',
						borderRadius: '8px',
						backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${wideImg}")`,
						backgroundPosition: '50% 50%',
						backgroundSize: 'cover',
					}}
				>
					<Grid
						item
						container
						justifyContent='center'
						sx={{ height: '100%', padding: '0 20px!important' }}
					>
						<Grid
							item
							container
							spacing={2}
							sx={{ marginTop: '0' }}
							direction='row'
							alignItems='center'
						>
							{artist.squareImg ? (
								<Grid item>
									<Box
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
								<Grid item>
									{artist.genres ? (
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
									) : (
										''
									)}
									{artist.genres && artist.genres.length > 0
										? artist.genres.map((genre, key) => (
												<Chip
													key={key}
													label={genre}
													size='small'
													sx={{ margin: '0 4px' }}
												></Chip>
										  ))
										: ''}
								</Grid>
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
								{artist.soundsLike ? (
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
										{artist.soundsLike.length > 0
											? artist.soundsLike.map((sndsLike, key) => (
													<Chip
														key={key}
														label={sndsLike}
														size='small'
														sx={{ margin: '0 4px' }}
													></Chip>
											  ))
											: ''}
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
													title={toTitleCase(
														pullDomainFrom(eachSocialLink.link)
													)}
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
					</Grid>
				</Grid>
			) : (
				''
			)}
		</Fragment>
	);
};

ArtistTileBack.propTypes = {
	artist: PropTypes.object.isRequired,
};

export default ArtistTileBack;
