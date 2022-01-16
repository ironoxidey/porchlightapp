import {
    OPEN_NAV_DRAWER,
    CLOSE_NAV_DRAWER
  } from '../actions/types';
  
  const intialState = {
    navDrawer: false
  };
  
  export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
      case OPEN_NAV_DRAWER:
        return {
          ...state,
          navDrawer: true,
        };
      case CLOSE_NAV_DRAWER:
        return {
            ...state,
            navDrawer: false,
        };
  
      default:
        return state;
    }
  }
  