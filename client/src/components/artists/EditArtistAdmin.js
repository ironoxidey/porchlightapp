import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createArtist } from '../../actions/artist';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const EditArtistAdmin = ({
  theArtist,
  theArtist: { loading },
  createArtist,
  history,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    typeformDate: '',
    hadMeeting: '',
    sentFollowUp: '',
    active: '',
    notes: '',
    onboardDate: '',
  });

  const [displayEdit, toggleEdit] = useState(false);

  useEffect(() => {
    setFormData({
      email: loading || !theArtist.email ? '' : theArtist.email,
      typeformDate: loading || !theArtist.typeformDate ? '' : theArtist.typeformDate,
      hadMeeting: loading || (theArtist.hadMeeting == null) ? false : theArtist.hadMeeting, //because it's a boolean variable, asking !theArtist.hadMeeting could result in it being set '' if theArtist.hadMeeting is FALSE in the database
      sentFollowUp: loading || (theArtist.sentFollowUp == null)  ? false : theArtist.sentFollowUp,
      active: loading || (theArtist.active == null) ? false : theArtist.active,
      notes: loading || !theArtist.notes ? '' : theArtist.notes,
      onboardDate: loading || !theArtist.onboardDate ? '' : theArtist.onboardDate,
    });
  }, [loading]);

  const { 
    email,
    typeformDate,
    hadMeeting,
    sentFollowUp,
    active,
    notes,
    onboardDate,
  } = formData;

  // const formDataArray = [
  //   email,
  //   typeformDate,
  //   hadMeeting,
  //   sentFollowUp,
  //   active,
  //   notes,
  //   onboardDate,
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
              name="typeformDate"
              id="typeformDate" 
              label="Typeform Date" 
              //variant="filled" 
              value={typeformDate}
              onChange={(e) => onChange(e)}
            />
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
                placeholder='Onboard Date'
                name='onboardDate'
                value={onboardDate}
                onChange={(e) => onChange(e)}
            />
            <small className='form-text'>
            Onboard Date
            </small>
          </div>

          <input type='submit' className='btn btn-primary my-1' />
      </form>
    </Fragment>
    </ThemeProvider>
  );
};

EditArtistAdmin.propTypes = {
  createArtist: PropTypes.func.isRequired,
  theArtist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { createArtist })(
  withRouter(EditArtistAdmin)
); //withRouter allows us to pass history objects
