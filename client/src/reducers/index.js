import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import artist from './artist';
import calendly from './calendly';
import datepicker from './datepicker';
import app from './app';

export default combineReducers({ alert, auth, profile, post, artist, calendly, datepicker, app });
