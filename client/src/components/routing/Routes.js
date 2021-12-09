import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Landing from '../layout/Landing';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Artists from '../artists/Artists';
import Artist from '../artists/Artist';
import EditArtists from '../artists/EditArtists';
import EditMyArtistProfile from '../artists/EditMyArtistProfile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import AdminPrivateRoute from '../routing/AdminPrivateRoute';
import ResetPassword from '../auth/ResetPassword';
import ForgotPassword from '../auth/ForgotPassword';

import { useTransition, animated, config } from '@react-spring/web';

const Routes = () => {
  const theLocation = useLocation();
  const transitions = useTransition(theLocation, {
    from: {opacity: 0, transform: "scale(1.02)"},
    enter: {opacity: 1, transform: "scale(1)"},
    leave: {opacity: 0, transform: "scale(0.98)"},
    config: config.stiff
  });

  return (
    <section className='container'>
      {transitions(( style, location ) => {
        return (
          <animated.div style={style} className='animatedRoute'>
            <Switch location={location}>
              <Route exact path='/' component={Landing} />

              <Route exact path='/register' component={Register} />
              <Route exact path='/reset-password' component={ResetPassword} />
              <Route exact path='/forgot-password' component={ForgotPassword} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/artists' component={Artists} />
              <Route exact path='/artists/:slug' component={Artist} />
              <Route exact path='/profile/:id' component={Profile} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/edit-artist-profile' component={EditMyArtistProfile} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
              <PrivateRoute exact path='/add-education' component={AddEducation} />
              <PrivateRoute exact path='/posts' component={Posts} />
              <PrivateRoute exact path='/posts/:id' component={Post} />
              <AdminPrivateRoute exact path='/edit-artists' component={EditArtists} />
              <Route component={NotFound} />
            </Switch>
          </animated.div> 
        )
      })}
    </section>
   ) 
}

export default Routes;