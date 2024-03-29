// import axios from 'axios'; //only for uploads as of December 31st, 2021
// import React, { Fragment, useState, useEffect, useRef } from 'react';
// import {
//     Link,
//     // withRouter,
//     useLocation,
// } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { connect, useDispatch } from 'react-redux';
// import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
// import { setAlert } from '../../actions/alert';
// import { createMyArtist } from '../../actions/artist';
// import { updateUserAvatar } from '../../actions/auth';
// import {
//     TextField,
//     //Button,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     FormControl,
//     FormLabel,
//     Select,
//     InputLabel,
//     MenuItem,
//     InputAdornment,
//     IconButton,
//     Grid,
//     Box,
//     Paper,
//     BottomNavigationAction,
//     BottomNavigation,
//     Autocomplete,
//     Chip,
//     withStyles,
//     Typography,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Button from '../layout/SvgButton';

// import DeleteIcon from '@mui/icons-material/Delete';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
// import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
// import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
// import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';

// //import { DateRangePicker, DateRange } from "materialui-daterange-picker";
// //import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
// // import MultipleDatesPicker from '../mui-multi-date-picker-lib';
// import { DateCalendar } from '@mui/x-date-pickers';

// import { useTransition, animated, config } from '@react-spring/web';
// import styles from '../../formCards.css';
// import { textAlign } from '@mui/system';

// import {
//     getFontAwesomeIcon,
//     getHostLocations,
//     sortDates,
// } from '../../actions/app';
// import { getHostsLocations } from '../../actions/host';
// import moment from 'moment';
// import ReactPlayer from 'react-player/lazy';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

// //filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
// Object.filter = (obj, predicate) =>
//     Object.keys(obj)
//         .filter((key) => predicate(obj[key]))
//         .reduce((res, key) => ((res[key] = obj[key]), res), []);

// // const hostLocations = getHostsLocations();
// // console.log(
// //     'The hard coded list:',
// //     getHostLocations(),
// //     'The list from the database:',
// //     getHostsLocations()
// // );

// const UploadInput = styled('input')({
//     display: 'none',
// });

// const EditArtistBookingForm = ({
//     theArtist,
//     //theArtist: { loading },
//     createMyArtist,
//     getHostsLocations,
//     hosts,
//     history,
//     auth,
//     updateUserAvatar,
// }) => {
//     const loading = false; //a bunch of things are dependent on it; I should really just take it out.
//     const dispatch = useDispatch();

//     //let hostLocations = [];
//     //const [hostLocations, setHostLocations] = useState([]);

//     useEffect(() => {
//         getHostsLocations();
//         //setHostLocations(hosts);
//         // console.log(
//         //     'The hard coded list:',
//         //     getHostLocations(),
//         //     'The list from the database:',
//         //     hosts
//         // );
//     }, []);

//     const [formData, setFormData] = useState({
//         slug: '',
//         email: '',
//         firstName: '',
//         lastName: '',
//         stageName: '',
//         genres: [],
//         soundsLike: [],
//         medium: '',
//         repLinks: [],
//         repLink: '',
//         socialLinks: [],
//         helpKind: '',
//         // typeformDate: '',
//         // active: '',
//         phone: '',
//         hometown: '',
//         streetAddress: '',
//         city: '',
//         state: '',
//         zip: '',
//         promotionApproval: '',
//         artistWebsite: '',
//         artistStatementVideo: '',
//         livePerformanceVideo: '',
//         costStructure: '',
//         namedPrice: '',
//         payoutPlatform: 'PayPal',
//         payoutHandle: '',
//         tourVibe: [],
//         bookingWhen: [],
//         bookingWhenWhere: [],
//         setLength: '',
//         schedule: '',
//         showSchedule: {
//             setupTime: '17:45',
//             startTime: '19:00',
//             doorsOpen: '18:30',
//             hardWrap: '21:00',
//             flexible: true,
//         },
//         overnight: '',
//         openers: '',
//         travelingCompanions: [],
//         //companionTravelers: '',
//         hangout: '',
//         merchTable: false,
//         allergies: [],
//         familyFriendly: false,
//         alcohol: false,
//         soundSystem: '',
//         agreeToPayAdminFee: true,
//         agreeToPromote: false,
//         wideImg: '',
//         squareImg: '',
//         covidPrefs: [],
//         artistNotes: '',
//         financialHopes: '',
//         fanActions: [],
//         // onboardDate: '',
//         bio: '',
//         artistUpdated: new Date(),
//     });

