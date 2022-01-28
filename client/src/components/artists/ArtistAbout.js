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

import {
	youTubeEmbed,
	getFontAwesomeIcon,
	pullDomainFrom,
} from '../../actions/app';

const ArtistAbout = ({ artist }) => {
	return (
		<Fragment>
			<Grid
				container
				sx={{
					maxWidth: '960px',
					width: 'calc(100% - 40px)',
					margin: '0 auto',
				}}
			>
				{pullDomainFrom(artist.artistStatementVideo) === 'youtube' ? (
					<Grid
						item
						sx={{ marginTop: '0' }}
						direction='row'
						alignItems='start'
						className='artistStatementVideo'
						md={8}
						xs={12}
					>
						{youTubeEmbed(artist.artistStatementVideo)}
					</Grid>
				) : (
					''
				)}
				<Grid
					item
					container
					sx={{ marginTop: '0' }}
					direction='row'
					alignContent='start'
					className='rightSidebar'
					md={4}
					xs={12}
				>
					{artist.bio ? (
						<Grid
							item
							sx={{ marginTop: '0' }}
							direction='row'
							alignItems='start'
							className='socialIcons'
							xs={12}
						>
							<Typography
								sx={{
									fontSize: '.9em',
									lineHeight: 1.7,
								}}
							>
								{artist.bio}
							</Typography>
						</Grid>
					) : (
						''
					)}
					<Grid
						item
						sx={{ marginTop: '0' }}
						alignItems='start'
						className='socialIcons'
						xs={12}
					>
						{artist.socialLinks &&
						Object.keys(artist.socialLinks).length > 0 ? (
							<Grid
								container
								item
								direction='row'
								justifyContent='right'
								sx={{
									margin: '0px auto',
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
										<a href={eachSocialLink.link} target='_blank'>
											{getFontAwesomeIcon(eachSocialLink.link)}
										</a>
									</Grid>
								))}
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
