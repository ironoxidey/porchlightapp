import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';
import { updateUserAvatar } from '../../actions/auth';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Button from '../layout/SvgButton';

import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

const UploadInput = styled('input')({
  display: 'none',
});

const EditArtistForm = ({
  theArtist,
  //theArtist: { loading },
  createArtist,
  history,
  auth,
  updateUserAvatar
}) => {
  const loading = false; //a bunch of things are dependent on it; I should really just take it out.
  
  const [formData, setFormData] = useState({
    slug: '',
    email: '',
    firstName: '',
    lastName: '',
    stageName: '',
    genre: '',
    medium: '',
    repLink: '',
    helpKind: '',
    // typeformDate: '',
    // active: '',
    phone: '',
    hometown: '',
    city: '',
    state: '',
    zip: '',
    costStructure: '',
    namedPrice: '',
    payoutPlatform: 'PayPal',
    payoutHandle: '',
    bookingWhen: [],
    bookingWhenWhere: '',
    setLength: '',
    schedule: '',
    overnight: '',
    openers: '',
    travelingCompanions: [],
    companionTravelers: '',
    hangout: '',
    merchTable: false,
    allergies: '',
    allowKids: false,
    soundSystem: '',
    agreeToPayAdminFee: true,
    wideImg: '',
    squareImg: '',
    covidPrefs: '',
    artistNotes: '',
    financialHopes: '',
    // onboardDate: '',
    bio: '',
  });

  useEffect(() => {
    if (theArtist){
      setFormData({
        slug: loading || !theArtist.slug ? '' : theArtist.slug,
        email: loading || !theArtist.email ? '' : theArtist.email,
        firstName: loading || !theArtist.firstName ? '' : theArtist.firstName,
        lastName: loading || !theArtist.lastName ? '' : theArtist.lastName,
        stageName: loading || !theArtist.stageName ? '' : theArtist.stageName,
        medium: loading || !theArtist.medium ? '' : theArtist.medium,
        genre: loading || !theArtist.genre ? '' : theArtist.genre,
        repLink: loading || !theArtist.repLink ? '' : theArtist.repLink,
        helpKind: loading || !theArtist.helpKind ? '' : theArtist.helpKind,
        // typeformDate: loading || !theArtist.typeformDate ? '' : theArtist.typeformDate,
        // active: loading || (theArtist.active == null) ? false : theArtist.active,
        phone: loading || !theArtist.phone ? '' : theArtist.phone,
        hometown: loading || !theArtist.hometown ? '' : theArtist.hometown,
        city: loading || !theArtist.city ? '' : theArtist.city,
        state: loading || !theArtist.state ? '' : theArtist.state,
        zip: loading || !theArtist.zip ? '' : theArtist.zip,
        costStructure: loading || !theArtist.costStructure ? '' : theArtist.costStructure,
        namedPrice: loading || !theArtist.namedPrice ? '' : theArtist.namedPrice,
        payoutPlatform: loading || !theArtist.payoutPlatform ? 'PayPal' : theArtist.payoutPlatform,
        payoutHandle: loading || !theArtist.payoutHandle ? '' : theArtist.payoutHandle,
        bookingWhen: loading || !theArtist.bookingWhen ? [] : theArtist.bookingWhen,
        bookingWhenWhere: loading || !theArtist.bookingWhenWhere ? '' : theArtist.bookingWhenWhere,
        setLength: loading || !theArtist.setLength ? '' : theArtist.setLength,
        schedule: loading || !theArtist.schedule ? '' : theArtist.schedule,
        overnight: loading || !theArtist.overnight ? '' : theArtist.overnight,
        openers: loading || !theArtist.openers ? '' : theArtist.openers,
        travelingCompanions: loading || (theArtist.travelingCompanions == null) ? [] : theArtist.travelingCompanions,
        companionTravelers: loading || (theArtist.companionTravelers == null) ? false : theArtist.companionTravelers,
        hangout: loading || (theArtist.hangout == null)  ? false : theArtist.hangout,
        merchTable: loading || (theArtist.merchTable == null)  ? false : theArtist.merchTable,
        allergies: loading || !theArtist.allergies ? '' : theArtist.allergies,
        allowKids: loading || (theArtist.allowKids == null)  ? false : theArtist.allowKids,
        soundSystem: loading || !theArtist.soundSystem ? '' : theArtist.soundSystem,
        agreeToPayAdminFee: loading || !theArtist.agreeToPayAdminFee ? true : theArtist.agreeToPayAdminFee,
        wideImg: loading || !theArtist.wideImg ? '' : theArtist.wideImg,
        squareImg: loading || !theArtist.squareImg ? '' : theArtist.squareImg,
        covidPrefs: loading || !theArtist.covidPrefs ? '' : theArtist.covidPrefs,
        artistNotes: loading || !theArtist.artistNotes ? '' : theArtist.artistNotes,
        financialHopes: loading || !theArtist.financialHopes ? '' : theArtist.financialHopes,
        // onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
        bio: loading || !theArtist.bio ? '' : theArtist.bio,
      });
    }
    else {
      if (!auth.loading) {
        console.log("else: "+auth.user.email)
        setFormData({
          email: auth.user.email,
          slug: '',
          firstName: auth.user.name.split(' ')[0],
          lastName: auth.user.name.split(' ')[1],
          stageName: '',
          genre: '',
          medium: '',
          repLink: '',
          helpKind: '',
          // typeformDate: '',
          // active: '',
          phone: '',
          hometown: '',
          city: '',
          state: '',
          zip: '',
          costStructure: '',
          namedPrice: '',
          payoutPlatform: 'PayPal',
          payoutHandle: '',
          bookingWhen: [],
          bookingWhenWhere: '',
          setLength: '',
          schedule: '',
          overnight: '',
          openers: '',
          travelingCompanions: [],
          companionTravelers: '',
          hangout: '',
          merchTable: false,
          allergies: '',
          allowKids: false,
          soundSystem: '',
          agreeToPayAdminFee: true,
          wideImg: '',
          squareImg: '',
          covidPrefs: '',
          artistNotes: '',
          financialHopes: '',
          // onboardDate: '',
          bio: '',
        });
      }
    }
  }, [auth.loading]);

  const { 
    slug,
    email,
    firstName,
    lastName,
    stageName,
    medium,
    genre,
    repLink,
    helpKind,
    // typeformDate,
    // active,
    phone,
    hometown,
    city,
    state,
    zip,
    costStructure,
    payoutPlatform,
    payoutHandle,
    namedPrice,
    bookingWhen,
    bookingWhenWhere,
    setLength,
    schedule,
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
    // onboardDate,
    bio, 
  } = formData;

  const onChange = (e) => {
    //console.log(e.target.type);
    changesMade.current = true;
    let targetValue = e.target.value;
    switch (e.target.type) {
      case 'checkbox':
        targetValue = e.target.checked;
        break;
      default: 
        targetValue = e.target.value;
    }
    setFormData({ ...formData, [e.target.name]: targetValue });
  }

  const onCalendarChange = (target) => {
    changesMade.current = true;
    let targetValue = target.value;
    setFormData({ ...formData, [target.name]: targetValue });
  }

  const handleAddMultiTextField = (targetName, theFieldObj ) => { //super helpful: https://goshacmd.com/array-form-inputs/
    let updatedField = theFieldObj.concat([{ name: '', role: '', email: ''}]);
    setFormData({ ...formData, [targetName]: updatedField });
  }
  const handleRemoveMultiTextField = (targetName, theFieldObj, idx) => {
    let updatedField = theFieldObj.filter((s, _idx) => _idx !== idx);
    setFormData({ ...formData, [targetName]: updatedField });
  }

  const onMultiTextChange = (theFieldKey, theFieldObj, idx, e) => {
    changesMade.current = true;
    let targetValue = e.target.value;
    targetValue = e.target.value;
    let updatedField = theFieldObj.map((fieldObj, tFidx) => {
      if (idx !== tFidx) return fieldObj;
      return { ...fieldObj, [theFieldKey]: e.target.value }; //updates travelingCompanion[tFidx].name
    });
    setFormData({ ...formData, [e.target.name]: updatedField });
  }

  const uploadButtonRef = useRef();

  const clickUpload = () => {
    uploadButtonRef.current.click();
  }

  const uploadHandler = (e) => {
    changesMade.current = true;
    const uploadPath = `/api/uploads/${slug}/`; //"../porchlight-uploads";
    let fileName = e.target.files[0].name;
    let fileExtension = e.target.files[0].type.replace(/(.*)\//g, '');
    let targetValue = uploadPath + fileName;//e.target.value;
    const data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post(`/api/uploads/upload`, data)
      .then((res) => {
        setFormData({ ...formData, [e.target.name]: targetValue });
      }); 
    if (e.target.name == 'wideImg') {
      updateUserAvatar({'avatar': targetValue }, history);
    }
  }

  //const [changesMade, setChangesMade] = useState(false);
  const changesMade = useRef(false);
  const firstLoad = useRef(true);
   
  const onSubmit = (e) => {
    e.preventDefault();
    //console.log('Submitting...');
    createArtist(formData, history, true);
    changesMade.current = false;
  };

  const [open, setOpen] = useState(true);

  const formGroups = [
        <div className='form-group' num='1'>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                  <FormLabel component="legend">First things first: what's your first and last name?</FormLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField 
                  variant="standard"
                  name="firstName"
                  id="firstName" 
                  label="My first name is"  
                  value={firstName}
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField  
                  variant="standard"
                  name="lastName"
                  id="lastName" 
                  label="and my last name is"  
                  value={lastName}
                  onChange={(e) => onChange(e)}
                />
              </Grid>
          </Grid>
        </div>,
        <div className='form-group' num='3'>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                  <FormLabel component="legend">What is your band name?</FormLabel>
              </Grid>
              <Grid item>
                <TextField  
                  variant="standard"
                  name="stageName"
                  id="stageName" 
                  label="My band name is"  
                  value={stageName}
                  onChange={(e) => onChange(e)}
                />
              </Grid>
            </Grid>
          </div>,
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
          <div className='form-group' num='5'>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                  <FormLabel component="legend">Would you provide your phone number?</FormLabel>
              </Grid>
              <Grid item>
                <TextField  
                  variant="standard"
                  name="phone"
                  id="phone" 
                  label="Sure! My phone number is"  
                  value={phone}
                  onChange={(e) => onChange(e)}
                  helperText=""
                />
              </Grid>
            </Grid>
          </div>,
          <div className='form-group' num='6'>
          
            <FormControl component="fieldset">
              <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="legend">What cost structure would you prefer?<br/><small>*We currently offer very few guaranteed shows, for bands selected at our discretion.</small></FormLabel>
                </Grid>
                <Grid item>
                  <RadioGroup
                    id="costStructure"
                    value={costStructure}
                    name="costStructure"
                    onChange={(e) => onChange(e)}
                  >
                    <FormControlLabel value="ticket" control={<Radio />} label="Ticketed" />
                    <FormControlLabel value="donation" control={<Radio />} label="Free RSVP, with a suggested donation" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </FormControl>
          </div>,
          <div className='form-group' num='7'>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <FormLabel component="legend">Name your price.</FormLabel>
                </Grid>
                <Grid item>
                  <TextField  
                    variant="standard"
                    name="namedPrice"
                    id="namedPrice" 
                    label={costStructure == 'donation' ? "I'd suggest a donation of" : "Tickets should cost"}
                    value={namedPrice}
                    onChange={(e) => onChange(e)}
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
              </Grid>
            </Grid>   
          </div>,
          <div className='form-group' num='8'>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <FormLabel component="legend">For show payout, what digital payment platform do you prefer?</FormLabel>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" sx={{ minWidth: 160, m: "8px 8px 8px 0" }}>
                    <InputLabel id="payoutPlatformLabel">I prefer using</InputLabel>
                    <Select
                      //variant="standard"
                      labelId="payoutPlatformLabel"
                      id="payoutPlatform"
                      name="payoutPlatform"
                      value={payoutPlatform}
                      onChange={(e) => onChange(e)}
                      label="I prefer using"
                    >
                      <MenuItem value="PayPal">PayPal</MenuItem>
                      <MenuItem value="Venmo">Venmo</MenuItem>
                      <MenuItem value="Zelle">Zelle</MenuItem>
                      <MenuItem value="Cash App">Cash App</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>  
              <Grid item>
                <TextField 
                  variant="standard"
                  sx={{ minWidth: 420, m: "8px 8px 8px 0" }}
                  name="payoutHandle"
                  id="payoutHandle" 
                  label={"The handle for my "+payoutPlatform+" account is"} 
                  value={payoutHandle}
                  onChange={(e) => onChange(e)}
                  helperText=""
                />
              </Grid>
            </Grid> 
          </div>,
          <div className='form-group' num='9'>
            <FormLabel component="legend">Please select the dates you'd like to try to play a show:</FormLabel>
            <MultipleDatesPicker
              id="bookingWhen"
              name="bookingWhen"
              open={true}
              selectedDates={bookingWhen}
              value={bookingWhen}
              onCancel={() => setOpen(false)}
              //onSubmit={dates => console.log('selected dates', dates)}
              onChange={target => onCalendarChange(target)}
            />
          </div>,
          <div className='form-group' num='10'>
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <FormLabel component="legend">Where are you based out of?</FormLabel>
                </Grid>
                <Grid item>
                  <TextField 
                    variant="standard"
                    name="city"
                    id="city" 
                    label="I live in the city of" 
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
                    label="and my zip code is" 
                    value={zip}
                    onChange={(e) => onChange(e)}
                  />
                </Grid>
              </Grid>
          </div>,
          <div className='form-group' num='11'>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <FormLabel component="legend">How long will your set be (in minutes)?</FormLabel>
                </Grid>
                <Grid item>
                  <TextField 
                    variant="standard"
                    sx={{ minWidth: 250 }}
                    name="setLength"
                    id="setLength" 
                    label="I expect to play for"  
                    value={setLength}
                    type="number"
                    onChange={(e) => onChange(e)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                    }}
                  />
              </Grid>
            </Grid>
          </div>,
          <div className='form-group' num='14'>
            <FormControl component="fieldset">
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
              <FormLabel component="legend">Would you like for your host to accommodate/arrange for your overnight hosting?<br/><small>60% of Porchlight Hosts are interested in putting up musicians overnight!</small></FormLabel>
              </Grid>
              <Grid item>
              <RadioGroup
                id="overnight"
                value={overnight}
                name="overnight"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
              </Grid>
            </Grid>
            </FormControl>
          </div>,
          <div className='form-group' num='15'>
            <FormControl component="fieldset">
              <FormLabel component="legend">Let's talk openers. What's your preference?</FormLabel>
              <RadioGroup
                id="openers"
                value={openers}
                name="openers"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="I plan on travelling with an opener." control={<Radio />} label="I plan on travelling with an opener." />
                <FormControlLabel value="I'd like Porchlight Hosts to invite local openers." control={<Radio />} label="I'd like Porchlight Hosts to invite local openers." />
                <FormControlLabel value="I'd prefer a solo set." control={<Radio />} label="I'd prefer a solo set." />
                <FormControlLabel value="I have no preference." control={<Radio />} label="I have no preference." />
              </RadioGroup>
            </FormControl>
          </div>,
          <div className='form-group' num='16'>
          <Grid container spacing={2} sx={{margin: '0px auto', width: '100%'}}>
                <Grid item xs={12}>
                    <FormLabel component="legend">Will anybody be travelling with you?</FormLabel>
                </Grid>
            {(travelingCompanions && travelingCompanions.length > 0) ? travelingCompanions.map((travelingCompanion, idx) => (
                <Grid 
                    className="travelingCompanion" 
                    key={`travelingCompanion${idx}`} 
                    container 
                    direction="row" 
                    justifyContent="space-around" 
                    alignItems="start" 
                    spacing={2}
                    sx={{
                      // borderColor: 'primary.dark',
                      // borderWidth: '2px',
                      // borderStyle: 'solid',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      '&:hover': {
                        
                      },
                      padding: '0 10px 10px',
                      margin: '0px auto',
                      width: '100%',
                    }}
                >
          
                  <Grid item xs={12} md={3}>
                    <TextField 
                      variant="standard"
                      name="travelingCompanions"
                      id={`travelingCompanionName${idx}`}
                      label={travelingCompanions.length > 1 ? `One of their names is`: `The person's name is`} 
                      value={travelingCompanion.name}
                      onChange={(e) => onMultiTextChange("name", travelingCompanions, idx, e)}
                      sx={{width: '100%'}}

                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField 
                      variant="standard"
                      name="travelingCompanions"
                      id={`travelingCompanionRole${idx}`}
                      label={ travelingCompanion.name ? `${travelingCompanion.name.split(' ')[0]}'s role is` : `Their role is` } 
                      value={travelingCompanion.role}
                      onChange={(e) => onMultiTextChange("role", travelingCompanions, idx, e)}
                      sx={{width: '100%'}}

                    />
                  </Grid>
                  <Grid item xs={10} md={true}>
                    <TextField 
                      variant="standard"
                      name="travelingCompanions"
                      id={`travelingCompanionEmail${idx}`}
                      label={ travelingCompanion.name ? `${travelingCompanion.name.split(' ')[0]}'s email is` : `Their email is` } 
                      value={travelingCompanion.email}
                      onChange={(e) => onMultiTextChange("email", travelingCompanions, idx, e)}
                      sx={{ width: '100%' }}

                    />
                  </Grid>
                  <Grid item xs={2} md={.65}>
                    <IconButton onClick={(e) => handleRemoveMultiTextField("travelingCompanions", travelingCompanions, idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
            )): ''}
          
            <Grid container item direction="row" justifyContent="center" alignItems="center" xs={12}>
              <Button onClick={(e) => handleAddMultiTextField("travelingCompanions", travelingCompanions)}>
                <PersonAddIcon/>Add person
              </Button>
            </Grid>
          </Grid>

            {/* {companionTravelers && (
              <p><small>Companion travelers from Typeform: {companionTravelers}</small></p>
            )} */}
          </div>,
          <div className='form-group' num='17'>
            <FormControl component="fieldset">
            <Grid container 
                    direction="column" 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={2}
                    sx={{
                      width: '100%',
                      margin: '0 auto'
                      }}
            >
              <Grid  
                    container item 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={2}
                    sx={{
                      borderColor: 'primary.dark',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      '&:hover': {
                        
                      },
                      padding: '0 10px 10px',
                      margin: '0px auto',
                      width: '100%',
                    }}
                >
                  <FormLabel 
                    component="legend" 
                    className='small' 
                    sx={{
                      textAlign:'left!important',
                      width: '100%',
                      fontSize: '1rem!important',
	                    lineHeight: '1.3em!important',
                      }}
                    >
                      Our heart at Porchlight is to cultivate relationships between artists and hosts. As such, we’d love to make time for a little hangout either before or after the show, just for you, your hosts, and maybe a couple people interested in meeting with artists like you in a more informal setting.
                  </FormLabel>
              </Grid>
  
                <Grid item xs={12}>
                  <FormLabel component="legend" sx={{}}>
                    What would be your preference regarding this?
                  </FormLabel>
                </Grid>
                <Grid item>
                  <RadioGroup
                    id="hangout"
                    value={hangout}
                    name="hangout"
                    onChange={(e) => onChange(e)}
                  >
                    <FormControlLabel value="I'd rather not." control={<Radio />} label="I'd rather not." />
                    <FormControlLabel value="That sounds great! I prefer a private hangout AFTER the show." control={<Radio />} label="That sounds great! I prefer a private hangout AFTER the show." />
                    <FormControlLabel value="That sounds great! I prefer a private hangout BEFORE the show." control={<Radio />} label="That sounds great! I prefer a private hangout BEFORE the show." />
                    <FormControlLabel value="That sounds great! Either before or after works for me." control={<Radio />} label="That sounds great! Either before or after works for me." />
                  </RadioGroup>
                </Grid>
              </Grid>
            </FormControl>
          </div>,
          <div className='form-group' num='18'>
            <FormControl component="fieldset">
              <FormLabel component="legend">Will you need the host to provide a merch table?</FormLabel>
              <RadioGroup
                id="merchTable"
                value={merchTable}
                name="merchTable"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>,
          <div className='form-group' num='19'>
            <TextField 
              name="allergies"
              id="allergies" 
              label="Please list any food allergies, pet allergies, or special needs you have."  
              value={allergies}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group' num='20'>
            <FormControl component="fieldset">
              <FormLabel component="legend">Would these shows be open to children/young families?</FormLabel>
              <RadioGroup
                id="allowKids"
                value={allowKids}
                name="allowKids"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>,
          <div className='form-group' num='21'>
            <FormControl component="fieldset">
              <FormLabel component="legend">Are you able to provide your own sound system for these shows?</FormLabel>
              <RadioGroup
                id="soundSystem"
                value={soundSystem}
                name="soundSystem"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>,
          <div className='form-group'  num='22'>
            <TextField 
              name="financialHopes"
              multiline
              id="financialHopes" 
              label="What are your financial expectations and/or hopes for this show or tour?" 
              value={financialHopes}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group' num='23'>
            <FormControl component="fieldset">
              <FormLabel component="legend">Porchlight charges an administrative fee of $100/show, unless other terms have been agreed to in writing. Do you agree to pay this fee upon completion of the show/tour?</FormLabel>
              <RadioGroup
                id="agreeToPayAdminFee"
                value={agreeToPayAdminFee}
                name="agreeToPayAdminFee"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>,
          <div className='form-group'  num='24'>
          <FormControl component="fieldset">
            <FormLabel component="legend">Please attach one high quality image, for promotional use, of this size: 2160x1080px<br/>
            If the pixel size is bugging you, just make sure the image is 2:1 ratio, horizontal.</FormLabel>
            
            <UploadInput ref={uploadButtonRef} accept="image/*" name="wideImg" id="wideImg" type="file" onChange={(e) => uploadHandler(e)} />
              <label htmlFor="wideImg">
                <Button variant="contained" component="span" onClick={(e) => {clickUpload()}} >
                  <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>Upload
                </Button>
              </label>
          </FormControl>
          {(wideImg) ? (
            <img
              className="my-1"
              src={wideImg}
              alt=""
            />
          ): ''}
          </div>,
          <div className='form-group'>
            <TextField 
              name="medium"
              id="medium" 
              label="Medium"  
              value={medium}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="genre"
              id="genre" 
              label="Genre"  
              value={genre}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="repLink"
              id="repLink" 
              label="Representative Link"  
              value={repLink}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="helpKind"
              id="helpKind" 
              label="How can we help?"  
              value={helpKind}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="schedule"
              id="schedule" 
              label='Porchlight shows typically start at about 7:00pm, with "doors open" at 6:30pm, and a hard wrap at about 9pm. Does this tentative schedule likely work for most of your shows?' 
              value={schedule}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="covidPrefs"
              id="covidPrefs" 
              label="Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?" 
              value={covidPrefs}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="artistNotes"
              multiline
              id="artistNotes" 
              label="Artist Notes" 
              value={artistNotes}
              onChange={(e) => onChange(e)}
            />
          </div>,
          <div className='form-group'>
            <TextField 
              name="bio"
              multiline
              id="bio" 
              label="Bio" 
              value={bio}
              onChange={(e) => onChange(e)}
            />
          </div>
  ];

  const [formCardIndex, setIndex] = useState( 0 );
  const cardIndex = formCardIndex;
  
  const [formCardDirection, setDirection] = useState(1);
  const transitions = useTransition(formCardIndex, {
    key: formCardIndex,
    initial: null,
    from: { opacity: 0, transform: `translateX(${formCardDirection * 60}vw)` },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: `translateX(${formCardDirection * -60}vw)` },
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
    setIndex(cardIndex => (cardIndex + 1) % formGroups.length);
    if (changesMade.current) {
      onSubmit(e);
    }
  };
  const previousCard = (e) => {
    setDirection(-1);
    setIndex(cardIndex => {
      if (cardIndex == 0){
        cardIndex = formGroups.length;
      }
      console.log(cardIndex);
      return (cardIndex - 1);
    });
    if (changesMade.current) {
      onSubmit(e);
    }
  };

  return (
    <Fragment>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
      <Grid container spacing={2} sx={{padding:'20px!important'}}>
        <Grid container item sx={{width:'100%'}} direction="row" justifyContent="center" alignItems="center">
          
          <Grid item>
           {/* { cardIndex > 0 ? (  */}
            <Button variant="contained" component="span" onClick={(e) => previousCard(e)}>
              <ArrowBackIcon></ArrowBackIcon>Previous
            </Button>
            {/* ) : '' } */}
          </Grid>
          <Grid item>
            <label htmlFor="submit">
              <input id="submit" type="submit" hidden/>
              <Button variant="contained" component="span" onClick={(e) => onSubmit(e)}>
                Save <SaveTwoToneIcon></SaveTwoToneIcon>
              </Button>
            </label>
          </Grid>
          <Grid item>
          {/* { cardIndex < formGroups.length - 1 ? ( */}
            <Button variant="contained" component="span" onClick={(e) => nextCard(e)}>
              Next<ArrowForwardIcon></ArrowForwardIcon>
            </Button> 
            {/* ) : ''} */}
          </Grid>
        </Grid>
        </Grid>
        {transitions((style, i) => (
              <animated.div
                className={'animatedFormGroup'}
                key={i}
                style={{
                  ...style,
                }}
              >
                <h3 className='cardNum'>{(i+1)}. </h3>
                {formGroups[i]}
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
        
    </Fragment>
    
  );
};

EditArtistForm.propTypes = {
  createArtist: PropTypes.func.isRequired,
  theArtist: PropTypes.object,
  auth: PropTypes.object.isRequired,
  updateUserAvatar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { createArtist, updateUserAvatar })(
  withRouter(EditArtistForm)
); //withRouter allows us to pass history objects