//     useEffect(() => {
//         if (theArtist) {
//             setFormData({
//                 slug: loading || !theArtist.slug ? '' : theArtist.slug,
//                 email: loading || !theArtist.email ? '' : theArtist.email,
//                 firstName:
//                     loading || !theArtist.firstName ? '' : theArtist.firstName,
//                 lastName:
//                     loading || !theArtist.lastName ? '' : theArtist.lastName,
//                 stageName:
//                     loading || !theArtist.stageName ? '' : theArtist.stageName,
//                 medium: loading || !theArtist.medium ? '' : theArtist.medium,
//                 genres: loading || !theArtist.genres ? [] : theArtist.genres,
//                 soundsLike:
//                     loading || !theArtist.soundsLike
//                         ? []
//                         : theArtist.soundsLike,
//                 repLinks:
//                     loading || !theArtist.repLinks ? [] : theArtist.repLinks,
//                 repLink: loading || !theArtist.repLink ? '' : theArtist.repLink,
//                 socialLinks:
//                     loading || !theArtist.socialLinks
//                         ? []
//                         : theArtist.socialLinks,
//                 helpKind:
//                     loading || !theArtist.helpKind ? '' : theArtist.helpKind,
//                 // typeformDate: loading || !theArtist.typeformDate ? '' : theArtist.typeformDate,
//                 // active: loading || (theArtist.active == null) ? false : theArtist.active,
//                 phone: loading || !theArtist.phone ? '' : theArtist.phone,
//                 hometown:
//                     loading || !theArtist.hometown ? '' : theArtist.hometown,
//                 streetAddress:
//                     loading || !theArtist.streetAddress
//                         ? ''
//                         : theArtist.streetAddress,
//                 city: loading || !theArtist.city ? '' : theArtist.city,
//                 state: loading || !theArtist.state ? '' : theArtist.state,
//                 zip: loading || !theArtist.zip ? '' : theArtist.zip,
//                 promotionApproval:
//                     loading || !theArtist.promotionApproval
//                         ? ''
//                         : theArtist.promotionApproval,
//                 artistWebsite:
//                     loading || !theArtist.artistWebsite
//                         ? ''
//                         : theArtist.artistWebsite,
//                 artistStatementVideo:
//                     loading || !theArtist.artistStatementVideo
//                         ? ''
//                         : theArtist.artistStatementVideo,
//                 livePerformanceVideo:
//                     loading || !theArtist.livePerformanceVideo
//                         ? ''
//                         : theArtist.livePerformanceVideo,
//                 costStructure:
//                     loading || !theArtist.costStructure
//                         ? ''
//                         : theArtist.costStructure,
//                 namedPrice:
//                     loading || !theArtist.namedPrice
//                         ? ''
//                         : theArtist.namedPrice,
//                 payoutPlatform:
//                     loading || !theArtist.payoutPlatform
//                         ? 'PayPal'
//                         : theArtist.payoutPlatform,
//                 payoutHandle:
//                     loading || !theArtist.payoutHandle
//                         ? ''
//                         : theArtist.payoutHandle,
//                 tourVibe:
//                     loading || !theArtist.tourVibe ? [] : theArtist.tourVibe,
//                 bookingWhen:
//                     loading || !theArtist.bookingWhen
//                         ? []
//                         : theArtist.bookingWhen,
//                 bookingWhenWhere:
//                     loading || !theArtist.bookingWhenWhere
//                         ? []
//                         : theArtist.bookingWhenWhere,
//                 setLength:
//                     loading || !theArtist.setLength ? '' : theArtist.setLength,
//                 schedule:
//                     loading || !theArtist.schedule ? '' : theArtist.schedule,
//                 showSchedule:
//                     loading || !theArtist.showSchedule
//                         ? {
//                               setupTime: '17:45',
//                               startTime: '19:00',
//                               doorsOpen: '18:30',
//                               hardWrap: '21:00',
//                               flexible: true,
//                           }
//                         : theArtist.showSchedule,
//                 overnight:
//                     loading || !theArtist.overnight ? '' : theArtist.overnight,
//                 openers: loading || !theArtist.openers ? '' : theArtist.openers,
//                 travelingCompanions:
//                     loading || theArtist.travelingCompanions == null
//                         ? []
//                         : theArtist.travelingCompanions,
//                 // companionTravelers:
//                 //     loading || theArtist.companionTravelers == null
//                 //         ? false
//                 //         : theArtist.companionTravelers,
//                 hangout:
//                     loading || theArtist.hangout == null
//                         ? false
//                         : theArtist.hangout,
//                 merchTable:
//                     loading || theArtist.merchTable == null
//                         ? false
//                         : theArtist.merchTable,
//                 allergies:
//                     loading || !theArtist.allergies ? [] : theArtist.allergies,
//                 familyFriendly:
//                     loading || theArtist.familyFriendly == null
//                         ? false
//                         : theArtist.familyFriendly,
//                 alcohol:
//                     loading || theArtist.alcohol == null
//                         ? false
//                         : theArtist.alcohol,
//                 soundSystem:
//                     loading || !theArtist.soundSystem
//                         ? ''
//                         : theArtist.soundSystem,
//                 agreeToPayAdminFee:
//                     loading || theArtist.agreeToPayAdminFee == null
//                         ? true
//                         : theArtist.agreeToPayAdminFee,
//                 agreeToPromote:
//                     loading || theArtist.agreeToPromote == null
//                         ? false
//                         : theArtist.agreeToPromote,
//                 wideImg: loading || !theArtist.wideImg ? '' : theArtist.wideImg,
//                 squareImg:
//                     loading || !theArtist.squareImg ? '' : theArtist.squareImg,
//                 covidPrefs:
//                     loading || !theArtist.covidPrefs
//                         ? []
//                         : theArtist.covidPrefs,
//                 artistNotes:
//                     loading || !theArtist.artistNotes
//                         ? ''
//                         : theArtist.artistNotes,
//                 financialHopes:
//                     loading || !theArtist.financialHopes
//                         ? ''
//                         : theArtist.financialHopes,
//                 fanActions:
//                     loading || !theArtist.fanActions
//                         ? []
//                         : theArtist.fanActions,
//                 // onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
//                 bio: loading || !theArtist.bio ? '' : theArtist.bio,
//                 artistUpdated: new Date(),
//             });
//         } else {
//             if (!auth.loading) {
//                 console.log(
//                     'An artist profile couldn’t be found for: ' +
//                         auth.user.email +
//                         '. No worries! We’ll make one!'
//                 );
//                 setFormData({
//                     email: auth.user.email,
//                     slug: '',
//                     firstName: auth.user.name.split(' ')[0],
//                     lastName: auth.user.name.split(' ')[1],
//                     stageName: '',
//                     genres: [],
//                     soundsLike: [],
//                     medium: '',
//                     repLinks: [],
//                     repLink: '',
//                     socialLinks: [],
//                     helpKind: '',
//                     // typeformDate: '',
//                     // active: '',
//                     phone: '',
//                     hometown: '',
//                     streetAddress: '',
//                     city: '',
//                     state: '',
//                     zip: '',
//                     promotionApproval: '',
//                     artistWebsite: '',
//                     artistStatementVideo: '',
//                     livePerformanceVideo: '',
//                     costStructure: '',
//                     namedPrice: '',
//                     payoutPlatform: 'PayPal',
//                     payoutHandle: '',
//                     tourVibe: [],
//                     bookingWhen: [],
//                     bookingWhenWhere: [],
//                     setLength: '',
//                     schedule: '',
//                     showSchedule: {
//                         setupTime: '17:45',
//                         startTime: '19:00',
//                         doorsOpen: '18:30',
//                         hardWrap: '21:00',
//                         flexible: true,
//                     },
//                     overnight: '',
//                     openers: '',
//                     travelingCompanions: [],
//                     //companionTravelers: '',
//                     hangout: '',
//                     merchTable: false,
//                     allergies: [],
//                     familyFriendly: false,
//                     alcohol: false,
//                     soundSystem: '',
//                     agreeToPayAdminFee: true,
//                     agreeToPromote: false,
//                     wideImg: '',
//                     squareImg: '',
//                     covidPrefs: [],
//                     artistNotes: '',
//                     financialHopes: '',
//                     fanActions: [],
//                     // onboardDate: '',
//                     bio: '',
//                 });
//             }
//         }
//     }, [auth.loading, createMyArtist, theArtist]);

//     const {
//         slug,
//         email,
//         firstName,
//         lastName,
//         stageName,
//         medium,
//         genres,
//         soundsLike,
//         repLinks,
//         repLink,
//         socialLinks,
//         helpKind,
//         // typeformDate,
//         // active,
//         phone,
//         hometown,
//         streetAddress,
//         city,
//         state,
//         zip,
//         promotionApproval,
//         artistWebsite,
//         artistStatementVideo,
//         livePerformanceVideo,
//         costStructure,
//         payoutPlatform,
//         payoutHandle,
//         tourVibe,
//         namedPrice,
//         bookingWhen,
//         bookingWhenWhere,
//         setLength,
//         schedule,
//         showSchedule,
//         overnight,
//         openers,
//         travelingCompanions,
//         //companionTravelers,
//         hangout,
//         merchTable,
//         allergies,
//         familyFriendly,
//         alcohol,
//         soundSystem,
//         agreeToPayAdminFee,
//         agreeToPromote,
//         wideImg,
//         squareImg,
//         covidPrefs,
//         artistNotes,
//         financialHopes,
//         fanActions,
//         // onboardDate,
//         bio,
//     } = formData;

//     const onChange = (e) => {
//         //console.log(e);
//         //console.log(Object.keys(formGroups).length);
//         changesMade.current = true;
//         let targetValue = e.target.value;
//         switch (e.target.type) {
//             case 'checkbox':
//                 targetValue = e.target.checked;
//                 break;
//             default:
//                 targetValue = e.target.value;
//         }
//         const targetName = e.target.name.split('.');
//         //console.log(targetName + ': ' + targetValue);
//         //setFormData({ ...formData, [e.target.name]: targetValue });
//         if (targetName.length === 1) {
//             setFormData({ ...formData, [targetName[0]]: targetValue });
//         } else {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 [targetName[0]]: {
//                     ...prevData[targetName[0]],
//                     [targetName[1]]: targetValue,
//                 },
//             }));
//             //console.log(formData);
//         }
//     };
//     const onPhoneChange = (theFieldName, val) => {
//         changesMade.current = true;
//         let targetValue = val;
//         setFormData({ ...formData, [theFieldName]: targetValue });
//     };
//     const onAutocompleteTagChange = (e, theFieldName, val) => {
//         //console.log(theFieldName);
//         //console.log(Object.keys(formGroups).length);
//         changesMade.current = true;
//         let targetValue = val;
//         setFormData({ ...formData, [theFieldName]: targetValue });
//     };
//     //onAutocompleteTagChange(event, 'allergies', value)
//     //onMultiTextChange('email', travelingCompanions, idx, e)
//     const onMultiAutocompleteTagChange = (
//         theFieldKey,
//         theFieldName,
//         theFieldObj,
//         idx,
//         e,
//         value
//     ) => {
//         changesMade.current = true;
//         let targetValue = value;
//         let updatedField = theFieldObj.map((fieldObj, tFidx) => {
//             if (idx !== tFidx) return fieldObj;
//             return { ...fieldObj, [theFieldKey]: targetValue }; //updates travelingCompanion[tFidx].name
//         });
//         // dispatch({
//         // 	type: UPDATE_ARTIST_ME,
//         // 	payload: { ...formData, [theFieldName]: updatedField },
//         // });
//         setFormData({ ...formData, [theFieldName]: updatedField });
//     };

