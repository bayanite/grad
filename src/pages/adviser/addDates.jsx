
import React, {useEffect, useState} from 'react';
import '../courses/view courses/CreateTemplate.scss';
import {IoClose} from "react-icons/io5";
import {FaCamera} from 'react-icons/fa';
import {FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp} from "react-icons/fi";
import UseAdviser from "../../hooks/useAdviser";

const AddDates = ({onClose,name,id}) => {
    const [nameAdviser, setNameAdviser] = useState(name);

    const {SendDates} = UseAdviser();

    const handleSubmit = async (e) => {
        try {
            setLoading(true); // Start the loading state
            await SendDates(e,selectedTimesByDay,id);

        } catch (error) {
            console.error('Error adding template:', error);
        }finally {
            setLoading(false); // End the loading state
        }
        onClose();
    };

    const [timeCombinations, setTimeCombinations] = useState({});
    const [selectedTimesByDay, setSelectedTimesByDay] = useState([]);
    const [loading, setLoading] = useState(false); // New loading state
    console.log("selectedTimesByDay",selectedTimesByDay)

    // Populate time combinations array
    const populateTimeCombinations = () => {
        const combinations = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute +=15) {
                const formattedHour = hour < 10 ?  "0" +hour : hour;
                const formattedMinute = minute < 10 ? "0" + minute : minute;
                combinations.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        setTimeCombinations(combinations);
    };

    // Call function to populate time combinations array
    useEffect(() => {
        populateTimeCombinations();
    }, []);


    const getSelectedTimesForDay = (day, month, year) => {
        const date = year + "-" + month + "-" + day;
        return selectedTimesByDay.find((item) => item.day === date)?.times || [];
    };

    const currentMonthIndex = new Date().getMonth();
    console.log("currentMonthIndex",currentMonthIndex)
    const [month, setMonth] = useState(currentMonthIndex);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    // const [selectedTime, setSelectedTime] = useState([]);

    console.log("selectedDay",selectedDay);
    console.log("month",month);
    console.log("year",year);
    // console.log("selectedTime",selectedTimesByDay);

    const monthNamesArabic = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const daysOfWeekArabic = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    console.log("lllll",currentMonth)
    const currentDay = currentDate.getDate();

// Check if a given date is before the current date
    const isDateBeforeCurrent = (year, month, day) => {
        return year < currentYear ||
            (year === currentYear && month < currentMonth) ||
            (year === currentYear && month === currentMonth && day < currentDay);
    };
    const handleDayClick = (day) => {
        setSelectedDay(day);
    };
    const renderDays = () => {
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="day empty" />);
        }

        for (let i = 1; i <= totalDays; i++) {
            const isActive = !isDateBeforeCurrent(year, month, i); // Check if date is active
            const isSelected =isActive && i === selectedDay; // Check if date is selected
            const handleClick = isActive ? () => handleDayClick(i) : () => handleDayClick(null); // Conditionally assign onClick handler
            days.push(
                <div
                    key={i}
                    className={`day ${isActive ? '' : 'inactive'} ${isSelected ? 'selected' : ''}`} // Apply selected class if date is selected
                    onClick={handleClick} // Assign onClick handler conditionally
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const handleTimeClickForDay = (day, month, year, time) => {
        const date =  year + "-" + month + "-" + day;

        setSelectedTimesByDay((prevState) => {
            // Deep copy of the state array
            const updatedSelectedTimes = JSON.parse(JSON.stringify(prevState));

            // Check if the day already has selected times
            const existingDayIndex = updatedSelectedTimes.findIndex((item) => item.day === date);

            if (existingDayIndex !== -1) {
                // If the day already has selected times, update the time ranges
                const existingRanges = updatedSelectedTimes[existingDayIndex].times;

                const indexFrom = existingRanges.findIndex((range) => range.from === time);
                const indexTo = existingRanges.findIndex((range) => range.to === time);
                const isBetweenRanges = existingRanges.some((range) => range.from < time && range.to > time);

                if (indexFrom !== -1 && indexTo !== -1) {
                    // Remove the entire range if the time slot is part of both 'from' and 'to' times
                    updatedSelectedTimes[existingDayIndex].times = existingRanges.filter(
                        (range) => range.from !== time && range.to !== time
                    );
                } else if (indexFrom !== -1 || isBetweenRanges) {
                    // Remove only the range if the time slot is part of an existing range as 'from' or between 'from' and 'to'
                    updatedSelectedTimes[existingDayIndex].times = existingRanges.filter((range) => range.from !== time);
                } else if (indexTo !== -1) {
                    // Remove only the 'to' time if the time slot is part of an existing range as 'to'
                    updatedSelectedTimes[existingDayIndex].times = existingRanges.filter((range) => range.to !== time);
                } else {
                    // Add a new range if the time slot is not part of any existing range
                    const lastRange = existingRanges.length > 0 ? existingRanges[existingRanges.length - 1] : null;

                    if (lastRange && lastRange.to === null && lastRange.from < time) {
                        // Update the 'to' time if the last range is incomplete
                        updatedSelectedTimes[existingDayIndex].times = existingRanges.map((range) =>
                            range === lastRange ? { ...range, to: time } : range
                        );
                    }  else if (!lastRange || lastRange.to !== null) {
                        // If there is no last range or it is complete, add a new range
                        const newTimeRange = { from: time, to: null };
                        updatedSelectedTimes[existingDayIndex].times.push(newTimeRange);
                    }

                }
            } else {
                // Create a new entry if no selected times exist for the day
                updatedSelectedTimes.push({ day: date, times: [{ from: time, to: null }] });
            }

            return updatedSelectedTimes;
        });
    };
    const isSaveButtonEnabled = () => {
        if (selectedDay === null) return false;

        const selectedTimes = getSelectedTimesForDay(selectedDay, month + 1, year);
        return selectedTimes.some((range) => range.from !== null && range.to !== null);

    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <nav className="popup-navbar">
                    <h5>{nameAdviser}</h5>
                    <IoClose className={"IoClose"} onClick={onClose}/>
                </nav>
                <form>
                <div className="calendar pop">
                    <div className="header">
                        <FiChevronRight  className="prev" onClick={handleNextMonth}/>
                        <label>{monthNamesArabic[month]} {year}</label>
                        <FiChevronLeft  className="next" onClick={handlePrevMonth}/>
                    </div>
                    <div className="weekdays">
                        {daysOfWeekArabic.map((day, index) => (
                            <div key={index} className="weekday">{day}</div>
                        ))}
                    </div>
                    <div className="days pop">
                        {renderDays()}
                    </div>
                </div>
                        {selectedDay !== null && (
                            <div className="time-picker pop">
                                <div className="time-container-pop ">
                                    {timeCombinations.map((time, index) => {
                                        const isBetweenRanges = getSelectedTimesForDay(selectedDay,month+1,year).some(
                                            (range) => range.from < time && range.to > time
                                        );
                                        const isSelected = getSelectedTimesForDay(selectedDay,month+1,year).some(
                                            (range) => range.from === time || range.to === time
                                        );
                                        const className = isSelected
                                            ? "selected-time"
                                            : isBetweenRanges
                                                ? "non-clickable-time"
                                                : "unselected-time";

                                        return (
                                            <div
                                                key={index}
                                                className={`time-pop ${className}`}
                                                onClick={() => handleTimeClickForDay(selectedDay,month+1,year,time)}
                                            >
                                                {isBetweenRanges && <div className={"display-div-pop"} />}
                                                {time}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        )}
                    <div style={{display: 'flex',justifyContent: 'flex-end', marginRight: '190px'}}>
                        <button style={{ marginTop: '50px'}} type="submit"
                                onClick={(e)=>handleSubmit(e)}
                                disabled={!isSaveButtonEnabled()} // Disable the button if conditions are not met
                        >
                            {loading ? (
                                <div className="loading-indicator">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </div>
                            ) : (
                                "حفظ"
                            )}
                        </button>
                        <button  style={{ marginTop: '50px'}} type="button"
                                 onClick={onClose}>
                            إلغاء
                        </button>
                    </div>
                    </form>
            </div>
        </div>
    );
};

export default AddDates;

