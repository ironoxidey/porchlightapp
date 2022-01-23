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
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import Button from '../layout/SvgButton';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

const ArtistAbout = ({ artist }) => {
	return (
		<Fragment>
			<Grid container sx={{ padding: '0 20px 20px!important' }}>
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
							}}
						>
							{/* <img
								className='squareImg-image'
								src={artist.squareImg}
								alt=''
								style={{
									maxHeight: '20vh',
									maxWidth: '90vw',
									height: 'auto',
									width: 'auto',
								}}
							/> */}
						</Grid>
					) : (
						''
					)}
					<Grid
						item
						container
						xs={10}
						sx={{ marginTop: '0' }}
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
								<HomeTwoToneIcon sx={{ marginRight: '8px' }}></HomeTwoToneIcon>
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
		</Fragment>
	);
};

ArtistAbout.propTypes = {
	artist: PropTypes.object.isRequired,
};

export default ArtistAbout;