//     // const handleAddMultiInput = (targetName, theFieldObj, payload) => {
//     // 	//super helpful: https://goshacmd.com/array-form-inputs/
//     // 	let updatedField = theFieldObj.concat([{}]);
//     // 	console.log(targetName);
//     // 	if (targetName == 'bookingWhenWhere') {
//     // 		updatedField = theFieldObj.concat([
//     // 			{ when: payload, where: [] },
//     // 		]);
//     // 	}
//     // 	// console.log("["+targetName+"]: ");
//     // 	console.log(updatedField);
//     // 	setFormData({ ...formData, [targetName]: updatedField });
//     // };

//     useEffect(() => {
//         if (changesMade.current) {
//             createMyArtist(formData, history, true);
//             changesMade.current = false;
//         }
//     }, [bookingWhenWhere]);

//     useEffect(() => {
//         if (bookingWhen && bookingWhen.length > 0) {
//             let writeToState = false;
//             let updatedField = [];
//             let whenWhereFiltered = [];
//             let bookingWhenDated = bookingWhen.map((messyDate) => {
//                 return new Date(messyDate).toISOString();
//             });
//             bookingWhenDated.forEach((whenBooking, idx) => {
//                 //return an object trim out of bookingWhenWhere any whens that aren't in bookingWhen
//                 whenWhereFiltered = Object.filter(
//                     bookingWhenWhere,
//                     (whenWhere) => {
//                         //https://stackoverflow.com/a/37616104/3338608
//                         if (whenWhere) {
//                             //occasionally I get null values out of the database (not sure how they're getting in there)
//                             let datedWhen = new Date(
//                                 whenWhere.when
//                             ).toISOString();
//                             return bookingWhenDated.includes(datedWhen);
//                         }
//                     }
//                 );
//                 // whenWhereFiltered = whenWhereFiltered.sort((a, b) =>
//                 //     sortDates(a, b)
//                 // );
//                 let existsInWhere =
//                     whenWhereFiltered
//                         .map((item) => {
//                             return new Date(item.when).toISOString();
//                         })
//                         .indexOf(whenBooking) > -1
//                         ? true
//                         : false;

//                 //whenWhereFiltered.filter(e => e);
//                 //filter out null or empty values -- I think they must be coming from deleting booking dates
//                 let temp = [];
//                 for (let i of whenWhereFiltered) i && temp.push(i); // copy each non-empty value to the 'temp' array
//                 whenWhereFiltered = temp;

//                 if (existsInWhere) {
//                     //console.log("bookingWhenWhere already has " + whenBooking);
//                 } else {
//                     //if new, add when and last where to the updatedField object
//                     writeToState = true;
//                     updatedField = updatedField.concat(
//                         whenWhereFiltered
//                             .concat([
//                                 //{ when: whenBooking, where: null },
//                                 {
//                                     when: whenBooking,
//                                     where:
//                                         whenWhereFiltered.length > 0
//                                             ? whenWhereFiltered[
//                                                   whenWhereFiltered.length - 1
//                                               ].where
//                                             : '',
//                                     updated: new Date(),
//                                 },
//                             ])
//                             .sort((a, b) => sortDates(a, b))
//                     );
//                 }
//             });
//             if (bookingWhenWhere.length > bookingWhen.length) {
//                 writeToState = true;
//                 updatedField = whenWhereFiltered;
//             }
//             if (writeToState) {
//                 setFormData({
//                     ...formData,
//                     ['bookingWhenWhere']: updatedField,
//                 });
//             }
//         } else {
//             setFormData({ ...formData, ['bookingWhenWhere']: [] });
//         }
//     }, [bookingWhen]);

//     const onCalendarChange = (target) => {
//         changesMade.current = true;
//         let targetValue = target.value;
//         let targetValueDated = targetValue.map((date) => {
//             return new Date(date).toISOString();
//         });

//         setFormData({ ...formData, [target.name]: targetValueDated });
//     };

//     const handleAddMultiTextField = (targetName, theFieldObj) => {
//         //super helpful: https://goshacmd.com/array-form-inputs/
//         let updatedField = theFieldObj.concat([{}]);
//         if (targetName === 'travelingCompanions') {
//             let updatedField = theFieldObj.concat([
//                 { name: '', role: '', email: '' },
//             ]);
//         }
//         setFormData({ ...formData, [targetName]: updatedField });
//     };
//     const handleRemoveMultiTextField = (targetName, theFieldObj, idx) => {
//         let updatedField = theFieldObj.filter((s, _idx) => _idx !== idx);
//         setFormData({ ...formData, [targetName]: updatedField });
//     };

//     const onMultiTextChange = (theFieldKey, theFieldObj, idx, e) => {
//         changesMade.current = true;
//         //console.log(e.target.value);
//         let targetValue = e.target.value;
//         targetValue = e.target.value;
//         let updatedField = theFieldObj.map((fieldObj, tFidx) => {
//             if (idx !== tFidx) return fieldObj;
//             return { ...fieldObj, [theFieldKey]: e.target.value }; //updates travelingCompanion[tFidx].name
//         });
//         setFormData({ ...formData, [e.target.name]: updatedField });
//     };

//     // const uploadSquareButtonRef = useRef();
//     // const clickSquareUpload = () => {
//     // 	uploadSquareButtonRef.current.click();
//     // };

//     // const uploadWideButtonRef = useRef();
//     // const clickWideUpload = () => {
//     // 	uploadWideButtonRef.current.click();
//     // };

//     // const uploadHandler = (e) => {
//     // 	changesMade.current = true;
//     // 	console.log("theArtist._id: "+theArtist._id)
//     // 	//const uploadPath = `/api/uploads/${slug}/`; //"../porchlight-uploads";
//     // 	const uploadPath = `/api/uploads/${theArtist._id}/`; //"../porchlight-uploads";
//     // 	let fileName = e.target.files[0].name;
//     // 	let fileExtension = e.target.files[0].type.replace(/(.*)\//g, '');
//     // 	let targetValue = uploadPath + fileName; //e.target.value;
//     // 	const data = new FormData();
//     // 	data.append('file', e.target.files[0]);
//     // 	axios
//     // 		.post(`/api/uploads/upload`, data)
//     // 		.then((res) => {
//     // 			setFormData({ ...formData, [e.target.name]: targetValue });
//     // 			console.log('Should dispatch IMAGE_UPLOAD with: ' + res.data);
//     // 			dispatch({
//     // 				type: IMAGE_UPLOAD,
//     // 				payload: res.data,
//     // 			});
//     // 			dispatch(setAlert(res.data.msg, 'success'));
//     // 			if (e.target.name == 'squareImg') {
//     // 				updateUserAvatar({ avatar: targetValue }, history);
//     // 			}
//     // 		})
//     // 		.catch((err) => {
//     // 			console.log(err.response.data.msg);
//     // 			dispatch({
//     // 				type: IMAGE_UPLOAD,
//     // 				payload: err.response.data,
//     // 			});
//     // 			dispatch(setAlert(err.response.data.msg, 'danger'));
//     // 		});
//     // };

