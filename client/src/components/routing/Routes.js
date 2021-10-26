import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Artists from '../artists/Artists';
import EditArtists from '../artists/EditArtists';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import AdminPrivateRoute from '../routing/AdminPrivateRoute';
import ResetPassword from '../auth/ResetPassword';
import ForgotPassword from '../auth/ForgotPassword';

const Routes = () => {
   return (
    <section className='container'>
    <Alert />
    <Switch>
      <Route exact path='/register' component={Register} />
      <Route exact path='/reset-password' component={ResetPassword} />
      <Route exact path='/forgot-password' component={ForgotPassword} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/profiles' component={Profiles} />
      <Route exact path='/artists' component={Artists} />
      {/* <Route exact path='/artists/:slug' component={Profile} /> */}
      <Route exact path='/profile/:id' component={Profile} />
      <PrivateRoute exact path='/dashboard' component={Dashboard} />
      <PrivateRoute exact path='/create-profile' component={CreateProfile} />
      <PrivateRoute exact path='/edit-profile' component={EditProfile} />
      {/* <PrivateRoute exact path='/edit-artists' component={EditArtists} /> */}
      <PrivateRoute exact path='/add-experience' component={AddExperience} />
      <PrivateRoute exact path='/add-education' component={AddEducation} />
      <PrivateRoute exact path='/posts' component={Posts} />
      <PrivateRoute exact path='/posts/:id' component={Post} />
      <AdminPrivateRoute exact path='/edit-artists' component={EditArtists} />
      <Route component={NotFound} />
    </Switch>
  </section>
   ) 
}

export default Routes;