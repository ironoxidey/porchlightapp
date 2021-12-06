import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';
import { TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const EditArtistForm = ({
  theArtist,
  theArtist: { loading },
  createArtist,
  history,
}) => {
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
    bookingWhenWhere: '',
    setLength: '',
    schedule: '',
    overnight: '',
    openers: '',
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
      bookingWhenWhere: loading || !theArtist.bookingWhenWhere ? '' : theArtist.bookingWhenWhere,
      setLength: loading || !theArtist.setLength ? '' : theArtist.setLength,
      schedule: loading || !theArtist.schedule ? '' : theArtist.schedule,
      overnight: loading || !theArtist.overnight ? '' : theArtist.overnight,
      openers: loading || !theArtist.openers ? '' : theArtist.openers,
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
    namedPrice,
    bookingWhenWhere,
    setLength,
    schedule,
    overnight,
    openers,
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
    

  const onSubmit = (e) => {
    e.preventDefault();
    createArtist(formData, history, true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <Fragment>
      <form className='form' onSubmit={(e) => onSubmit(e)}>

          <div className='form-group'>
            <TextField 
              name="stageName"
              id="stageName" 
              label="What's your band or stage name?" 
              //variant="filled" 
              value={stageName}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="firstName"
              id="firstName" 
              label="What's your first name?" 
              //variant="filled" 
              value={firstName}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="lastName"
              id="lastName" 
              label="What's your last name?" 
              //variant="filled" 
              value={lastName}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="email"
              id="email" 
              label="What's your email address?" 
              //variant="filled" 
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="medium"
              id="medium" 
              label="Medium" 
              //variant="filled" 
              value={medium}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="genre"
              id="genre" 
              label="Genre" 
              //variant="filled" 
              value={genre}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="repLink"
              id="repLink" 
              label="Representative Link" 
              //variant="filled" 
              value={repLink}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="helpKind"
              id="helpKind" 
              label="How can we help?" 
              //variant="filled" 
              value={helpKind}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="phone"
              id="phone" 
              label="Phone Number" 
              //variant="filled" 
              value={phone}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
          <p>Where do you live?</p>
            <TextField 
              name="city"
              id="city" 
              label="City"
              //variant="filled" 
              value={city}
              onChange={(e) => onChange(e)}
            />
            <TextField 
              name="state"
              id="state" 
              label="State"
              //variant="filled" 
              value={state}
              onChange={(e) => onChange(e)}
            />
            <TextField 
              name="zip"
              id="zip" 
              label="Zip"
              //variant="filled" 
              value={zip}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="costStructure"
              id="costStructure" 
              label="Cost Structure" 
              //variant="filled" 
              value={costStructure}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="namedPrice"
              id="namedPrice" 
              label="Name your price" 
              //variant="filled" 
              value={namedPrice}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="bookingWhenWhere"
              id="bookingWhenWhere" 
              label="What dates and locations are you interested in booking?" 
              //variant="filled" 
              value={bookingWhenWhere}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="setLength"
              id="setLength" 
              label="How long will your set be (in minutes)?" 
              //variant="filled" 
              value={setLength}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="schedule"
              id="schedule" 
              label='Porchlight shows typically start at about 7:00pm, with "doors open" at 6:30pm, and a hard wrap at about 9pm. Does this tentative schedule likely work for most of your shows?'
              //variant="filled" 
              value={schedule}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="overnight"
              id="overnight" 
              label="Would you like for your host to accommodate/arrange for your overnight hosting?"
              //variant="filled" 
              value={overnight}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="openers"
              id="openers" 
              label="What is your preference on openers?"
              //variant="filled" 
              value={openers}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="companionTravelers"
              id="companionTravelers" 
              label="Will anybody be travelling with you?"
              //variant="filled" 
              value={companionTravelers}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="hangout"
              id="hangout" 
              label="Hangout with host"
              //variant="filled" 
              value={hangout}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="merchTable"
              id="merchTable" 
              label="Will you need the host to provide a merch table?"
              //variant="filled" 
              value={merchTable}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="allergies"
              id="allergies" 
              label="Allergies"
              //variant="filled" 
              value={allergies}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="allowKids"
              id="allowKids" 
              label="Would these shows be open to children/young families?"
              //variant="filled" 
              value={allowKids}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="soundSystem"
              id="soundSystem" 
              label="Are you able to provide your own sound system for these shows?"
              //variant="filled" 
              value={soundSystem}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="financialHopes"
              id="financialHopes" 
              label="What are your financial expectations and/or hopes for this show or tour?"
              //variant="filled" 
              value={financialHopes}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className='form-group'>
            <TextField 
              name="covidPrefs"
              id="covidPrefs" 
              label="Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?"
              //variant="filled" 
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
              //variant="filled" 
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
              //variant="filled" 
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
    </ThemeProvider>
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
