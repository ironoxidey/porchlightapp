import {
  setSelectedDates
} from '../actions/types';

const initialState = {
  selectedDates: [],
  minDate: null,
  maxDate: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case setSelectedDates:
      return {
        ...state,
        selectedDates: payload
      };
    default:
      return state;
  }
}
