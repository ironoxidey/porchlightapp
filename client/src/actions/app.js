import { OPEN_NAV_DRAWER, CLOSE_NAV_DRAWER, FLIP_ARTIST_CARD } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core'; //for checking the existence of an icon

export const openNavDrawer = () => (dispatch) => {
	dispatch({
		type: OPEN_NAV_DRAWER,
	});
};

export const closeNavDrawer = () => (dispatch) => {
	dispatch({
		type: CLOSE_NAV_DRAWER,
	});
};

export const flipArtistCard = (artist) => (dispatch) => {
	dispatch({
		type: FLIP_ARTIST_CARD,
		payload: artist,
	});
};

export const pullDomainFrom = (url) => {
	try {
		let theURL = new URL(url);
		//console.log('theURL: ' + theURL);
		let domain = theURL.hostname.split('.');
		let linkName = domain.slice(-(domain.length === 4 ? 3 : 2))[0];
		//console.log(linkName);

		if (domain) {
			return linkName;
		}
	} catch (err) {
		return '';
	}
};

export const pullYouTubeEmbedCode = (url) => {
	let theDomain = pullDomainFrom(url);
	if (theDomain === 'youtube') {
		let theSearchParams = new URL(url).search;
		let theEmbedCode = new URLSearchParams(theSearchParams).get('v');
		return theEmbedCode;
	} else {
		return url;
	}
};

export const youTubeEmbed = (formInput) => {
	try {
		return (
			<iframe
				style={{ margin: '8px auto' }}
				width='560'
				height='315'
				src={`https://www.youtube.com/embed/${pullYouTubeEmbedCode(
					formInput
				)}?rel=0`}
				title='YouTube video player'
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
			></iframe>
		);
	} catch (err) {
		console.log(err);
	}
};

export const getFontAwesomeIcon = (url) => {
	let theDomain = pullDomainFrom(url);
	let isIcon = icon({
		prefix: 'fab',
		iconName: theDomain,
	}); //will return 'undefined' if no icon found
	if (isIcon) {
		return <FontAwesomeIcon icon={['fab', theDomain]} size='lg' fixedWidth />;
	} else {
		return (
			<FontAwesomeIcon icon={['fas', 'globe-americas']} size='lg' fixedWidth />
		);
		//console.log('no icon for: ' + pullDomainFrom(url));
		return '';
	}
};

export const toTitleCase = (str) => {
	var i, j, str, lowers, uppers;
	str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string
	lowers = [
		'A',
		'An',
		'The',
		'And',
		'But',
		'Or',
		'For',
		'Nor',
		'As',
		'At',
		'By',
		'For',
		'From',
		'In',
		'Into',
		'Near',
		'Of',
		'On',
		'Onto',
		'To',
		'With',
	];
	for (i = 0, j = lowers.length; i < j; i++)
		str = str.replace(
			new RegExp('\\s' + lowers[i] + '\\s', 'g'),
			function (txt) {
				return txt.toLowerCase();
			}
		);

	// Certain words such as initialisms or acronyms should be left uppercase
	uppers = ['Id', 'Tv'];
	for (i = 0, j = uppers.length; i < j; i++)
		str = str.replace(
			new RegExp('\\b' + uppers[i] + '\\b', 'g'),
			uppers[i].toUpperCase()
		);

	return str;
};
