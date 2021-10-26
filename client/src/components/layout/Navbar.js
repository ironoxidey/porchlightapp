import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const adminLinks = (
    <ul>
      <li>
        <Link to='/edit-artists'>
          <i className='fas fa-users'></i>{' '}Edit Artists
        </Link>
      </li>
      {/* <li>
        <Link to='/posts'>
          Posts
        </Link>
      </li> */}
      <li>
        <Link to='/dashboard'>
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  const attenderLinks = (
    <ul>
      <li>
        <Link to='/artists'>
          <i className='fas fa-users'></i>{' '}Artists
        </Link>
      </li>
      {/* <li>
        <Link to='/posts'>
          Posts
        </Link>
      </li> */}
      <li>
        <Link to='/dashboard'>
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/artists'>
          <i className='fas fa-users'></i>{' '}Artists
        </Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          Porchlight | <small> Art + Hospitality </small>
        </Link>
      </h1>
      {!loading && (
        <Fragment>
          {(isAuthenticated && user.role === "ADMIN") ? (adminLinks) : isAuthenticated ? (attenderLinks) : guestLinks}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(Navbar);
