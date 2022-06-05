import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { createMyArtist, getArtists } from '../../actions/artist';
import { updateUserAvatar } from '../../actions/auth';
import { toTitleCase } from '../../actions/app';
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
    withStyles,
    Typography,
} from '@mui/material';
import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

import { getFontAwesomeIcon, pullDomainFrom } from '../../actions/app';
import moment from 'moment';
import ReactPlayer from 'react-player/lazy';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

const UploadInput = styled('input')({
    display: 'none',
});

let artistsGenre = [];
let artistsGenresFiltered = [];
let artistsGenresCounts = {};

const EditArtistProfileForm = ({
    theArtist, //passed in from EditMyArtistProfile.js
    //theArtist: { loading },
    artist: { artists },
    createMyArtist,
    getArtists,
    history,
    auth,
    updateUserAvatar,
}) => {
    useEffect(() => {
        getArtists();
    }, []);

    useEffect(() => {
        //genre autocomplete list
        if (artists) {
            artistsGenre = [];
            artistsGenresCounts = {};

            artists.map((eachArtist) => {
                if (eachArtist.genres) {
                    //console.log('eachArtist.genres', eachArtist.genres);
                    eachArtist.genres.map((genre) => {
                        let genreCapitalized = toTitleCase(genre.trim());
                        artistsGenre.push(genreCapitalized);
                    });
                    // artistsGenre = artistsGenre.concat(eachArtist.genres);
                }
            });
            console.log('artistsGenre', artistsGenre);

            artistsGenresFiltered = [...new Set([...artistsGenre])];
            artistsGenresFiltered.sort();
            //console.log(artistsGenresFiltered);

            artistsGenre.forEach((x) => {
                artistsGenresCounts[x] = (artistsGenresCounts[x] || 0) + 1;
            });
            //console.log(artistsGenresCounts);
        }
    }, [artists]);

    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        slug: '',
        email: '',
        firstName: '',
        lastName: '',
        stageName: '',
        genres: [],
        soundsLike: [],
        medium: '',
        repLinks: [],
        repLink: '',
        socialLinks: [],
        streamingLinks: [],
        helpKind: '',
        // typeformDate: '',
        // active: '',
        phone: '',
        hometown: '',
        streetAddress: '',
        city: '',
        state: '',
        zip: '',
        promotionApproval: '',
        artistWebsite: '',
        artistStatementVideo: '',
        livePerformanceVideo: '',
        costStructure: '',
        namedPrice: '',
        payoutPlatform: 'PayPal',
        payoutHandle: '',
        tourVibe: '',
        bookingWhen: [],
        bookingWhenWhere: [],
        setLength: '',
        schedule: '',
        showSchedule: {
            setupTime: '17:45',
            startTime: '19:00',
            doorsOpen: '18:30',
            hardWrap: '21:00',
            flexible: true,
        },
        overnight: '',
        openers: '',
        travelingCompanions: [],
        //companionTravelers: '',
        hangout: '',
        merchTable: false,
        allergies: [],
        familyFriendly: false,
        soundSystem: '',
        agreeToPayAdminFee: true,
        agreeToPromote: false,
        wideImg: '',
        squareImg: '',
        covidPrefs: [],
        artistNotes: '',
        financialHopes: '',
        fanActions: [],
        // onboardDate: '',
        bio: '',
        artistUpdated: new Date(),
    });

    useEffect(() => {
        if (theArtist) {
            setFormData({
                slug: loading || !theArtist.slug ? '' : theArtist.slug,
                email: loading || !theArtist.email ? '' : theArtist.email,
                firstName:
                    loading || !theArtist.firstName ? '' : theArtist.firstName,
                lastName:
                    loading || !theArtist.lastName ? '' : theArtist.lastName,
                stageName:
                    loading || !theArtist.stageName ? '' : theArtist.stageName,
                medium: loading || !theArtist.medium ? '' : theArtist.medium,
                genres: loading || !theArtist.genres ? [] : theArtist.genres,
                soundsLike:
                    loading || !theArtist.soundsLike
                        ? []
                        : theArtist.soundsLike,
                repLinks:
                    loading || !theArtist.repLinks ? [] : theArtist.repLinks,
                repLink: loading || !theArtist.repLink ? '' : theArtist.repLink,
                socialLinks:
                    loading || !theArtist.socialLinks
                        ? []
                        : theArtist.socialLinks,
                streamingLinks:
                    loading || !theArtist.streamingLinks
                        ? []
                        : theArtist.streamingLinks,
                helpKind:
                    loading || !theArtist.helpKind ? '' : theArtist.helpKind,
                // typeformDate: loading || !theArtist.typeformDate ? '' : theArtist.typeformDate,
                // active: loading || (theArtist.active == null) ? false : theArtist.active,
                phone: loading || !theArtist.phone ? '' : theArtist.phone,
                hometown:
                    loading || !theArtist.hometown ? '' : theArtist.hometown,
                streetAddress:
                    loading || !theArtist.streetAddress
                        ? ''
                        : theArtist.streetAddress,
                city: loading || !theArtist.city ? '' : theArtist.city,
                state: loading || !theArtist.state ? '' : theArtist.state,
                zip: loading || !theArtist.zip ? '' : theArtist.zip,
                promotionApproval:
                    loading || !theArtist.promotionApproval
                        ? ''
                        : theArtist.promotionApproval,
                artistWebsite:
                    loading || !theArtist.artistWebsite
                        ? ''
                        : theArtist.artistWebsite,
                artistStatementVideo:
                    loading || !theArtist.artistStatementVideo
                        ? ''
                        : theArtist.artistStatementVideo,
                livePerformanceVideo:
                    loading || !theArtist.livePerformanceVideo
                        ? ''
                        : theArtist.livePerformanceVideo,
                costStructure:
                    loading || !theArtist.costStructure
                        ? ''
                        : theArtist.costStructure,
                namedPrice:
                    loading || !theArtist.namedPrice
                        ? ''
                        : theArtist.namedPrice,
                payoutPlatform:
                    loading || !theArtist.payoutPlatform
                        ? 'PayPal'
                        : theArtist.payoutPlatform,
                payoutHandle:
                    loading || !theArtist.payoutHandle
                        ? ''
                        : theArtist.payoutHandle,
                tourVibe:
                    loading || !theArtist.tourVibe ? '' : theArtist.tourVibe,
                bookingWhen:
                    loading || !theArtist.bookingWhen
                        ? []
                        : theArtist.bookingWhen,
                bookingWhenWhere:
                    loading || !theArtist.bookingWhenWhere
                        ? []
                        : theArtist.bookingWhenWhere,
                setLength:
                    loading || !theArtist.setLength ? '' : theArtist.setLength,
                schedule:
                    loading || !theArtist.schedule ? '' : theArtist.schedule,
                showSchedule:
                    loading || !theArtist.showSchedule
                        ? {
                              setupTime: '17:45',
                              startTime: '19:00',
                              doorsOpen: '18:30',
                              hardWrap: '21:00',
                              flexible: true,
                          }
                        : theArtist.showSchedule,
                overnight:
                    loading || !theArtist.overnight ? '' : theArtist.overnight,
                openers: loading || !theArtist.openers ? '' : theArtist.openers,
                travelingCompanions:
                    loading || theArtist.travelingCompanions == null
                        ? []
                        : theArtist.travelingCompanions,
                // companionTravelers:
                //     loading || theArtist.companionTravelers == null
                //         ? false
                //         : theArtist.companionTravelers,
                hangout:
                    loading || theArtist.hangout == null
                        ? false
                        : theArtist.hangout,
                merchTable:
                    loading || theArtist.merchTable == null
                        ? false
                        : theArtist.merchTable,
                allergies:
                    loading || !theArtist.allergies ? [] : theArtist.allergies,
                familyFriendly:
                    loading || theArtist.familyFriendly == null
                        ? false
                        : theArtist.familyFriendly,
                soundSystem:
                    loading || !theArtist.soundSystem
                        ? ''
                        : theArtist.soundSystem,
                agreeToPayAdminFee:
                    loading || theArtist.agreeToPayAdminFee == null
                        ? true
                        : theArtist.agreeToPayAdminFee,
                agreeToPromote:
                    loading || theArtist.agreeToPromote == null
                        ? false
                        : theArtist.agreeToPromote,
                wideImg: loading || !theArtist.wideImg ? '' : theArtist.wideImg,
                squareImg:
                    loading || !theArtist.squareImg ? '' : theArtist.squareImg,
                covidPrefs:
                    loading || !theArtist.covidPrefs
                        ? []
                        : theArtist.covidPrefs,
                artistNotes:
                    loading || !theArtist.artistNotes
                        ? ''
                        : theArtist.artistNotes,
                financialHopes:
                    loading || !theArtist.financialHopes
                        ? ''
                        : theArtist.financialHopes,
                fanActions:
                    loading || !theArtist.fanActions
                        ? []
                        : theArtist.fanActions,
                // onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
                bio: loading || !theArtist.bio ? '' : theArtist.bio,
                artistUpdated: new Date(),
            });
        } else {
            if (!auth.loading) {
                console.log(
                    'An artist profile couldn’t be found for: ' +
                        auth.user.email +
                        '. No worries! We’ll make one!'
                );
                setFormData({
                    email: auth.user.email,
                    slug: '',
                    firstName: auth.user.name.split(' ')[0],
                    lastName: auth.user.name.split(' ')[1],
                    stageName: '',
                    genres: [],
                    soundsLike: [],
                    medium: '',
                    repLinks: [],
                    repLink: '',
                    socialLinks: [],
                    streamingLinks: [],
                    helpKind: '',
                    // typeformDate: '',
                    // active: '',
                    phone: '',
                    hometown: '',
                    streetAddress: '',
                    city: '',
                    state: '',
                    zip: '',
                    promotionApproval: '',
                    artistWebsite: '',
                    artistStatementVideo: '',
                    livePerformanceVideo: '',
                    costStructure: '',
                    namedPrice: '',
                    payoutPlatform: 'PayPal',
                    payoutHandle: '',
                    tourVibe: '',
                    bookingWhen: [],
                    bookingWhenWhere: [],
                    setLength: '',
                    schedule: '',
                    showSchedule: {
                        setupTime: '17:45',
                        startTime: '19:00',
                        doorsOpen: '18:30',
                        hardWrap: '21:00',
                        flexible: true,
                    },
                    overnight: '',
                    openers: '',
                    travelingCompanions: [],
                    //companionTravelers: '',
                    hangout: '',
                    merchTable: false,
                    allergies: [],
                    familyFriendly: false,
                    soundSystem: '',
                    agreeToPayAdminFee: true,
                    agreeToPromote: false,
                    wideImg: '',
                    squareImg: '',
                    covidPrefs: [],
                    artistNotes: '',
                    financialHopes: '',
                    fanActions: [],
                    // onboardDate: '',
                    bio: '',
                });
            }
        }
    }, [auth.loading, createMyArtist, theArtist]);

    const {
        slug,
        email,
        firstName,
        lastName,
        stageName,
        medium,
        genres,
        soundsLike,
        repLinks,
        repLink,
        socialLinks,
        streamingLinks,
        helpKind,
        // typeformDate,
        // active,
        phone,
        hometown,
        streetAddress,
        city,
        state,
        zip,
        promotionApproval,
        artistWebsite,
        artistStatementVideo,
        livePerformanceVideo,
        costStructure,
        payoutPlatform,
        payoutHandle,
        tourVibe,
        namedPrice,
        bookingWhen,
        bookingWhenWhere,
        setLength,
        schedule,
        showSchedule,
        overnight,
        openers,
        travelingCompanions,
        //companionTravelers,
        hangout,
        merchTable,
        allergies,
        familyFriendly,
        soundSystem,
        agreeToPayAdminFee,
        agreeToPromote,
        wideImg,
        squareImg,
        covidPrefs,
        artistNotes,
        financialHopes,
        fanActions,
        // onboardDate,
        bio,
    } = formData;

    const onChange = (e) => {
        //console.log(e);
        //console.log(Object.keys(formGroups).length);
        changesMade.current = true;
        let targetValue = e.target.value;
        switch (e.target.type) {
            case 'checkbox':
                targetValue = e.target.checked;
                break;
            default:
                targetValue = e.target.value;
        }
        const targetName = e.target.name.split('.');
        //console.log(targetName + ': ' + targetValue);
        //setFormData({ ...formData, [e.target.name]: targetValue });
        if (targetName.length === 1) {
            setFormData({ ...formData, [targetName[0]]: targetValue });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [targetName[0]]: {
                    ...prevData[targetName[0]],
                    [targetName[1]]: targetValue,
                },
            }));
            //console.log(formData);
        }
    };
    const onPhoneChange = (theFieldName, val) => {
        changesMade.current = true;
        let targetValue = val;
        setFormData({ ...formData, [theFieldName]: targetValue });
    };
    const onAutocompleteTagChange = (e, theFieldName, val) => {
        //console.log(theFieldName);
        //console.log(Object.keys(formGroups).length);
        changesMade.current = true;
        let targetValue = val;
        if (theFieldName === 'genres') {
            let theArtistGenres = [];
            val.map((genre) => {
                let genreCapitalized = toTitleCase(genre.trim());
                theArtistGenres.push(genreCapitalized);
            });
            targetValue = theArtistGenres;
        }
        setFormData({ ...formData, [theFieldName]: targetValue });
    };
    //onAutocompleteTagChange(event, 'allergies', value)
    //onMultiTextChange('email', travelingCompanions, idx, e)
    const onMultiAutocompleteTagChange = (
        theFieldKey,
        theFieldName,
        theFieldObj,
        idx,
        e,
        value
    ) => {
        changesMade.current = true;
        let targetValue = value;
        let updatedField = theFieldObj.map((fieldObj, tFidx) => {
            if (idx !== tFidx) return fieldObj;
            return { ...fieldObj, [theFieldKey]: targetValue }; //updates travelingCompanion[tFidx].name
        });
        // dispatch({
        // 	type: UPDATE_ARTIST_ME,
        // 	payload: { ...formData, [theFieldName]: updatedField },
        // });
        setFormData({ ...formData, [theFieldName]: updatedField });
    };

    useEffect(() => {
        if (changesMade.current) {
            createMyArtist(formData, history, true);
            changesMade.current = false;
        }
    }, [bookingWhenWhere, squareImg, wideImg]);

    useEffect(() => {
        if (bookingWhen && bookingWhen.length > 0) {
            let writeToState = false;
            let updatedField = [];
            let whenWhereFiltered = [];
            let bookingWhenDated = bookingWhen.map((messyDate) => {
                return new Date(messyDate).toISOString();
            });
            bookingWhenDated.forEach((whenBooking, idx) => {
                //return an object trim out of bookingWhenWhere any whens that aren't in bookingWhen
                whenWhereFiltered = Object.filter(
                    bookingWhenWhere,
                    (whenWhere) => {
                        //https://stackoverflow.com/a/37616104/3338608
                        if (whenWhere) {
                            //occasionally I get null values out of the database (not sure how they're getting in there)
                            let datedWhen = new Date(
                                whenWhere.when
                            ).toISOString();
                            return bookingWhenDated.includes(datedWhen);
                        }
                    }
                );
                let existsInWhere =
                    whenWhereFiltered
                        .map((item) => {
                            return new Date(item.when).toISOString();
                        })
                        .indexOf(whenBooking) > -1
                        ? true
                        : false;

                //whenWhereFiltered.filter(e => e);
                //filter out null or empty values -- I think they must be coming from deleting booking dates
                let temp = [];
                for (let i of whenWhereFiltered) i && temp.push(i); // copy each non-empty value to the 'temp' array
                whenWhereFiltered = temp;

                if (existsInWhere) {
                    //console.log("bookingWhenWhere already has " + whenBooking);
                } else {
                    //if new when to the object
                    writeToState = true;
                    updatedField = updatedField.concat(
                        whenWhereFiltered.concat([
                            { when: whenBooking, where: null },
                        ])
                    );
                }
            });
            if (bookingWhenWhere.length > bookingWhen.length) {
                writeToState = true;
                updatedField = whenWhereFiltered;
            }
            if (writeToState) {
                setFormData({
                    ...formData,
                    ['bookingWhenWhere']: updatedField,
                });
            }
        } else {
            setFormData({ ...formData, ['bookingWhenWhere']: [] });
        }
    }, [bookingWhen]);

    const onCalendarChange = (target) => {
        changesMade.current = true;
        let targetValue = target.value;
        let targetValueDated = targetValue.map((date) => {
            return new Date(date).toISOString();
        });

        setFormData({ ...formData, [target.name]: targetValueDated });
    };

    const handleAddMultiTextField = (targetName, theFieldObj) => {
        //super helpful: https://goshacmd.com/array-form-inputs/
        let updatedField = theFieldObj.concat([{}]);
        if (targetName === 'travelingCompanions') {
            let updatedField = theFieldObj.concat([
                { name: '', role: '', email: '' },
            ]);
        }
        setFormData({ ...formData, [targetName]: updatedField });
    };
    const handleRemoveMultiTextField = (targetName, theFieldObj, idx) => {
        let updatedField = theFieldObj.filter((s, _idx) => _idx !== idx);
        setFormData({ ...formData, [targetName]: updatedField });
    };

    const onMultiTextChange = (theFieldKey, theFieldObj, idx, e) => {
        changesMade.current = true;
        //console.log(e.target.value);
        let targetValue = e.target.value;
        targetValue = e.target.value;
        let updatedField = theFieldObj.map((fieldObj, tFidx) => {
            if (idx !== tFidx) return fieldObj;
            return { ...fieldObj, [theFieldKey]: e.target.value }; //updates travelingCompanion[tFidx].name
        });
        setFormData({ ...formData, [e.target.name]: updatedField });
    };

    // const uploadSquareButtonRef = useRef();
    // const clickSquareUpload = () => {
    //     uploadSquareButtonRef.current.click();
    // };

    // const uploadWideButtonRef = useRef();
    // const clickWideUpload = () => {
    //     uploadWideButtonRef.current.click();
    // };

    // const uploadHandler = (e) => {
    //     changesMade.current = true;
    //     console.log('theArtist._id: ' + theArtist._id);
    //     //const uploadPath = `/api/uploads/${slug}/`; //"../porchlight-uploads";
    //     const uploadPath = `/api/uploads/${theArtist._id}/`; //"../porchlight-uploads";
    //     let fileName = e.target.files[0].name;
    //     let fileExtension = e.target.files[0].type.replace(/(.*)\//g, '');
    //     let targetValue = uploadPath + fileName; //e.target.value;
    //     const data = new FormData();
    //     data.append('file', e.target.files[0]);
    //     axios
    //         .post(`/api/uploads/upload`, data)
    //         .then((res) => {
    //             setFormData({ ...formData, [e.target.name]: targetValue });
    //             console.log('Should dispatch IMAGE_UPLOAD with: ' + res.data);
    //             dispatch({
    //                 type: IMAGE_UPLOAD,
    //                 payload: res.data,
    //             });
    //             dispatch(setAlert(res.data.msg, 'success'));
    //             if (e.target.name == 'squareImg') {
    //                 updateUserAvatar({ avatar: targetValue }, history);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err.response.data.msg);
    //             dispatch({
    //                 type: IMAGE_UPLOAD,
    //                 payload: err.response.data,
    //             });
    //             dispatch(setAlert(err.response.data.msg, 'danger'));
    //         });
    // };

    const cloudinaryUpload = async (fieldName, tags, artistID, preset) => {
        let imageRatio =
            fieldName === 'squareImg'
                ? 'a square image'
                : 'a wide image with a 2:1 ratio';

        const stringToSign = {
            public_id: 'uploads/' + artistID + '/' + fieldName,
            uploadPreset: preset,
            tags: tags,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...stringToSign,
        };
        const response = await axios.post(
            `/api/cloudinary/upload-signature`,
            config
        );
        const data = response.data;

        window.cloudinary.openUploadWidget(
            //added cloudinary script to /public/index.html
            {
                ...stringToSign,
                // uploadPreset: stringtoSign.uploadPreset,
                // public_id: stringtoSign.public_id,
                //public_id: 'uploads/' + artistID + '/' + fieldName,
                // tags: stringtoSign.tags,
                apiKey: '622466913451276', //data.apikey,
                uploadSignatureTimestamp: data.timestamp,
                uploadSignature: data.signature,

                cloudName: 'porchlight',
                clientAllowedFormats: 'image',
                sources: [
                    'local',
                    'url',
                    'camera',
                    'google_drive',
                    'facebook',
                    'dropbox',
                    'instagram',
                ],
                googleApiKey: '<image_search_google_api_key>',
                showAdvancedOptions: true,
                //cropping: true,
                multiple: false,
                defaultSource: 'local',
                text: {
                    en: {
                        menu: {
                            files: 'My Device',
                        },
                        local: {
                            browse: 'Browse',
                            dd_title_single:
                                'Drag and Drop ' + imageRatio + ' here',
                            dd_title_multi: 'Drag and Drop assets here',
                            drop_title_single:
                                'Drop ' + imageRatio + ' to upload',
                            drop_title_multiple: 'Drop files to upload',
                        },
                    },
                },
                styles: {
                    palette: {
                        // window: '#100F0E',
                        // sourceBg: '#384847',
                        // windowBorder: '#8BADAA',
                        tabIcon: '#7a9492',
                        inactiveTabIcon: '#4D5553',
                        //menuIcons: '#FFA14E',
                        link: '#FFA14E',
                        action: '#FFA14E',
                        inProgress: '#FFA14E',
                        complete: '#7A9492',
                        error: '#c43737',
                        textDark: '#000000',
                        textLight: '#FFFFD9',
                    },
                    frame: {
                        background: '#100f0eaa',
                    },
                    fonts: {
                        default: null,
                        "'Merriweather', serif": {
                            url: 'https://fonts.googleapis.com/css?family=Merriweather',
                            active: true,
                        },
                    },
                },
            },
            (err, info) => {
                if (!err) {
                    if (info.event === 'success') {
                        //console.log('info: ', info.info);
                        changesMade.current = true;
                        setFormData({
                            ...formData,
                            [fieldName]: info.info.secure_url,
                        });
                        dispatch({
                            type: IMAGE_UPLOAD,
                            payload: info.info.secure_url,
                        });
                        dispatch(
                            setAlert(
                                info.info.original_filename +
                                    ' uploaded successfully.',
                                'success'
                            )
                        );
                        if (preset == 'porchlight_squareImg_upload') {
                            updateUserAvatar({ avatar: info.info.secure_url });
                        }

                        //addUploadToDB(preset, info);
                    }
                    //console.log('Upload Widget event - ', info);
                    return info;
                }
            }
        );
    };

    //const [changesMade, setChangesMade] = useState(false);
    const changesMade = useRef(false);
    const firstLoad = useRef(true);

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting...');
        createMyArtist(formData, history, true);
        changesMade.current = false;
    };

    const [open, setOpen] = useState(true);

    const formGroups = {
        firstName: [
            <FormLabel component="legend">
                First things first: what’s your first and last name?
            </FormLabel>,
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >
                <Grid item xs={12} sm={6} textAlign="center">
                    <TextField
                        variant="standard"
                        name="firstName"
                        id="firstName"
                        label="My first name is"
                        value={firstName}
                        onChange={(e) => onChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} textAlign="center">
                    <TextField
                        variant="standard"
                        name="lastName"
                        id="lastName"
                        label="and my last name is"
                        value={lastName}
                        onChange={(e) => onChange(e)}
                    />
                </Grid>
            </Grid>,
        ],
        medium: [
            <FormLabel component="legend">
                What kind of art do you make, {firstName}?
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <Autocomplete
                    id="medium"
                    value={medium}
                    disableClearable
                    options={[
                        'dances',
                        'films',
                        'jokes',
                        'music',
                        'spoken word poems',
                        'visual art',
                    ]}
                    onChange={(event, value) =>
                        onAutocompleteTagChange(event, 'medium', value)
                    }
                    // renderTags={(value, getTagProps) =>
                    //   value.map((option, index) => (
                    //     <Chip variant="outlined" name="medium" label={option} {...getTagProps({ index })} />
                    //   ))
                    // }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            variant="standard"
                            label={`I make `}
                            name="medium"
                        />
                    )}
                />
            </Grid>,
        ],
        stageName: [
            <FormLabel component="legend">
                What is your {medium == 'music' ? 'band' : 'stage'} name?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="stageName"
                        id="stageName"
                        label={`My ${
                            medium == 'music' ? 'band' : 'stage'
                        } name is`}
                        value={stageName}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        genres: [
            <FormLabel component="legend">
                What genres fit {stageName} best?
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <Autocomplete
                    multiple
                    id="genres"
                    value={genres}
                    options={artistsGenresFiltered}
                    getOptionLabel={(option) =>
                        option + ' (' + artistsGenresCounts[option] + ')' || ''
                    }
                    freeSolo
                    clearOnBlur={true}
                    filterSelectedOptions
                    onChange={(event, value) =>
                        onAutocompleteTagChange(event, 'genres', value)
                    }
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                name="genres"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            variant="standard"
                            label={`${stageName} is `}
                            name="genres"
                            helperText="Select genres or type a new one and press [enter] to add it."
                        />
                    )}
                />
            </Grid>,
        ],
        soundsLike: [
            <FormLabel component="legend">
                Who/what does {stageName} sound like?
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <Autocomplete
                    multiple
                    id="soundsLike"
                    value={soundsLike}
                    options={[]}
                    freeSolo
                    clearOnBlur={true}
                    onChange={(event, value) =>
                        onAutocompleteTagChange(event, 'soundsLike', value)
                    }
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                name="soundsLike"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            variant="standard"
                            label={`${stageName} sounds like `}
                            name="soundsLike"
                            helperText="Type and press [enter] to add items to the list"
                        />
                    )}
                />
            </Grid>,
        ],
        // <div className='form-group' num='4'>
        //   <TextField
        //     name="email"
        //     id="email"
        //     label="What's your email address?"
        //     value={email}
        //     onChange={(e) => onChange(e)}
        //     disabled
        //   />
        // </div>,
        city: [
            <FormLabel component="legend">
                Where is {stageName} located?
            </FormLabel>,
            [
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            name="streetAddress"
                            id="streetAddress"
                            label="At the street address of"
                            value={streetAddress}
                            onChange={(e) => onChange(e)}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                </Grid>,
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ marginTop: '8px' }}
                >
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="city"
                            id="city"
                            label="In the city of"
                            value={city}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="state"
                            id="state"
                            label="in the state of"
                            value={state}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="zip"
                            id="zip"
                            label="with the zip code"
                            value={zip}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                </Grid>,
            ],
        ],
        phone: [
            <FormLabel component="legend">
                Would you provide your phone number?
            </FormLabel>,
            [
                <Grid item>
                    <ReactPhoneInput
                        name="phone"
                        id="phone"
                        value={phone || ''}
                        onChange={(val) => onPhoneChange('phone', val)}
                        helperText=""
                        component={TextField}
                        inputExtraProps={{
                            name: 'phone',
                            variant: 'standard',
                            label: 'My phone number is',
                        }}
                        autoFormat={true}
                        defaultCountry={'us'}
                        onlyCountries={['us']}
                        disableCountryCode={true}
                        placeholder={''}
                    />
                </Grid>,
            ],
        ],
        artistWebsite: [
            <FormLabel component="legend">
                Does {stageName} have a website?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="artistWebsite"
                        id="artistWebsite"
                        label={`Yeah! The website is`}
                        value={artistWebsite}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        socialLinks: [
            <FormLabel component="legend">
                Would you supply any social media or streaming platform links
                for {stageName}?
                <br />
                <small>
                    (These will appear in your profile in the order you enter
                    them here.)
                </small>
            </FormLabel>,
            [
                socialLinks && Object.keys(socialLinks).length > 0
                    ? socialLinks.map((eachSocialLink, idx) => (
                          <Grid
                              className="eachSocialLink"
                              key={`eachSocialLink${idx}`}
                              container
                              direction="row"
                              justifyContent="space-around"
                              alignItems="end"
                              spacing={2}
                              sx={{
                                  // borderColor: 'primary.dark',
                                  // borderWidth: '2px',
                                  // borderStyle: 'solid',
                                  backgroundColor: 'rgba(0,0,0,0.15)',
                                  '&:hover': {},
                                  padding: '0 10px 10px',
                                  margin: '0px auto',
                                  width: '100%',
                              }}
                          >
                              <Grid item xs={2} md={0.5} className="link-icon">
                                  {getFontAwesomeIcon(eachSocialLink.link)}
                              </Grid>
                              <Grid item xs={10}>
                                  <TextField
                                      variant="standard"
                                      name="socialLinks"
                                      id={`socialLinkLink${idx}`}
                                      label={
                                          idx > 0
                                              ? `and at `
                                              : `Yeah! Check out "${stageName}" at `
                                      }
                                      value={eachSocialLink.link}
                                      onChange={(e) =>
                                          onMultiTextChange(
                                              'link',
                                              socialLinks,
                                              idx,
                                              e
                                          )
                                      }
                                      sx={{ width: '100%' }}
                                  />
                              </Grid>
                              <Grid item xs={2} md={1}>
                                  <IconButton
                                      onClick={(e) =>
                                          handleRemoveMultiTextField(
                                              'socialLinks',
                                              socialLinks,
                                              idx
                                          )
                                      }
                                  >
                                      <DeleteIcon />
                                  </IconButton>
                              </Grid>
                          </Grid>
                      ))
                    : '',
                <Grid
                    container
                    item
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={12}
                >
                    <Button
                        onClick={(e) =>
                            handleAddMultiTextField('socialLinks', socialLinks)
                        }
                    >
                        <PersonAddIcon />
                        Add link
                    </Button>
                </Grid>,
            ],
        ],
        // streamingLinks: [
        //     <FormLabel component="legend">
        //         And links to where folks can stream {stageName}’s {medium}?
        //         <br />
        //         <small>
        //             (These will appear in your profile in the order you enter
        //             them here.)
        //         </small>
        //     </FormLabel>,
        //     [
        //         streamingLinks && Object.keys(streamingLinks).length > 0
        //             ? streamingLinks.map((eachStreamingLink, idx) => (
        //                   <Grid
        //                       className="eachStreamingLink"
        //                       key={`eachStreamingLink${idx}`}
        //                       container
        //                       direction="row"
        //                       justifyContent="space-around"
        //                       alignItems="end"
        //                       spacing={2}
        //                       sx={{
        //                           // borderColor: 'primary.dark',
        //                           // borderWidth: '2px',
        //                           // borderStyle: 'solid',
        //                           backgroundColor: 'rgba(0,0,0,0.15)',
        //                           '&:hover': {},
        //                           padding: '0 10px 10px',
        //                           margin: '0px auto',
        //                           width: '100%',
        //                       }}
        //                   >
        //                       <Grid item xs={2} md={0.5} className="link-icon">
        //                           {getFontAwesomeIcon(eachStreamingLink.link)}
        //                       </Grid>
        //                       <Grid item xs={10}>
        //                           <TextField
        //                               variant="standard"
        //                               name="streamingLinks"
        //                               id={`socialLinkLink${idx}`}
        //                               label={
        //                                   idx > 0
        //                                       ? `and at `
        //                                       : `Yeah! Check out "${stageName}" at `
        //                               }
        //                               value={eachStreamingLink.link}
        //                               onChange={(e) =>
        //                                   onMultiTextChange(
        //                                       'link',
        //                                       streamingLinks,
        //                                       idx,
        //                                       e
        //                                   )
        //                               }
        //                               sx={{ width: '100%' }}
        //                           />
        //                       </Grid>
        //                       <Grid item xs={2} md={1}>
        //                           <IconButton
        //                               onClick={(e) =>
        //                                   handleRemoveMultiTextField(
        //                                       'streamingLinks',
        //                                       streamingLinks,
        //                                       idx
        //                                   )
        //                               }
        //                           >
        //                               <DeleteIcon />
        //                           </IconButton>
        //                       </Grid>
        //                   </Grid>
        //               ))
        //             : '',
        //         <Grid
        //             container
        //             item
        //             direction="row"
        //             justifyContent="center"
        //             alignItems="center"
        //             xs={12}
        //         >
        //             <Button
        //                 onClick={(e) =>
        //                     handleAddMultiTextField(
        //                         'streamingLinks',
        //                         streamingLinks
        //                     )
        //                 }
        //             >
        //                 <PersonAddIcon />
        //                 Add link
        //             </Button>
        //         </Grid>,
        //     ],
        // ],
        squareImg: [
            <FormLabel component="legend">
                Please attach a square image, for promotional use on social
                media.
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    {/* <UploadInput
                        ref={uploadSquareButtonRef}
                        accept="image/*"
                        name="squareImg"
                        id="squareImg"
                        type="file"
                        onChange={(e) => uploadHandler(e)}
                    /> */}
                    <label htmlFor="squareImg">
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => {
                                cloudinaryUpload(
                                    'squareImg',
                                    [theArtist.stageName, 'squareImg'],
                                    theArtist._id,
                                    'porchlight_squareImg_upload'
                                );
                                //clickSquareUpload();
                            }}
                        >
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                            Upload
                        </Button>
                    </label>
                </FormControl>,
                squareImg ? (
                    <img
                        className="squareImg-image uploaded-image"
                        src={squareImg}
                        alt=""
                        style={{
                            marginTop: '16px',
                            maxHeight: '60vh',
                            maxWidth: '90vw',
                            height: 'auto',
                            width: 'auto',
                        }}
                    />
                ) : (
                    ''
                ),
            ],
        ],

        wideImg: [
            <FormLabel component="legend">
                Please attach one high quality image, for promotional use, of
                this size: 2160x1080px
                <br />
                If the pixel size is bugging you, just make sure the image is
                2:1 ratio, horizontal.
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    {/* <UploadInput
                        ref={uploadWideButtonRef}
                        accept="image/*"
                        name="wideImg"
                        id="wideImg"
                        type="file"
                        onChange={(e) => uploadHandler(e)}
                    /> */}
                    <label htmlFor="wideImg">
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => {
                                cloudinaryUpload(
                                    'wideImg',
                                    [theArtist.stageName, 'wideImg'],
                                    theArtist._id,
                                    'porchlight_wideImg_upload'
                                );
                                // clickWideUpload();
                            }}
                        >
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                            Upload
                        </Button>
                    </label>
                </FormControl>,
                wideImg ? (
                    <img
                        className="wideImg-image uploaded-image"
                        src={wideImg}
                        alt=""
                        style={{
                            marginTop: '16px',
                            maxHeight: '60vh',
                            maxWidth: '90vw',
                            height: 'auto',
                            width: 'auto',
                        }}
                    />
                ) : (
                    ''
                ),
            ],
        ],

        bio: [
            <FormLabel component="legend">
                Tell us about {stageName}. Who are you? What are you about?
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                    variant="standard"
                    name="bio"
                    multiline
                    id="bio"
                    label="Bio"
                    value={bio}
                    onChange={(e) => onChange(e)}
                    sx={{ width: '100%' }}
                />
            </Grid>,
        ],
        artistStatementVideo: [
            <FormLabel component="legend">
                Please record a short video introducing {stageName} and
                explaining what your{' '}
                {medium === 'music' || medium === 'visual art'
                    ? medium + ' is '
                    : medium + ' are '}{' '}
                about. This is your chance to introduce yourself to potential
                hosts who don’t know you yet. Be personable, and communicate
                your heart for your music, and why you want to play house shows.
                This can be a casual recording, speaking directly to the camera.
                Upload it to YouTube, and paste the link here. <br />
                <small>
                    (Looking for a link that resembles something like:
                    ‘https://www.youtube.com/watch?v=lEBBFsWtWDo’)
                </small>
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="artistStatementVideo"
                        id="artistStatementVideo"
                        label={`My artist statement video can be viewed at`}
                        value={artistStatementVideo}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
                artistStatementVideo ? (
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        sx={{ width: '100%', margin: '8px auto' }}
                    >
                        <ReactPlayer
                            light={
                                (new URL(artistStatementVideo).hostname !==
                                    'music.youtube.com' &&
                                    pullDomainFrom(artistStatementVideo) ===
                                        'youtube') ||
                                pullDomainFrom(artistStatementVideo) === 'youtu'
                            }
                            url={artistStatementVideo}
                        />
                    </Grid>
                ) : (
                    ''
                ),
            ],
        ],
        // repLinks: [
        // 	<FormLabel component='legend'>
        // 		Would you supply some links where we could experience your {medium}?
        // 	</FormLabel>,
        // 	[
        // 		repLinks && Object.keys(repLinks).length > 0
        // 			? repLinks.map((eachLink, idx) => (
        // 				<Grid
        // 					className='eachLink'
        // 					key={`eachLink${idx}`}
        // 					container
        // 					direction='row'
        // 					justifyContent='space-around'
        // 					alignItems='start'
        // 					spacing={2}
        // 					sx={{
        // 						// borderColor: 'primary.dark',
        // 						// borderWidth: '2px',
        // 						// borderStyle: 'solid',
        // 						backgroundColor: 'rgba(0,0,0,0.15)',
        // 						'&:hover': {},
        // 						padding: '0 10px 10px',
        // 						margin: '0px auto',
        // 						width: '100%',
        // 					}}
        // 				>
        // 					<Grid item xs={11}>
        // 						<TextField
        // 							variant='standard'
        // 							name='repLinks'
        // 							id={`repLinkLink${idx}`}
        // 							label={
        // 								idx > 0 ? `and at ` : `Yeah! Check out "${stageName}" at `
        // 							}
        // 							value={eachLink.link}
        // 							onChange={(e) =>
        // 								onMultiTextChange('link', repLinks, idx, e)
        // 							}
        // 							sx={{ width: '100%' }}
        // 						/>
        // 					</Grid>
        // 					<Grid item xs={2} md={0.65}>
        // 						<IconButton
        // 							onClick={(e) =>
        // 								handleRemoveMultiTextField('repLinks', repLinks, idx)
        // 							}
        // 						>
        // 							<DeleteIcon />
        // 						</IconButton>
        // 					</Grid>
        // 				</Grid>
        // 			))
        // 			: '',
        // 		<Grid
        // 			container
        // 			item
        // 			direction='row'
        // 			justifyContent='center'
        // 			alignItems='center'
        // 			xs={12}
        // 		>
        // 			<Button
        // 				onClick={(e) => handleAddMultiTextField('repLinks', repLinks)}
        // 			>
        // 				<PersonAddIcon />
        // 				Add link
        // 			</Button>
        // 		</Grid>,
        // 	],
        // ],
        repLink: [
            <FormLabel component="legend">
                Would you supply a SoundCloud or YouTube link where we could
                experience your {medium}?
                <br />
                <small>
                    {' '}
                    (A music player or video should show up underneath, if
                    you've entered the right kind of link)
                </small>
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="repLink"
                        id="repLink"
                        label={`Here’s where you can experience ${stageName}’s ${medium}:`}
                        value={repLink}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
                repLink ? (
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        sx={{ width: '100%', margin: '8px auto' }}
                    >
                        <ReactPlayer
                            light={
                                (new URL(repLink).hostname !==
                                    'music.youtube.com' &&
                                    pullDomainFrom(repLink) === 'youtube') ||
                                pullDomainFrom(repLink) === 'youtu'
                            }
                            url={repLink}
                        />
                    </Grid>
                ) : (
                    ''
                ),
            ],
        ],
        livePerformanceVideo: [
            <FormLabel component="legend">
                Do you have any video of {stageName} performing a house show or
                backyard concert?
                <br />
                <small>
                    (Looking for something like:
                    ‘https://www.youtube.com/watch?v=lEBBFsWtWDo’)
                </small>
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="livePerformanceVideo"
                        id="livePerformanceVideo"
                        label={`Here’s a video of ${stageName} performing live`}
                        value={livePerformanceVideo}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
                livePerformanceVideo ? (
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        sx={{ width: '100%', margin: '8px auto' }}
                    >
                        <ReactPlayer
                            light={
                                (new URL(livePerformanceVideo).hostname !==
                                    'music.youtube.com' &&
                                    pullDomainFrom(livePerformanceVideo) ===
                                        'youtube') ||
                                pullDomainFrom(livePerformanceVideo) === 'youtu'
                            }
                            url={livePerformanceVideo}
                        />
                    </Grid>
                ) : (
                    ''
                ),
            ],
        ],
        endSlide: [
            [
                <Typography component="h2" sx={{ textAlign: 'center' }}>
                    Those were all the questions we have for this section.
                </Typography>,
                <Typography
                    component="p"
                    sx={{ textAlign: 'center', marginTop: '20px' }}
                >
                    Thank you for taking the time to respond to them! Please
                    check your profile to be sure everything is correct.
                </Typography>,
            ],
            [
                slug && (
                    <Grid
                        item
                        sx={{
                            margin: '8px auto',
                        }}
                    >
                        <Link to={'/artists/' + slug}>
                            <Button btnwidth="300" className="">
                                <AccountBoxTwoToneIcon /> View My Profile
                            </Button>
                        </Link>
                    </Grid>
                ),
                theArtist.bookingWhen && theArtist.bookingWhen.length > 0 ? (
                    <Grid
                        item
                        sx={{
                            margin: '8px auto',
                        }}
                    >
                        <Link to="/edit-artist-booking">
                            <Button btnwidth="300" className="">
                                <DateRangeTwoToneIcon /> Edit My Booking Info
                            </Button>
                        </Link>
                    </Grid>
                ) : theArtist.active ? (
                    <Grid
                        item
                        sx={{
                            margin: '8px auto',
                        }}
                    >
                        <p> </p>
                        <Link to="/edit-artist-booking">
                            <Button className="">Start Booking Shows</Button>
                        </Link>
                    </Grid>
                ) : (
                    ''
                ),
            ],
        ],
    };

    let query = useQuery();
    const queryEditField = query.get('field');
    let formStartIndex = 0;

    if (queryEditField) {
        const formGroupKeys = Object.keys(formGroups);
        formStartIndex =
            formGroupKeys.indexOf(queryEditField) > -1
                ? formGroupKeys.indexOf(queryEditField)
                : 0;
    }

    //// CARD INDEX ///////
    const [formCardIndex, setIndex] = useState(formStartIndex);

    const cardIndex = formCardIndex;

    const [formCardDirection, setDirection] = useState(1);
    const transitions = useTransition(formCardIndex, {
        key: formCardIndex,
        initial: null,
        from: {
            opacity: 0,
            transform: `translateX(${formCardDirection * 60}vw)`,
        },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: {
            opacity: 0,
            transform: `translateX(${formCardDirection * -60}vw)`,
        },
        config: config.molasses,
        // onRest: (_a, _b, item) => {
        //   if (formCardIndex === item) {
        //     set(cardIndex => (cardIndex + 1) % formGroups.length)
        //   }
        // },
        exitBeforeEnter: false,
    });
    const nextCard = (e) => {
        setDirection(1);
        setIndex(
            (cardIndex) => (cardIndex + 1) % Object.keys(formGroups).length
        );
        if (changesMade.current) {
            onSubmit(e);
        }
    };
    const previousCard = (e) => {
        setDirection(-1);
        setIndex((cardIndex) => {
            if (cardIndex == 0) {
                cardIndex = Object.keys(formGroups).length;
            }
            //console.log(cardIndex);
            return cardIndex - 1;
        });
        if (changesMade.current) {
            onSubmit(e);
        }
    };

    return (
        <form className="form" onSubmit={(e) => onSubmit(e)}>
            <Grid container sx={{ padding: '20px!important' }}>
                <Grid
                    container
                    item
                    sx={{ width: '100%' }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        {/* { cardIndex > 0 ? (  */}
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => previousCard(e)}
                        >
                            <ArrowBackIcon></ArrowBackIcon>Previous
                        </Button>
                        {/* ) : '' } */}
                    </Grid>
                    <Grid item>
                        <label htmlFor="submit">
                            <input id="submit" type="submit" hidden />
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => onSubmit(e)}
                            >
                                Save <SaveTwoToneIcon></SaveTwoToneIcon>
                            </Button>
                        </label>
                    </Grid>
                    <Grid item>
                        {/* { cardIndex < formGroups.length - 1 ? ( */}
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => nextCard(e)}
                        >
                            Next<ArrowForwardIcon></ArrowForwardIcon>
                        </Button>
                        {/* ) : ''} */}
                    </Grid>
                </Grid>
            </Grid>
            {transitions((style, i) => (
                <animated.div
                    className={'animatedFormGroup'}
                    key={'animatedFormGroup' + i}
                    style={{
                        ...style,
                    }}
                >
                    <div
                        className="form-group"
                        key={'form-group' + i}
                        style={{ maxWidth: '100%' }}
                    >
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            //spacing={2}
                            sx={{
                                width: '100%',
                                margin: '0 auto',
                            }}
                        >
                            {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}> */}

                            {/* {formGroups && formGroups.length > 0 ? formGroups[i].map((formGroup, ind) => (  */}
                            <Grid
                                item
                                xs={12}
                                sx={{ '--form-num': `'${i + 1}'` }}
                                data-form-num={i + 1}
                                className="formInquiry"
                            >
                                {formGroups[Object.keys(formGroups)[i]][0]}
                            </Grid>
                            {formGroups[Object.keys(formGroups)[i]][1]}
                        </Grid>
                    </div>
                </animated.div>
            ))}
            {/* <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
          >
            <BottomNavigationAction label="Previous" onClick={() => previousCard()} icon={<ArrowBackIcon />} />
            <BottomNavigationAction label="Save" onClick={(e) => onSubmit(e)} icon={<SaveIcon />} />
            <BottomNavigationAction label="Next" onClick={() => nextCard()} icon={<ArrowForwardIcon />} />
          </BottomNavigation>
        </Paper> */}
        </form>
    );
};

EditArtistProfileForm.propTypes = {
    createMyArtist: PropTypes.func.isRequired,
    getArtists: PropTypes.func.isRequired,
    theArtist: PropTypes.object,
    auth: PropTypes.object.isRequired,
    artist: PropTypes.object.isRequired,
    updateUserAvatar: PropTypes.func.isRequired,
    //cloudinaryUpload: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    artist: state.artist,
});

export default connect(mapStateToProps, {
    createMyArtist,
    getArtists,
    updateUserAvatar,
})(withRouter(EditArtistProfileForm)); //withRouter allows us to pass history objects
