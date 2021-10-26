import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';

const EditArtistItem = ({
    theArtist,
  theArtist: {
    loading,
    // email,
    // firstName,
    // lastName,
    // stageName,
    // medium,
    // genre,
    // repLink,
    // helpKind,
    // typeformDate,
    // hadMeeting,
    // sentFollowUp,
    // active,
    // notes,
    // phone,
    // hometown,
    // costStructure,
    // namedPrice,
    // bookingWhenWhere,
    // setLength,
    // schedule,
    // overnight,
    // openers,
    // companionTravelers,
    // hangout,
    // merchTable,
    // allergies,
    // allowKids,
    // soundSystem,
    // wideImg,
    // squareImg,
    // covidPrefs,
    // artistNotes,
    // financialHopes,
    // onboardDate
},
  createArtist,
  history,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
     stageName: '',
    medium: '',
    repLink: '',
    helpKind: '',
    typeformDate: '',
    hadMeeting: '',
    sentFollowUp: '',
    active: '',
    notes: '',
    phone: '',
    hometown: '',
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
    onboardDate: '',
  });

  useEffect(() => {
    setFormData({
      email: loading || !theArtist.email ? '' : theArtist.email,
      firstName: loading || !theArtist.firstName ? '' : theArtist.firstName,
      lastName: loading || !theArtist.lastName ? '' : theArtist.lastName,
      stageName: loading || !theArtist.stageName ? '' : theArtist.stageName,
      medium: loading || !theArtist.medium ? '' : theArtist.medium,
      genre: loading || !theArtist.genre ? '' : theArtist.genre,
      repLink: loading || !theArtist.repLink ? '' : theArtist.repLink,
      helpKind: loading || !theArtist.helpKind ? '' : theArtist.helpKind,
      typeformDate: loading || !theArtist.typeformDate ? '' : theArtist.typeformDate,
      hadMeeting: loading || (theArtist.hadMeeting == null) ? false : theArtist.hadMeeting, //because it's a boolean variable, asking !theArtist.hadMeeting could result in it being set '' if theArtist.hadMeeting is FALSE in the database
      sentFollowUp: loading || (theArtist.sentFollowUp == null)  ? false : theArtist.sentFollowUp,
      active: loading || (theArtist.active == null) ? false : theArtist.active,
      notes: loading || !theArtist.notes ? '' : theArtist.notes,
      phone: loading || !theArtist.phone ? '' : theArtist.phone,
      hometown: loading || !theArtist.hometown ? '' : theArtist.hometown,
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
      onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
    });
  }, [loading]);

  const {
    email,
    firstName,
    lastName,
    stageName,
    medium,
    genre,
    repLink,
    helpKind,
    typeformDate,
    hadMeeting,
    sentFollowUp,
    active,
    notes,
    phone,
    hometown,
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
    onboardDate 
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
    

  const onSubmit = (e) => {
    e.preventDefault();
    createArtist(formData, history, true);
  };
  return (
      <div className="post bg-white p-1 my-1">
        <Fragment>
        <h1 className='large text-primary'>Edit this artist</h1>
        <p className='lead'>
            <i className='fas fa-user'></i> Update info for {stageName}
        </p>
        <small>* = required field</small>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
            <div className='form-group'>
            <input
                type='text'
                placeholder='Stage Name'
                name='stageName'
                value={stageName}
                onChange={(e) => onChange(e)}
            />
            <small className='form-text'>
                What's your band or stage name?
            </small>
            </div>
            <div className='form-group'>
            <textarea
                placeholder='notes'
                name='notes'
                value={notes}
                onChange={(e) => onChange(e)}
            ></textarea>
            <small className='form-text'>Admin Notes</small>
            </div>

            <input type='submit' className='btn btn-primary my-1' />
        </form>
        </Fragment>
    </div>
  );
};

EditArtistItem.propTypes = {
  createArtist: PropTypes.func.isRequired,
  theArtist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { createArtist })(
  withRouter(EditArtistItem)
); //withRouter allows us to pass history objects
