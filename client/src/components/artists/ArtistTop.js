import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
	TextField,
	//Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Select,
	InputLabel,
	MenuItem,
	InputAdornment,
	IconButton,
	Grid,
	Box,
	Paper,
	BottomNavigationAction,
	BottomNavigation,
	Autocomplete,
	Chip,
	Typography,
	withStyles,
} from '@mui/material';
import Button from '../layout/SvgButton';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';

const ArtistTop = ({
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
					sx={{
						padding: '20px!important',
						height: '30vh',
						width: 'calc(100% - 40px)',
						margin: '0 auto',
						borderRadius: '8px',
						backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url("${wideImg}")`,
						backgroundPosition: '50% 25%',
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
								<Grid
									item
									sx={{
										height: '100px',
										width: '100px',
										maxHeight: '100px',
										maxWidth: '100px',
										borderRadius: '50%',
										overflow: 'hidden',
										backgroundImage: `url("${artist.squareImg}")`,
										backgroundPosition: '50% 25%',
										backgroundSize: 'cover',
										outlineOffset: '4px',
										outline: '1px solid var(--primary-color)',
									}}
								></Grid>
							) : (
								''
							)}
							<Grid
								item
								container
								xs={10}
								sx={{ marginTop: '0', textShadow: '0 0 10px rgba(0,0,0,.8)' }}
								direction='column'
								alignItems='start'
							>
								{artist.stageName ? (
									<Grid item>
										<Typography component='h2'>{artist.stageName}</Typography>
									</Grid>
								) : (
									''
								)}
								<Grid item>
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
										<HomeTwoToneIcon
											sx={{ marginRight: '8px' }}
										></HomeTwoToneIcon>
										<Typography component='h3'>
											{artist.city}, {artist.state}
										</Typography>
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

ArtistTop.propTypes = {
	artist: PropTypes.object.isRequired,
};

export default ArtistTop;
