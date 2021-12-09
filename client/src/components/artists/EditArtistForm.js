import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';
import { 
  TextField, 
  Button, 
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';


const EditArtistForm = ({
  theArtist,
  //theArtist: { loading },
  createArtist,
  history,
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
    merchTable: '',
    allergies: '',
    allowKids: '',
    soundSystem: '',
    wideImg: '',
    squareImg: '',
    covidPrefs: '',
    artistNotes: '',
    financialHopes: '',
    // onboardDate: '',
    bio: '',
  });

  useEffect(() => {
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
      wideImg: loading || !theArtist.wideImg ? '' : theArtist.wideImg,
      squareImg: loading || !theArtist.squareImg ? '' : theArtist.squareImg,
      covidPrefs: loading || !theArtist.covidPrefs ? '' : theArtist.covidPrefs,
      artistNotes: loading || !theArtist.artistNotes ? '' : theArtist.artistNotes,
      financialHopes: loading || !theArtist.financialHopes ? '' : theArtist.financialHopes,
      // onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
      bio: loading || !theArtist.bio ? '' : theArtist.bio,
    });
  }, [loading]);

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
    wideImg,
    squareImg,
    covidPrefs,
    artistNotes,
    financialHopes,
    // onboardDate,
    bio, 
  } = formData;

  // const formDataArray = [
  //   slug,
  //   email,
  //   firstName,
  //   lastName,
  //   stageName,
  //   medium,
  //   genre,
  //   repLink,
  //   helpKind,
  //   // typeformDate,
  //   // active,
  //   phone,
  //   hometown,
  //   costStructure,
  //   namedPrice,
  //   bookingWhenWhere,
  //   setLength,
  //   schedule,
  //   overnight,
  //   openers,
  //   companionTravelers,
  //   hangout,
  //   merchTable,
  //   allergies,
  //   allowKids,
  //   soundSystem,
  //   wideImg,
  //   squareImg,
  //   covidPrefs,
  //   artistNotes,
  //   financialHopes,
  //   // onboardDate,
  //   bio
  // ];

  const onChange = (e) => {
    console.log(e.target.type);
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
    let targetValue = target.value;
    setFormData({ ...formData, [target.name]: targetValue });
  }

  const handleAddMultiTextField = (targetName, theFieldObj ) => { //super helpful: https://goshacmd.com/array-form-inputs/
    let updatedField = theFieldObj.concat([{ name: "", role: "" }]);
    setFormData({ ...formData, [targetName]: updatedField });
  }
  const handleRemoveMultiTextField = (targetName, theFieldObj, idx) => {
    let updatedField = theFieldObj.filter((s, _idx) => _idx !== idx);
    setFormData({ ...formData, [targetName]: updatedField });
  }

  const onMultiTextChange = (theFieldKey, theFieldObj, idx, e) => {
    let targetValue = e.target.value;
    targetValue = e.target.value;
    let updatedField = theFieldObj.map((fieldObj, tFidx) => {
      if (idx !== tFidx) return fieldObj;
      return { ...fieldObj, [theFieldKey]: e.target.value }; //updates travelingCompanion[tFidx].name
    });
    setFormData({ ...formData, [e.target.name]: updatedField });
  }

    

  const onSubmit = (e) => {
    e.preventDefault();
    createArtist(formData, history, true);
  };

  const [open, setOpen] = React.useState(true);

  return (
    <Fragment>
      <form className='form' onSubmit={(e) => onSubmit(e)}>

  {/* 1 & 2 */}
          <div className='form-group'>
            <TextField 
              name="firstName"
              id="firstName" 
              label="What's your first name?"  
              value={firstName}
              onChange={(e) => onChange(e)}
            />
            
            <TextField 
              name="lastName"
              id="lastName" 
              label="And your last name?"  
              value={lastName}
              onChange={(e) => onChange(e)}
            />
          </div>

  {/* 3 */}
          <div className='form-group'>
            <TextField 
              name="stageName"
              id="stageName" 
              label="What's your band or stage name?"  
              value={stageName}
              onChange={(e) => onChange(e)}
            />
          </div>

  {/* 4 */}
          <div className='form-group'>
            <TextField 
              name="email"
              id="email" 
              label="What's your email address?"  
              value={email}
              onChange={(e) => onChange(e)}
              disabled
            />
          </div>

  {/* 5 */}
          <div className='form-group'>
            <TextField 
              name="phone"
              id="phone" 
              label="Would you provide your phone number?"  
              value={phone}
              onChange={(e) => onChange(e)}
              helperText="In case we need to reach you quickly leading up to a show."
            />
          </div>

  {/* 6 */}
          <div className='form-group'>
            {/* <TextField 
              name="costStructure"
              id="costStructure" 
              label="Cost Structure"  
              value={costStructure}
              onChange={(e) => onChange(e)}
            /> */}
            <FormControl component="fieldset">
              <FormLabel component="legend">What cost structure would you prefer?<br/><small>*We currently offer very few guaranteed shows, for bands selected at our discretion.</small></FormLabel>
              <RadioGroup
                id="costStructure"
                value={costStructure}
                name="costStructure"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="Ticketed" control={<Radio />} label="Ticketed" />
                <FormControlLabel value="Free RSVP, with a suggested donation" control={<Radio />} label="Free RSVP, with a suggested donation" />
              </RadioGroup>
            </FormControl>
          </div>

  {/* 7 */}
          <div className='form-group'>
            <TextField 
              name="namedPrice"
              id="namedPrice" 
              label="Name your price"  
              value={namedPrice}
              onChange={(e) => onChange(e)}
              type="number"
              InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </div>

  {/* 8 */}
          <div className='form-group'>

            {/* <FormLabel component="legend">For show payout, what digital payment platform do you prefer?</FormLabel> */}
            <FormControl variant="outlined" sx={{ minWidth: 520, m: "8px 8px 8px 0" }}>
              <InputLabel id="payoutPlatformLabel">For show payout, what digital payment platform do you prefer?</InputLabel>
              <Select
                labelId="payoutPlatformLabel"
                id="payoutPlatform"
                name="payoutPlatform"
                value={payoutPlatform}
                onChange={(e) => onChange(e)}
                label="For show payout, what digital payment platform do you prefer?"
              >
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Venmo">Venmo</MenuItem>
                <MenuItem value="Zelle">Zelle</MenuItem>
                <MenuItem value="Cash App">Cash App</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              sx={{ minWidth: 520, m: "8px 8px 8px 0" }}
              name="payoutHandle"
              id="payoutHandle" 
              label={"What is the handle associated with your "+payoutPlatform+" account?"} 
              value={payoutHandle}
              onChange={(e) => onChange(e)}
              helperText=""
            />
          </div>

  {/* 9 */}
          <div className='form-group'>
            <FormLabel component="legend">Please select the dates you'd like to try to play a show:</FormLabel>
            <MultipleDatesPicker
              id="bookingWhen"
              name="bookingWhen"
              open={true}
              selectedDates={bookingWhen}
              value={bookingWhen}
              onCancel={() => setOpen(false)}
              onSubmit={dates => console.log('selected dates', dates)}
              onChange={target => onCalendarChange(target)}
            />
            {/* <select style={{display: "none"}} name="bookingWhen" id="bookingWhen" multiple >
              {(bookingWhen && bookingWhen.length > 0) ? bookingWhen.map(date => <option key={`${date.toString()}`} value={`${date.toString()}`} selected>{`${date.toString()}`}</option>):''}
            </select> */}
          </div>
  
  {/* 10 */}
          <div className='form-group'>
          <p>Where are you based out of?</p>
            <TextField 
              name="city"
              id="city" 
              label="City" 
              value={city}
              onChange={(e) => onChange(e)}
            />
            <TextField 
              name="state"
              id="state" 
              label="State" 
              value={state}
              onChange={(e) => onChange(e)}
            />
            <TextField 
              name="zip"
              id="zip" 
              label="Zip" 
              value={zip}
              onChange={(e) => onChange(e)}
            />
          </div>

  {/* 11 */}
          <div className='form-group'>
            <TextField 
              sx={{ minWidth: 450 }}
              name="setLength"
              id="setLength" 
              label="How long will your set be (in minutes)?"  
              value={setLength}
              type="number"
              onChange={(e) => onChange(e)}
              InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
              }}
            />
          </div>

  {/* 14 */}
          <div className='form-group'>
            {/* <TextField 
              name="overnight"
              id="overnight" 
              label="Would you like for your host to accommodate/arrange for your overnight hosting?" 
              value={overnight}
              onChange={(e) => onChange(e)}
            /> */}

            <FormControl component="fieldset">
              <FormLabel component="legend">Would you like for your host to accommodate/arrange for your overnight hosting?<br/><small>60% of Porchlight Hosts are interested in putting up musicians overnight!</small></FormLabel>
              <RadioGroup
                id="overnight"
                value={overnight}
                name="overnight"
                onChange={(e) => onChange(e)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

  {/* 15 */}
          <div className='form-group'>
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
          </div>

  {/* 16 */}
          <div className='form-group'>
          <FormLabel component="legend">Will anybody be travelling with you?</FormLabel>
          {(travelingCompanions && travelingCompanions.length > 0) ? travelingCompanions.map((travelingCompanion, idx) => (
            <div className="travelingCompanion" key={`travelingCompanion${idx}`}>
              <TextField 
                name="travelingCompanions"
                id={`travelingCompanionName${idx}`}
                label={`Traveling Companion #${idx + 1} name`} 
                value={travelingCompanion.name}
                onChange={(e) => onMultiTextChange("name", travelingCompanions, idx, e)}
              />
              <TextField 
                name="travelingCompanions"
                id={`travelingCompanionRole${idx}`}
                label={`Role`} 
                value={travelingCompanion.role}
                onChange={(e) => onMultiTextChange("role", travelingCompanions, idx, e)}
              />
              <IconButton onClick={(e) => handleRemoveMultiTextField("travelingCompanions", travelingCompanions, idx)}>
                <DeleteIcon />
              </IconButton>
            </div>
          )): ''}
        
          <IconButton onClick={(e) => handleAddMultiTextField("travelingCompanions", travelingCompanions)}>
            <PersonAddIcon/>
          </IconButton>

          {companionTravelers && (
            <p><small>Companion travelers from Typeform: {companionTravelers}</small></p>
          )}
          </div>




          <div className='form-group'>
            <TextField 
              name="medium"
              id="medium" 
              label="Medium"  
              value={medium}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="genre"
              id="genre" 
              label="Genre"  
              value={genre}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="repLink"
              id="repLink" 
              label="Representative Link"  
              value={repLink}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="helpKind"
              id="helpKind" 
              label="How can we help?"  
              value={helpKind}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="schedule"
              id="schedule" 
              label='Porchlight shows typically start at about 7:00pm, with "doors open" at 6:30pm, and a hard wrap at about 9pm. Does this tentative schedule likely work for most of your shows?' 
              value={schedule}
              onChange={(e) => onChange(e)}
            />
          </div>


          <div className='form-group'>
            <TextField 
              name="hangout"
              id="hangout" 
              label="Hangout with host" 
              value={hangout}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="merchTable"
              id="merchTable" 
              label="Will you need the host to provide a merch table?" 
              value={merchTable}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="allergies"
              id="allergies" 
              label="Allergies" 
              value={allergies}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="allowKids"
              id="allowKids" 
              label="Would these shows be open to children/young families?" 
              value={allowKids}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="soundSystem"
              id="soundSystem" 
              label="Are you able to provide your own sound system for these shows?" 
              value={soundSystem}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="financialHopes"
              id="financialHopes" 
              label="What are your financial expectations and/or hopes for this show or tour?" 
              value={financialHopes}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="covidPrefs"
              id="covidPrefs" 
              label="Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?" 
              value={covidPrefs}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="artistNotes"
              multiline
              id="artistNotes" 
              label="Artist Notes" 
              value={artistNotes}
              onChange={(e) => onChange(e)}
            />
          </div>

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

          <label htmlFor="submit">
            <input id="submit" type="submit" hidden/>
            <Button variant="contained" component="span">
              Submit
            </Button>
          </label>
          {/* <input type='submit' className='btn btn-primary my-1' /> */}
      </form>
    </Fragment>
    
  );
};

EditArtistForm.propTypes = {
  createArtist: PropTypes.func.isRequired,
  theArtist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { createArtist })(
  withRouter(EditArtistForm)
); //withRouter allows us to pass history objects