//     //const [changesMade, setChangesMade] = useState(false);
//     const changesMade = useRef(false);
//     const firstLoad = useRef(true);

//     const onSubmit = (e) => {
//         e.preventDefault();
//         //console.log('Submitting...');
//         createMyArtist(formData, history, true);
//         changesMade.current = false;
//     };

//     const [open, setOpen] = useState(true);

//     const formGroups = {
//         bookingWhen: [
//             <FormLabel component="legend">
//                 Please select the dates (and then locations) you’d like to try
//                 to play a show:
//             </FormLabel>,
//             [
//                 // bookingWhen && bookingWhen.length > 0
//                 // 	? bookingWhen.map((whenBooking, idx) => (
//                 // 		handleAddMultiInput('bookingWhenWhere',bookingWhenWhere, whenBooking)
//                 // 	  ))
//                 // 	: '',
//                 bookingWhenWhere && bookingWhenWhere.length > 0
//                     ? bookingWhenWhere
//                           .filter((e) => e)
//                           .map(
//                               (
//                                   whenBooking,
//                                   idx,
//                                   whenWhereOrig //.filter(e => e) to remove any null values
//                               ) => (
//                                   <Grid
//                                       className="whenBooking"
//                                       key={`whenBooking${idx}`}
//                                       container
//                                       direction="row"
//                                       justifyContent="space-around"
//                                       alignItems="start"
//                                       spacing={2}
//                                       sx={{
//                                           // borderColor: 'primary.dark',
//                                           // borderWidth: '2px',
//                                           // borderStyle: 'solid',
//                                           backgroundColor: 'rgba(0,0,0,0.15)',
//                                           '&:hover': {},
//                                           border:
//                                               whenBooking.when ===
//                                               bookingWhen[
//                                                   bookingWhen.length - 1
//                                               ]
//                                                   ? `1px var(--link-color) solid`
//                                                   : `1px var(--light-color) solid`,
//                                           padding: '0 10px 10px',
//                                           margin: '0px auto',
//                                           width: '100%',
//                                       }}
//                                   >
//                                       {/* <Grid item xs={12} md={3}>
// 									<TextField
// 										variant='standard'
// 										name='bookingWhenWhere'
// 										id={`bookingWhenWhere${idx}`}
// 										label={
// 											"On "+bookingWhen[idx]+" I’d like to play in "
// 										}
// 										value={bookingWhenWhere[idx].when || ''}
// 										onChange={(e) =>
// 											onMultiTextChange('when', bookingWhenWhere, idx, e)
// 										}
// 										sx={{ width: '100%' }}
// 									/>
// 								</Grid> */}
//                                       <Grid item xs={12} md={12}>
//                                           <Autocomplete
//                                               id="bookingWhenWhere"
//                                               //value={whenBooking && whenBooking.where || whenWhereOrig[idx-1] && whenWhereOrig[idx-1].where || null}
//                                               value={
//                                                   (whenBooking &&
//                                                       whenBooking.where) ||
//                                                   null
//                                               }
//                                               options={hosts}
//                                               disableClearable
//                                               groupBy={(option) =>
//                                                   option.fullState
//                                               }
//                                               getOptionLabel={(option) =>
//                                                   option.city +
//                                                       ', ' +
//                                                       option.state || ''
//                                               }
//                                               //getOptionSelected={(option, value) => option.city === value.city}
//                                               isOptionEqualToValue={(
//                                                   option,
//                                                   value
//                                               ) =>
//                                                   option.city === value.city &&
//                                                   option.state === value.state
//                                               }
//                                               onChange={(e, value) => {
//                                                   onMultiAutocompleteTagChange(
//                                                       'where',
//                                                       'bookingWhenWhere',
//                                                       bookingWhenWhere,
//                                                       idx,
//                                                       e,
//                                                       value
//                                                   );
//                                               }}
//                                               renderTags={(
//                                                   value,
//                                                   getTagProps
//                                               ) =>
//                                                   value.map((option, index) => (
//                                                       <Chip
//                                                           variant="outlined"
//                                                           name="bookingWhenWhere"
//                                                           label={
//                                                               option.city +
//                                                               ', ' +
//                                                               option.state
//                                                           }
//                                                           {...getTagProps({
//                                                               index,
//                                                           })}
//                                                       />
//                                                   ))
//                                               }
//                                               renderInput={(params) => (
//                                                   <TextField
//                                                       {...params}
//                                                       sx={{ width: '100%' }}
//                                                       variant="standard"
//                                                       label={`On ${moment(
//                                                           whenBooking.when
//                                                       ).format(
//                                                           'll'
//                                                       )}, I’d love to play in or around`}
//                                                       name="bookingWhenWhere"
//                                                   />
//                                               )}
//                                           />
//                                       </Grid>
//                                   </Grid>
//                               )
//                           )
//                     : '',
//                 // <MultipleDatesPicker
//                 //     id="bookingWhen"
//                 //     name="bookingWhen"
//                 //     open={true}
//                 //     selectedDates={bookingWhen}
//                 //     value={bookingWhen}
//                 //     onCancel={() => setOpen(false)}
//                 //     //onSubmit={dates => console.log('selected dates', dates)}
//                 //     onChange={(target) => onCalendarChange(target)}
//                 // />,
//                 <DateCalendar
//                     id="bookingWhen"
//                     name="bookingWhen"
//                     open={true}
//                     selectedDates={bookingWhen}
//                     value={bookingWhen}
//                     onCancel={() => setOpen(false)}
//                     //onSubmit={dates => console.log('selected dates', dates)}
//                     onChange={(target) => onCalendarChange(target)}
//                 />,
//             ],
//         ],
//         tourVibe: [
//             <FormLabel component="legend">
//                 We want to make sure you and the host are on the same page about
//                 what to expect concerning who the audience is. How would you
//                 describe your ideal audience?
//             </FormLabel>,
//             [
//                 <Grid item xs={12} sx={{ width: '100%' }}>
//                     <Autocomplete
//                         multiple
//                         id="tourVibe"
//                         value={tourVibe}
//                         options={[]}
//                         freeSolo
//                         clearOnBlur={true}
//                         onChange={(event, value) =>
//                             onAutocompleteTagChange(event, 'tourVibe', value)
//                         }
//                         renderTags={(value, getTagProps) =>
//                             value.map((option, index) => (
//                                 <Chip
//                                     variant="outlined"
//                                     name="tourVibe"
//                                     label={option}
//                                     {...getTagProps({ index })}
//                                 />
//                             ))
//                         }
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 sx={{ width: '100%' }}
//                                 variant="standard"
//                                 label={
//                                     'I’m most comfortable performing for an audience who is '
//                                 }
//                                 name="tourVibe"
//                                 helperText="Type and press [enter] to add adjectives to the list"
//                             />
//                         )}
//                     />
//                     {/* <TextField
// 						variant='standard'
// 						name='tourVibe'
// 						multiline
// 						id='tourVibe'
// 						label='I’m most comfortable performing for an audience who is '
// 						placeholder='[plural noun]'
// 						value={tourVibe}
// 						onChange={(e) => onChange(e)}
// 						helperText='are my audience.'
// 						InputLabelProps={{ shrink: true }}
// 					/> */}
//                 </Grid>,
//             ],
//         ],
//         merchTable: [
//             <FormLabel component="legend">
//                 Will you need the host to provide a merch table?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="merchTable"
//                         value={merchTable}
//                         name="merchTable"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="true"
//                             control={<Radio />}
//                             label="Yes"
//                         />
//                         <FormControlLabel
//                             value="false"
//                             control={<Radio />}
//                             label="No"
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         promotionApproval: [
//             <FormLabel component="legend">
//                 Do you approve Porchlight to use video, photo, and audio
//                 captured, for promotional purposes?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="promotionApproval"
//                         value={promotionApproval}
//                         name="promotionApproval"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="yes"
//                             control={<Radio />}
//                             label="Yes"
//                         />
//                         <FormControlLabel
//                             value="no"
//                             control={<Radio />}
//                             label="No"
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         openers: [
//             <FormLabel component="legend">
//                 Let’s talk openers. What’s your preference?
//             </FormLabel>,
//             [
//                 <RadioGroup
//                     id="openers"
//                     value={openers}
//                     name="openers"
//                     onChange={(e) => onChange(e)}
//                 >
//                     <FormControlLabel
//                         value="I plan on travelling with an opener."
//                         control={<Radio />}
//                         label="I plan on travelling with an opener."
//                     />
//                     <FormControlLabel
//                         value="I'd like Porchlight Hosts to invite local openers."
//                         control={<Radio />}
//                         label="I'd like Porchlight Hosts to invite local openers."
//                     />
//                     <FormControlLabel
//                         value="I'd prefer a solo set."
//                         control={<Radio />}
//                         label="I'd prefer a solo set."
//                     />
//                     <FormControlLabel
//                         value="I have no preference."
//                         control={<Radio />}
//                         label="I have no preference."
//                     />
//                 </RadioGroup>,
//             ],
//         ],
//         costStructure: [
//             <FormLabel component="legend">
//                 What cost structure would you prefer?
//                 <br />
//                 <small>
//                     *We currently offer very few guaranteed shows, for bands
//                     selected at our discretion.
//                 </small>
//             </FormLabel>,
//             [
//                 <Grid item>
//                     <RadioGroup
//                         id="costStructure"
//                         value={costStructure}
//                         name="costStructure"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="ticket"
//                             control={<Radio />}
//                             label="Ticketed"
//                         />
//                         <FormControlLabel
//                             value="donation"
//                             control={<Radio />}
//                             label="Free RSVP, with a suggested donation"
//                         />
//                     </RadioGroup>
//                 </Grid>,
//             ],
//         ],
//         namedPrice: [
//             <FormLabel component="legend">Name your price.</FormLabel>,
//             [
//                 <Grid item>
//                     <TextField
//                         variant="standard"
//                         name="namedPrice"
//                         id="namedPrice"
//                         label={
//                             costStructure == 'donation'
//                                 ? "I'd suggest a donation of"
//                                 : 'Tickets should cost'
//                         }
//                         value={namedPrice}
//                         onChange={(e) => onChange(e)}
//                         type="number"
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     $
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                 </Grid>,
//             ],
//         ],
//         payoutPlatform: [
//             <FormLabel component="legend">
//                 For show payout, what is the email address associated with your
//                 Paypal account?
//             </FormLabel>,
//             <Grid
//                 container
//                 direction="row"
//                 justifyContent="center"
//                 alignItems="center"
//                 spacing={2}
//             >
//                 {/* <Grid item>
// 					<FormControl
// 						variant='outlined'
// 						sx={{ minWidth: 160, m: '8px 8px 8px 0' }}
// 					>
// 						<InputLabel id='payoutPlatformLabel'>I prefer using</InputLabel>
// 						<Select
// 							//variant="standard"
// 							labelId='payoutPlatformLabel'
// 							id='payoutPlatform'
// 							name='payoutPlatform'
// 							value={payoutPlatform}
// 							onChange={(e) => onChange(e)}
// 							label='I prefer using'
// 						>
// 							<MenuItem value='PayPal'>PayPal</MenuItem>
// 							<MenuItem value='Venmo'>Venmo</MenuItem>
// 							<MenuItem value='Zelle'>Zelle</MenuItem>
// 							<MenuItem value='Cash App'>Cash App</MenuItem>
// 						</Select>
// 					</FormControl>
// 				</Grid> */}
//                 <Grid item>
//                     <TextField
//                         variant="standard"
//                         sx={{ width: 420, maxWidth: '90vw', m: '0 0 0 0' }}
//                         name="payoutHandle"
//                         id="payoutHandle"
//                         label={
//                             'The handle for my ' +
//                             payoutPlatform +
//                             ' account is'
//                         }
//                         value={payoutHandle}
//                         onChange={(e) => onChange(e)}
//                         helperText=""
//                     />
//                 </Grid>
//             </Grid>,
//         ],
//         familyFriendly: [
//             <FormLabel component="legend">
//                 Would these shows be family-friendly?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="familyFriendly"
//                         value={familyFriendly}
//                         name="familyFriendly"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="true"
//                             control={<Radio />}
//                             label="Yes"
//                         />
//                         <FormControlLabel
//                             value="false"
//                             control={<Radio />}
//                             label="No"
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         alcohol: [
//             <FormLabel component="legend">
//                 Would you be comfortable if there was alcohol at the show?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="alcohol"
//                         value={alcohol}
//                         name="alcohol"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="true"
//                             control={<Radio />}
//                             label="Yes"
//                         />
//                         <FormControlLabel
//                             value="false"
//                             control={<Radio />}
//                             label="No"
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         soundSystem: [
//             <FormLabel component="legend">
//                 Are you bringing your own sound system for these shows?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="soundSystem"
//                         value={soundSystem}
//                         name="soundSystem"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="yes"
//                             control={<Radio />}
//                             label="Yes"
//                         />
//                         <FormControlLabel
//                             value="noButNeed"
//                             control={<Radio />}
//                             label="No, but I will need one."
//                         />
//                         <FormControlLabel
//                             value="no"
//                             control={<Radio />}
//                             label={`No, ${stageName} can play an acoustic show if it makes sense for the size of the space.`}
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         financialHopes: [
//             <FormLabel component="legend">
//                 What are your financial expectations and/or hopes for this show
//                 or tour?
//             </FormLabel>,
//             [
//                 // <Grid item>
//                 // 	<TextField
//                 // 		variant='standard'
//                 // 		name='financialHopes'
//                 // 		multiline
//                 // 		id='financialHopes'
//                 // 		label='What are your financial expectations and/or hopes for this show or tour?'
//                 // 		value={financialHopes}
//                 // 		onChange={(e) => onChange(e)}
//                 // 	/>
//                 // </Grid>,
//                 <Grid item>
//                     <TextField
//                         variant="standard"
//                         name="financialHopes"
//                         id="financialHopes"
//                         label={`It would be hard for me to make less than`}
//                         value={financialHopes}
//                         onChange={(e) => onChange(e)}
//                         type="number"
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     $
//                                 </InputAdornment>
//                             ),
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     {' '}
//                                     per show
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                 </Grid>,
//             ],
//         ],
//         fanActions: [
//             <FormLabel component="legend">
//                 What are the top ONE or TWO actions you’d like to see new fans
//                 make?
//             </FormLabel>,
//             [
//                 <Grid item xs={12} sx={{ width: '100%' }}>
//                     <Autocomplete
//                         multiple
//                         id="fanActions"
//                         value={fanActions}
//                         options={[]}
//                         freeSolo
//                         onChange={(event, value) =>
//                             onAutocompleteTagChange(event, 'fanActions', value)
//                         }
//                         renderTags={(value, getTagProps) =>
//                             value.map((option, index) => (
//                                 <Chip
//                                     variant="outlined"
//                                     name="fanActions"
//                                     label={option}
//                                     {...getTagProps({ index })}
//                                 />
//                             ))
//                         }
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 sx={{ width: '100%' }}
//                                 variant="standard"
//                                 label={`New fans of ${stageName} should `}
//                                 name="fanActions"
//                             />
//                         )}
//                     />
//                 </Grid>,
//             ],
//         ],
//         // agreeToPayAdminFee: [
//         //     <FormLabel component="legend">
//         //         Porchlight requests 20% of gross ticket sales, tips, and merch
//         //         sales (unless other terms have been agreed to in writing). Do
//         //         you agree to pay this fee upon completion of the show/tour?
//         //     </FormLabel>,
//         //     [
//         //         <FormControl component="fieldset">
//         //             <RadioGroup
//         //                 id="agreeToPayAdminFee"
//         //                 value={agreeToPayAdminFee}
//         //                 name="agreeToPayAdminFee"
//         //                 onChange={(e) => onChange(e)}
//         //             >
//         //                 <FormControlLabel
//         //                     value="true"
//         //                     control={<Radio />}
//         //                     label="Yes"
//         //                 />
//         //                 <FormControlLabel
//         //                     value="false"
//         //                     control={<Radio />}
//         //                     label="I'd like to discuss this further."
//         //                 />
//         //             </RadioGroup>
//         //         </FormControl>,
//         //         <FormLabel component="small">
//         //             *We collect this fee so that we can cover our costs of
//         //             managing and growing the Porchlight network. If we
//         //             experience a surplus at the end of the year, we are
//         //             committed (and personally gratified) to invest it back into
//         //             the Porchlight network in the form of an artist fund which
//         //             we will use for sponsored recording projects, micro
//         //             songwriter retreats, artist grants, and other artist
//         //             support.
//         //         </FormLabel>,
//         //     ],
//         // ],
//         agreeToPromote: [
//             <FormLabel component="legend">
//                 Do you agree to promote each show to your audience, including
//                 email sends and social media?
//             </FormLabel>,
//             [
//                 <FormControl component="fieldset">
//                     <RadioGroup
//                         id="agreeToPromote"
//                         value={agreeToPromote}
//                         name="agreeToPromote"
//                         onChange={(e) => onChange(e)}
//                     >
//                         <FormControlLabel
//                             value="true"
//                             control={<Radio />}
//                             label="Yes, to the best of my ability."
//                         />
//                         <FormControlLabel
//                             value="false"
//                             control={<Radio />}
//                             label="No, I'm not willing to commit to that."
//                         />
//                     </RadioGroup>
//                 </FormControl>,
//             ],
//         ],
//         travelingCompanions: [
//             <FormLabel component="legend">
//                 Will anybody be travelling with you?
//             </FormLabel>,
//             [
//                 travelingCompanions && travelingCompanions.length > 0
//                     ? travelingCompanions.map((travelingCompanion, idx) => (
//                           <Grid
//                               className="travelingCompanion"
//                               key={`travelingCompanion${idx}`}
//                               container
//                               direction="row"
//                               justifyContent="space-around"
//                               alignItems="start"
//                               spacing={2}
//                               sx={{
//                                   // borderColor: 'primary.dark',
//                                   // borderWidth: '2px',
//                                   // borderStyle: 'solid',
//                                   backgroundColor: 'rgba(0,0,0,0.15)',
//                                   '&:hover': {},
//                                   padding: '0 10px 10px',
//                                   margin: '0px auto',
//                                   width: '100%',
//                               }}
//                           >
//                               <Grid item xs={12} md={3}>
//                                   <TextField
//                                       variant="standard"
//                                       name="travelingCompanions"
//                                       id={`travelingCompanionName${idx}`}
//                                       label={
//                                           travelingCompanions.length > 1
//                                               ? `One of their names is`
//                                               : `The person's name is`
//                                       }
//                                       value={travelingCompanion.name}
//                                       onChange={(e) =>
//                                           onMultiTextChange(
//                                               'name',
//                                               travelingCompanions,
//                                               idx,
//                                               e
//                                           )
//                                       }
//                                       sx={{ width: '100%' }}
//                                   />
//                               </Grid>
//                               <Grid item xs={12} md={2}>
//                                   <TextField
//                                       variant="standard"
//                                       name="travelingCompanions"
//                                       id={`travelingCompanionRole${idx}`}
//                                       label={
//                                           travelingCompanion.name
//                                               ? `${
//                                                     travelingCompanion.name.split(
//                                                         ' '
//                                                     )[0]
//                                                 }'s role is`
//                                               : `Their role is`
//                                       }
//                                       value={travelingCompanion.role}
//                                       onChange={(e) =>
//                                           onMultiTextChange(
//                                               'role',
//                                               travelingCompanions,
//                                               idx,
//                                               e
//                                           )
//                                       }
//                                       sx={{ width: '100%' }}
//                                   />
//                               </Grid>
//                               <Grid item xs={10} md={true}>
//                                   <TextField
//                                       variant="standard"
//                                       name="travelingCompanions"
//                                       id={`travelingCompanionEmail${idx}`}
//                                       label={
//                                           travelingCompanion.name
//                                               ? `${
//                                                     travelingCompanion.name.split(
//                                                         ' '
//                                                     )[0]
//                                                 }'s email is`
//                                               : `Their email is`
//                                       }
//                                       value={travelingCompanion.email}
//                                       onChange={(e) =>
//                                           onMultiTextChange(
//                                               'email',
//                                               travelingCompanions,
//                                               idx,
//                                               e
//                                           )
//                                       }
//                                       sx={{ width: '100%' }}
//                                   />
//                               </Grid>
//                               <Grid item xs={2} md={0.65}>
//                                   <IconButton
//                                       onClick={(e) =>
//                                           handleRemoveMultiTextField(
//                                               'travelingCompanions',
//                                               travelingCompanions,
//                                               idx
//                                           )
//                                       }
//                                       size="large"
//                                   >
//                                       <DeleteIcon />
//                                   </IconButton>
//                               </Grid>
//                           </Grid>
//                       ))
//                     : '',
//                 <Grid
//                     container
//                     item
//                     direction="row"
//                     justifyContent="center"
//                     alignItems="center"
//                     xs={12}
//                 >
//                     <Button
//                         onClick={(e) =>
//                             handleAddMultiTextField(
//                                 'travelingCompanions',
//                                 travelingCompanions
//                             )
//                         }
//                     >
//                         <PersonAddIcon />
//                         Add person
//                     </Button>
//                 </Grid>,
//             ],
//         ],
//         overnight: [
//             <FormLabel component="legend">
//                 Would you like for your host to arrange for you{' '}
//                 {travelingCompanions.length > 0
//                     ? ' and your traveling companions '
//                     : ''}{' '}
//                 to stay overnight?
//                 <br />
//                 <small>
//                     (60% of Porchlight Hosts are interested in putting up
//                     musicians overnight!)
//                 </small>
//             </FormLabel>,
//             [
//                 <Grid item>
//                     <FormControl component="fieldset">
//                         <RadioGroup
//                             id="overnight"
//                             value={overnight}
//                             name="overnight"
//                             onChange={(e) => onChange(e)}
//                         >
//                             <FormControlLabel
//                                 value="1"
//                                 control={<Radio />}
//                                 label="Yes, for 1 person, please."
//                             />
//                             {travelingCompanions &&
//                             travelingCompanions.length > 0
//                                 ? travelingCompanions.map(
//                                       (travelingCompanion, idx) => (
//                                           <FormControlLabel
//                                               key={idx}
//                                               value={idx + 2}
//                                               control={<Radio />}
//                                               label={
//                                                   'Yes, for ' +
//                                                   (idx + 2) +
//                                                   ' people, please.'
//                                               }
//                                           />
//                                       )
//                                   )
//                                 : ''}
//                             <FormControlLabel
//                                 value="0"
//                                 control={<Radio />}
//                                 label="No, thank you."
//                             />
//                         </RadioGroup>
//                     </FormControl>
//                 </Grid>,
//             ],
//         ],
//         hangout: [
//             [
//                 // <Grid
//                 // 	container
//                 // 	item
//                 // 	justifyContent='center'
//                 // 	alignItems='center'
//                 // 	spacing={2}
//                 // 	sx={{
//                 // 		borderColor: 'primary.dark',
//                 // 		borderWidth: '2px',
//                 // 		borderStyle: 'solid',
//                 // 		backgroundColor: 'rgba(0,0,0,0.15)',
//                 // 		'&:hover': {},
//                 // 		padding: '0 10px 10px',
//                 // 		margin: '0px auto',
//                 // 		width: '100%',
//                 // 	}}
//                 // >
//                 // 	<FormLabel
//                 // 		component='p'
//                 // 		className='small'
//                 // 		sx={{
//                 // 			textAlign: 'left!important',
//                 // 			width: '100%',
//                 // 			fontSize: '1rem!important',
//                 // 			lineHeight: '1.3em!important',
//                 // 			padding: '8px 16px',
//                 // 		}}
//                 // 	>
//                 // 		Our heart at Porchlight is to cultivate relationships between
//                 // 		artists and hosts. As such, we’d love to make time for a little
//                 // 		hangout either before or after the show, just for you, your hosts,
//                 // 		and maybe a couple people interested in meeting with artists like
//                 // 		you in a more informal setting.
//                 // 	</FormLabel>
//                 // </Grid>,

//                 <Grid item xs={12}>
//                     <FormLabel component="legend" sx={{}}>
//                         The heart of Porchlight is to cultivate relationships
//                         between artists and hosts. Are you open to spending some
//                         informal time with your hosts?
//                     </FormLabel>
//                 </Grid>,
//             ],
//             [
//                 <Grid item>
//                     <FormControl component="fieldset">
//                         <RadioGroup
//                             id="hangout"
//                             value={hangout}
//                             name="hangout"
//                             onChange={(e) => onChange(e)}
//                         >
//                             <FormControlLabel
//                                 value="I'd rather not."
//                                 control={<Radio />}
//                                 label="I'd rather not."
//                             />
//                             <FormControlLabel
//                                 value="That sounds great! I prefer a private hangout AFTER the show."
//                                 control={<Radio />}
//                                 label="That sounds great! I prefer a private hangout AFTER the show."
//                             />
//                             <FormControlLabel
//                                 value="That sounds great! I prefer a private hangout BEFORE the show."
//                                 control={<Radio />}
//                                 label="That sounds great! I prefer a private hangout BEFORE the show."
//                             />
//                             <FormControlLabel
//                                 value="That sounds great! Either before or after works for me."
//                                 control={<Radio />}
//                                 label="That sounds great! Either before or after works for me."
//                             />
//                         </RadioGroup>
//                     </FormControl>
//                 </Grid>,
//             ],
//         ],
//         allergies: [
//             <FormLabel component="legend">
//                 Please list any food allergies, pet allergies, or special needs
//                 you have.
//             </FormLabel>,
//             [
//                 <Grid item xs={12} sx={{ width: '100%' }}>
//                     <Autocomplete
//                         multiple
//                         id="allergies"
//                         value={allergies}
//                         options={[]}
//                         freeSolo
//                         onChange={(event, value) =>
//                             onAutocompleteTagChange(event, 'allergies', value)
//                         }
//                         renderTags={(value, getTagProps) =>
//                             value.map((option, index) => (
//                                 <Chip
//                                     variant="outlined"
//                                     name="allergies"
//                                     label={option}
//                                     {...getTagProps({ index })}
//                                 />
//                             ))
//                         }
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 sx={{ width: '100%' }}
//                                 variant="standard"
//                                 label="I'm allergic to "
//                                 name="allergies"
//                             />
//                         )}
//                     />
//                 </Grid>,
//             ],
//         ],

//         showSchedule: [
//             <FormLabel component="legend">
//                 {/* Schedules often get shifted by hosts or artists, but it’s really helpful
// 				to have a “proposed schedule” and tweak from there. Please edit the
// 				times below to best represent the schedule you propose. */}
//                 If you would like to propose a different show schedule, please
//                 edit our standard timeline below.
//             </FormLabel>,
//             [
//                 <Grid item>
//                     {stageName} will need to start setting up at
//                     <TextField
//                         variant="standard"
//                         id="setupTime"
//                         //label='Alarm clock'
//                         type="time"
//                         name="showSchedule.setupTime"
//                         value={showSchedule.setupTime || ''}
//                         onChange={(e) => onChange(e)}
//                         inputProps={{
//                             step: 900, // 15 min
//                         }}
//                         sx={{ padding: '0 8px' }}
//                     />{' '}
//                     to have “doors open” at
//                     <TextField
//                         variant="standard"
//                         id="doorsOpen"
//                         //label='Alarm clock'
//                         type="time"
//                         name="showSchedule.doorsOpen"
//                         value={showSchedule.doorsOpen || ''}
//                         onChange={(e) => onChange(e)}
//                         inputProps={{
//                             step: 900, // 15 min
//                         }}
//                         sx={{ padding: '0 8px' }}
//                     />
//                     for the show starting at
//                     <TextField
//                         variant="standard"
//                         id="startTime"
//                         //label='Alarm clock'
//                         type="time"
//                         name="showSchedule.startTime"
//                         value={showSchedule.startTime || ''}
//                         onChange={(e) => onChange(e)}
//                         inputProps={{
//                             step: 900, // 15 min
//                         }}
//                         sx={{ padding: '0 0 0 8px' }}
//                     />
//                     with a hard wrap at about{' '}
//                     <TextField
//                         variant="standard"
//                         id="hardWrap"
//                         //label='Alarm clock'
//                         type="time"
//                         name="showSchedule.hardWrap"
//                         value={showSchedule.hardWrap || ''}
//                         onChange={(e) => onChange(e)}
//                         inputProps={{
//                             step: 900, // 15 min
//                         }}
//                         sx={{ padding: '0 0 0 8px' }}
//                     />
//                     .
//                 </Grid>,
//             ],
//         ],
//         covidPrefs: [
//             <FormLabel component="legend">
//                 Beyond host preferences and local guidelines, do you have
//                 particular Covid concerns you’d like these events to adhere to?
//             </FormLabel>,
//             <Grid item xs={12} sx={{ width: '100%' }}>
//                 <Autocomplete
//                     id="covidPrefs"
//                     multiple
//                     disableCloseOnSelect
//                     value={covidPrefs}
//                     options={[
//                         'the host determining what is best',
//                         'everyone passing a fever check',
//                         'everyone presenting a negative Covid test',
//                         'everyone presenting a vaccination passport',
//                         'everyone social distancing',
//                         'everyone wearing masks',
//                         'everything being outdoors',
//                     ]}
//                     onChange={(event, value) =>
//                         onAutocompleteTagChange(event, 'covidPrefs', value)
//                     }
//                     renderTags={(value, getTagProps) =>
//                         value.map((option, index) => (
//                             <Chip
//                                 variant="outlined"
//                                 name="covidPrefs"
//                                 label={option}
//                                 {...getTagProps({ index })}
//                             />
//                         ))
//                     }
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             sx={{ width: '100%' }}
//                             variant="standard"
//                             label={`I would feel most comfortable with`}
//                             name="covidPrefs"
//                         />
//                     )}
//                 />
//             </Grid>,
//             {
//                 /* <TextField
// 				name='covidPrefs'
// 				id='covidPrefs'
// 				label='Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?'
// 				value={covidPrefs}
// 				onChange={(e) => onChange(e)}
// 			/>, */
//             },
//         ],
//         artistNotes: [
//             <FormLabel component="legend">
//                 Do you have any final thoughts, questions, notes, or
//                 clarifications for us? Feel free to list them below.
//             </FormLabel>,
//             <Grid item xs={12} sx={{ width: '100%' }}>
//                 <TextField
//                     variant="standard"
//                     name="artistNotes"
//                     multiline
//                     id="artistNotes"
//                     label="Artist Notes"
//                     value={artistNotes}
//                     onChange={(e) => onChange(e)}
//                     sx={{ width: '100%' }}
//                 />
//             </Grid>,
//         ],
//         endSlide: [
//             [
//                 <Typography component="h2" sx={{ textAlign: 'center' }}>
//                     That's everything we need to get you started booking shows!
//                 </Typography>,
//                 <Typography
//                     component="p"
//                     sx={{ textAlign: 'center', marginTop: '20px' }}
//                 >
//                     Thank you for taking the time to fill out all of this
//                     information! Please check your profile to be sure everything
//                     is correct.
//                 </Typography>,
//             ],
//             [
//                 slug && (
//                     <Grid
//                         item
//                         sx={{
//                             margin: '8px auto',
//                         }}
//                     >
//                         <Link to={'/artists/' + slug}>
//                             <Button btnwidth="300" className="">
//                                 <AccountBoxTwoToneIcon /> View My Profile
//                             </Button>
//                         </Link>
//                     </Grid>
//                 ),
//             ],
//         ],
//     };

//     let query = useQuery();
//     const queryEditField = query.get('field');
//     let formStartIndex = 0;

//     if (queryEditField) {
//         const formGroupKeys = Object.keys(formGroups);
//         formStartIndex =
//             formGroupKeys.indexOf(queryEditField) > -1
//                 ? formGroupKeys.indexOf(queryEditField)
//                 : 0;
//     }

//     //// CARD INDEX ///////
//     const [formCardIndex, setIndex] = useState(formStartIndex);

//     const cardIndex = formCardIndex;

//     const [formCardDirection, setDirection] = useState(1);
//     const transitions = useTransition(formCardIndex, {
//         key: formCardIndex,
//         initial: null,
//         from: {
//             opacity: 0,
//             transform: `translateX(${formCardDirection * 60}vw)`,
//         },
//         enter: { opacity: 1, transform: 'translateX(0%)' },
//         leave: {
//             opacity: 0,
//             transform: `translateX(${formCardDirection * -60}vw)`,
//         },
//         // config: config.molasses,
//         config: { mass: 2, tension: 280, friction: 60 },
//         // onRest: (_a, _b, item) => {
//         //   if (formCardIndex === item) {
//         //     set(cardIndex => (cardIndex + 1) % formGroups.length)
//         //   }
//         // },
//         exitBeforeEnter: false,
//     });
//     const nextCard = (e) => {
//         setDirection(1);
//         setIndex(
//             (cardIndex) => (cardIndex + 1) % Object.keys(formGroups).length
//         );
//         if (changesMade.current) {
//             onSubmit(e);
//         }
//     };
//     const previousCard = (e) => {
//         setDirection(-1);
//         setIndex((cardIndex) => {
//             if (cardIndex == 0) {
//                 cardIndex = Object.keys(formGroups).length;
//             }
//             //console.log(cardIndex);
//             return cardIndex - 1;
//         });
//         if (changesMade.current) {
//             onSubmit(e);
//         }
//     };

//     return (
//         <Fragment>
//             <form className="form" onSubmit={(e) => onSubmit(e)}>
//                 <Grid container sx={{ padding: '20px!important' }}>
//                     <Grid
//                         container
//                         item
//                         sx={{ width: '100%' }}
//                         direction="row"
//                         justifyContent="center"
//                         alignItems="center"
//                     >
//                         <Grid item>
//                             {/* { cardIndex > 0 ? (  */}
//                             <Button
//                                 variant="contained"
//                                 component="span"
//                                 onClick={(e) => previousCard(e)}
//                             >
//                                 <ArrowBackIcon></ArrowBackIcon>Previous
//                             </Button>
//                             {/* ) : '' } */}
//                         </Grid>
//                         <Grid item>
//                             <label htmlFor="submit">
//                                 <input id="submit" type="submit" hidden />
//                                 <Button
//                                     variant="contained"
//                                     component="span"
//                                     onClick={(e) => onSubmit(e)}
//                                 >
//                                     Save <SaveTwoToneIcon></SaveTwoToneIcon>
//                                 </Button>
//                             </label>
//                         </Grid>
//                         <Grid item>
//                             {/* { cardIndex < formGroups.length - 1 ? ( */}
//                             <Button
//                                 variant="contained"
//                                 component="span"
//                                 onClick={(e) => nextCard(e)}
//                             >
//                                 Next<ArrowForwardIcon></ArrowForwardIcon>
//                             </Button>
//                             {/* ) : ''} */}
//                         </Grid>
//                     </Grid>
//                 </Grid>
//                 {transitions((style, i) => (
//                     <animated.div
//                         className={'animatedFormGroup'}
//                         key={'animatedFormGroup' + i}
//                         style={{
//                             ...style,
//                         }}
//                     >
//                         <div className="form-group" key={'form-group' + i}>
//                             <Grid
//                                 container
//                                 direction="column"
//                                 justifyContent="center"
//                                 alignItems="center"
//                                 //spacing={2}
//                                 sx={{
//                                     width: '100%',
//                                     margin: '0 auto',
//                                 }}
//                             >
//                                 {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}> */}

//                                 {/* {formGroups && formGroups.length > 0 ? formGroups[i].map((formGroup, ind) => (  */}
//                                 <Grid
//                                     item
//                                     xs={12}
//                                     sx={{ '--form-num': `'${i + 1}'` }}
//                                     data-form-num={i + 1}
//                                     className="formInquiry"
//                                 >
//                                     {formGroups[Object.keys(formGroups)[i]][0]}
//                                 </Grid>
//                                 {formGroups[Object.keys(formGroups)[i]][1]}
//                             </Grid>
//                         </div>
//                     </animated.div>
//                 ))}
//                 {/* <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//           <BottomNavigation
//             showLabels
//           >
//             <BottomNavigationAction label="Previous" onClick={() => previousCard()} icon={<ArrowBackIcon />} />
//             <BottomNavigationAction label="Save" onClick={(e) => onSubmit(e)} icon={<SaveIcon />} />
//             <BottomNavigationAction label="Next" onClick={() => nextCard()} icon={<ArrowForwardIcon />} />
//           </BottomNavigation>
//         </Paper> */}
//             </form>
//         </Fragment>
//     );
// };

// EditArtistBookingForm.propTypes = {
//     getHostsLocations: PropTypes.func.isRequired,
//     hosts: PropTypes.array.isRequired,
//     createMyArtist: PropTypes.func.isRequired,
//     theArtist: PropTypes.object,
//     auth: PropTypes.object.isRequired,
//     updateUserAvatar: PropTypes.func.isRequired,
// };

// const mapStateToProps = (state) => ({
//     auth: state.auth,
//     hosts: state.host.hosts,
// });

// export default connect(mapStateToProps, {
//     getHostsLocations,
//     createMyArtist,
//     updateUserAvatar,
//     // })(withRouter(EditArtistBookingForm)); //withRouter allows us to pass history objects
// })(EditArtistBookingForm); //withRouter allows us to pass history objects
