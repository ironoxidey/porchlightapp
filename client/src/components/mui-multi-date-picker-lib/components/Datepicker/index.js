import React, {
    useReducer,
    useCallback,
    useEffect,
    Fragment,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import DateUtilities from './utils';
import Calendar from './Calendar';
//import { Dialog } from '@mui/material'
import { makeStyles } from '@mui/styles';

import { setSelectedDates } from '../../../../actions/types';

import { withRouter } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        minHeight: 482,
        maxHeight: 482,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(1),
        },
    },
}));

// function initState (selectedDates) {
//   return {
//     selectedDates: selectedDates ? [...selectedDates] : [],
//     minDate: null,
//     maxDate: null
//   }
// }

// function reducer (state, action) {
//   switch (action.type) {
//     case setSelectedDates:
//       return { ...state, selectedDates: action.payload }
//     default:
//       return new Error('wrong action type in multiple date picker reducer')
//   }
// }

const DatePicker = ({
    datepicker,
    open,
    readOnly,
    onCancel,
    //onSubmit,
    name,
    value,
    onChange,
    selectedDates: outerSelectedDates,
    disabledDates,
    cancelButtonText,
    submitButtonText = 'Submit',
    selectedDatesTitle = 'Selected Dates',
}) => {
    if (cancelButtonText == null) {
        cancelButtonText = readOnly ? 'Clear' : 'Clear';
    }

    const [dateData, setDateData] = useState({
        selectedDates: [],
        minDate: null,
        maxDate: null,
    });

    useEffect(() => {
        if (datepicker) {
            setDateData({
                selectedDates: !datepicker.selectedDates
                    ? []
                    : datepicker.selectedDates,
            });
        }
    }, [datepicker.selectedDates]);

    const { selectedDates, minDate, maxDate } = dateData;

    // const [{ selectedDates, minDate, maxDate }, dispatch] = useReducer(
    //   reducer,
    //   outerSelectedDates,
    //   initState
    // )

    const dispatch = useDispatch();

    const classes = useStyles();

    const onSelect = useCallback(
        (day) => {
            //console.log('day', day);

            if (readOnly) return;

            if (DateUtilities.dateIn(selectedDates, day)) {
                dispatch({
                    type: setSelectedDates,
                    payload: selectedDates.filter(
                        (date) => !DateUtilities.isSameDay(date, day)
                    ),
                });
                onChange({
                    name: name,
                    value: selectedDates.filter(
                        (date) => !DateUtilities.isSameDay(date, day)
                    ),
                });
            } else {
                dispatch({
                    type: setSelectedDates,
                    payload: [...selectedDates, day],
                });
                onChange({ name: name, value: [...selectedDates, day] });
            }
        },
        [selectedDates, dispatch, readOnly]
    );

    const onRemoveAtIndex = useCallback(
        (index) => {
            if (readOnly) return;
            const newDates = [...selectedDates];

            if (index > -1) {
                newDates.splice(index, 1);
            }
            dispatch({ type: setSelectedDates, payload: newDates });
            onChange({ name: name, value: newDates });
        },
        [selectedDates, dispatch, readOnly]
    );

    const dismiss = useCallback(() => {
        dispatch({ type: setSelectedDates, payload: [] });
        onCancel();
    }, [dispatch, onCancel]);

    const handleCancel = useCallback(
        (e) => {
            e.preventDefault();
            dismiss();
        },
        [dismiss]
    );

    const handleOk = useCallback(
        (e) => {
            e.preventDefault();
            if (readOnly) return;
            //onSubmit(selectedDates)
        },
        [
            //onSubmit,
            selectedDates,
            readOnly,
        ]
    );

    useEffect(() => {
        let outerSelectedDatesDated = [];
        if (open) {
            //console.log("selectedDates: "+outerSelectedDates);
            for (let date of outerSelectedDates) {
                outerSelectedDatesDated.push(new Date(date));
            }
            //console.log(outerSelectedDatesDated);
            dispatch({
                type: setSelectedDates,
                payload:
                    outerSelectedDatesDated != null
                        ? outerSelectedDatesDated
                        : [],
            });
        }
    }, [open, outerSelectedDates]);
    useEffect(() => {
        if (selectedDates) {
            for (let date of selectedDates) {
                date = new Date(date);
            }
        }
        if (disabledDates) {
            for (let date of disabledDates) {
                date = new Date(date);
            }
        }
    }, []);

    return (
        <Fragment>
            {/* <Dialog open={open} classes={{ paper: classes.dialogPaper }}> */}
            {/* <DialogContent> */}

            <Calendar
                selectedDates={selectedDates}
                disabledDates={disabledDates}
                onSelect={onSelect}
                onRemoveAtIndex={onRemoveAtIndex}
                minDate={minDate}
                maxDate={maxDate}
                onCancel={handleCancel}
                onOk={handleOk}
                readOnly={readOnly}
                cancelButtonText={cancelButtonText}
                submitButtonText={submitButtonText}
                selectedDatesTitle={selectedDatesTitle}
            />

            {/* </DialogContent> */}
            {/* </Dialog> */}
        </Fragment>
    );
};

DatePicker.propTypes = {
    open: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    //onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedDates: PropTypes.array,
    disabledDates: PropTypes.array,
    cancelButtonText: PropTypes.string,
    submitButtonText: PropTypes.string,
    selectedDatesTitle: PropTypes.string,
    datepicker: PropTypes.object,
};

//export default DatePicker

const mapStateToProps = (state) => ({
    datepicker: state.datepicker,
});

export default connect(mapStateToProps, {})(withRouter(DatePicker)); //withRouter allows us to pass history objects
