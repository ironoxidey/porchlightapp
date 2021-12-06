import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';

const EditArtistItem = ({
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
    bio: '',
  });

  const [displayEdit, toggleEdit] = useState(false);

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
    onboardDate,
    bio, 
  } = formData;

  const formDataArray = [
    slug,
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
    onboardDate,
    bio
  ];

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

  const mailtoSubject = encodeURIComponent("Hey, " + firstName + "! Just following up about our Zoom conversation on " + typeformDate);
  const mailtoBody = encodeURIComponent(
`When we talked, you mentioned that you're from `+ hometown + `.
What is it like there this time of year?`
);

  return (
      <div className={`profile bg-dark p-1 my-1 ${active ? "active" : ""}`}>
        <Fragment>
        <img src={squareImg} alt="" className="profileImage" />
        <div className="artistAdminButtons">
        <Link to={`/artists/${slug}`} className='btn btn-primary profileBtn'>
            View Frontend Profile
        </Link>
            <a href={`mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`} className='btn btn-primary'><i className="fas fa-envelope"></i>
                <span> Send a follow-up email</span>
            </a>
        </div>
        
        <div className='artist-info'>
            <h2 className='text-primary stageName'>{stageName}</h2> 
        {active && (
          <small>Active</small>
        )}
            <p className='hometown'>{hometown}</p>
            <p className='genre'>{genre}</p>
            <p className='bio'>{bio}</p>
            {repLink ? (
                    <a href={repLink} className='btn btn-primary' target="_blank" rel="noopener noreferrer">Check out {stageName}'s work</a>
                ): ''}
                <button
            onClick={() => toggleEdit(!displayEdit)}
            type='button'
            className='btn btn-light editBtn'
          >
            Edit
        </button>

        </div>
       

        {displayEdit && (
          <Fragment>
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
                  <input
                      type='text'
                      placeholder='First Name'
                      name='firstName'
                      value={firstName}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      First Name
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Last Name'
                      name='lastName'
                      value={lastName}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      Last Name
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Email'
                      name='email'
                      value={email}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      Email
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Genre'
                      name='genre'
                      value={genre}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      Genre
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Representative Link'
                      name='repLink'
                      value={repLink}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      Representative Link
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='How can we help?'
                      name='helpKind'
                      value={helpKind}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                      How can we help?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Typeform Date'
                      name='typeformDate'
                      value={typeformDate}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Typeform Date
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='checkbox'
                      placeholder='Had Zoom Meeting'
                      name='hadMeeting'
                      value={hadMeeting}
                      checked={!!hadMeeting}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Had Zoom Meeting
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='checkbox'
                      placeholder='Sent Follow-up'
                      name='sentFollowUp'
                      value={sentFollowUp}
                      checked={!!sentFollowUp}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Sent Follow-up
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='checkbox'
                      placeholder='Active'
                      name='active'
                      value={active}
                      checked={!!active}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Active
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

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Phone Number'
                      name='phone'
                      value={phone}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Phone Number
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Hometown'
                      name='hometown'
                      value={hometown}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Hometown
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Cost Structure'
                      name='costStructure'
                      value={costStructure}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Cost Structure
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Name your price'
                      name='namedPrice'
                      value={namedPrice}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Name your price
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='What dates and locations are you interested in booking?'
                      name='bookingWhenWhere'
                      value={bookingWhenWhere}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  What dates and locations are you interested in booking?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='How long will your set be (in minutes)?'
                      name='setLength'
                      value={setLength}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  How long will your set be (in minutes)?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Porchlight shows typically start at about 7:00pm, with "doors open" at 6:30pm, and a hard wrap at about 9pm. Does this tentative schedule likely work for most of your shows?'
                      name='schedule'
                      value={schedule}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Porchlight shows typically start at about 7:00pm, with "doors open" at 6:30pm, and a hard wrap at about 9pm. Does this tentative schedule likely work for most of your shows?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Would you like for your host to accommodate/arrange for your overnight hosting?'
                      name='overnight'
                      value={overnight}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Would you like for your host to accommodate/arrange for your overnight hosting?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='What is your preference on openers?'
                      name='openers'
                      value={openers}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  What is your preference on openers?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Will anybody be travelling with you?'
                      name='companionTravelers'
                      value={companionTravelers}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Will anybody be travelling with you?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Hangout with host'
                      name='hangout'
                      value={hangout}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Hangout with host
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Will you need the host to provide a merch table?'
                      name='merchTable'
                      value={merchTable}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Will you need the host to provide a merch table?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Allergies'
                      name='allergies'
                      value={allergies}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Allergies
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Would these shows be open to children/young families?'
                      name='allowKids'
                      value={allowKids}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Would these shows be open to children/young families?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Are you able to provide your own sound system for these shows?'
                      name='soundSystem'
                      value={soundSystem}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Are you able to provide your own sound system for these shows?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='What are your financial expectations and/or hopes for this show or tour?'
                      name='financialHopes'
                      value={financialHopes}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  What are your financial expectations and/or hopes for this show or tour?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?'
                      name='covidPrefs'
                      value={covidPrefs}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Artist Notes'
                      name='artistNotes'
                      value={artistNotes}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Artist Notes
                  </small>
                </div>

                <div className='form-group'>
                  <input
                      type='text'
                      placeholder='Onboard Date'
                      name='onboardDate'
                      value={onboardDate}
                      onChange={(e) => onChange(e)}
                  />
                  <small className='form-text'>
                  Onboard Date
                  </small>
                </div>

                <div className='form-group'>
                  <textarea
                      placeholder='Bio'
                      name='bio'
                      value={bio}
                      onChange={(e) => onChange(e)}
                  ></textarea>
                  <small className='form-text'>Bio</small>
                </div>

                <input type='submit' className='btn btn-primary my-1' />
            </form>
          </Fragment>
         )}
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
