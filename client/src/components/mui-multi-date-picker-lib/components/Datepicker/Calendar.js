import React, { useRef, useCallback, useState, useEffect } from 'react';
import WeekHeader from './WeekHeader';
import Month from './Month';
import { defaultUtils as utils } from './dateUtils';
import CalendarToolbar from './CalendarToolbar';
import CalendarButtons from './CalendarButtons';
import DateDisplay from './DateDisplay';
// import makeStyles from '@mui/styles/makeStyles';

// const Root = styled.div`
//   color: rgba(0, 0, 0, 0.87);
//   user-select: none;
//   overflow: auto;
//   max-width: 479px:
// `

// const CalendarContainer = styled.div`
//   display: flex;
//   justify-items: space-between;
//   flex-direction: column;
//   font-size: 12px;
//   font-weight: 400;
//   padding: 0px 8px;
//   transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
// `

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flex: '1',
//         display: 'flex',
//         maxHeight: '100%',
//         overflow: 'hidden',
//     },
//     selectorContainer: {
//         // marginTop: theme.spacing(2)
//         // boxShadow: 'inset 0 0 10px #000000'
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//     },
//     calendarContainer: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexDirection: 'column',
//         padding: `0 ${theme.spacing(1)}`,
//     },
// }));

// const StyledCalendar = styled.div`
//   display: flex;
//   flex-direction: column;
// `

const Calendar = ({
    initialDate,
    maxDate,
    minDate,
    selectedDates,
    disabledDates,
    onSelect,
    onCancel,
    onOk,
    readOnly,
    onRemoveAtIndex,
    cancelButtonText,
    submitButtonText,
    selectedDatesTitle,
}) => {
    const calendar = useRef(null);
    // const classes = useStyles();

    const [displayDate, setDisplayDate] = useState(() =>
        utils.getFirstDayOfMonth(initialDate || new Date())
    );

    const handleMonthChange = useCallback(
        (months) => {
            setDisplayDate((displayDate) =>
                utils.addMonths(displayDate, months)
            );
        },
        [setDisplayDate]
    );

    useEffect(() => {
        setDisplayDate(utils.getFirstDayOfMonth(initialDate || new Date()));
    }, [initialDate]);

    maxDate = maxDate || utils.addYears(new Date(), 100);
    minDate = minDate || utils.addYears(new Date(), -100);

    const toolbarInteractions = {
        prevMonth: utils.monthDiff(displayDate, minDate) > 0,
        nextMonth: utils.monthDiff(displayDate, maxDate) < 0,
    };

    return (
        <div
            // className={classes.root}
            className="calendarRoot"
            style={{
                flex: '1',
                display: 'flex',
                maxHeight: '100%',
                overflow: 'hidden',
            }}
        >
            <div
                // className={classes.selectorContainer}
                className="calendarSelectorContainer"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    // className={classes.calendarContainer}
                    className="calendarContainer"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        padding: `0 8px`,
                    }}
                >
                    <CalendarToolbar
                        displayDate={displayDate}
                        onMonthChange={handleMonthChange}
                        prevMonth={toolbarInteractions.prevMonth}
                        nextMonth={toolbarInteractions.nextMonth}
                    />
                    <WeekHeader />
                    <Month
                        displayDate={displayDate}
                        key={displayDate.toDateString()}
                        selectedDates={selectedDates}
                        disabledDates={disabledDates}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSelect={onSelect}
                        readOnly={readOnly}
                        ref={calendar}
                    />
                </div>
                <CalendarButtons
                    readOnly={readOnly}
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelButtonText={cancelButtonText}
                    submitButtonText={submitButtonText}
                />
            </div>
            {/* removed on Aug 26th, 2022 because I'm not using the calendar for multiple dates anymore ~Rusty
            <DateDisplay
                selectedDatesTitle={selectedDatesTitle}
                selectedDates={selectedDates}
                readOnly={readOnly}
                onRemoveAtIndex={onRemoveAtIndex}
            /> */}
        </div>
    );
};

export default Calendar;
