import { OPEN_NAV_DRAWER, CLOSE_NAV_DRAWER } from './types';

export const openNavDrawer = () => (dispatch) => {
    dispatch({
        type: OPEN_NAV_DRAWER
    });
};

export const closeNavDrawer = () => (dispatch) => {
    
    dispatch({
      type: CLOSE_NAV_DRAWER
    });
  };
