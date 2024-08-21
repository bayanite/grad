import '../model/model.scss'
import './addAdviser.scss'
import '../courses/view courses/CreateTemplate.scss'
import {FaArrowRight, FaCamera} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp} from "react-icons/fi";
import UseAdviser from "../../hooks/useAdviser";
import {useNavigate} from 'react-router-dom';

const AddAdviser = () => {
    const [imageAdviser, setImageAdviser] = useState(null);
    const [nameAdviser, setNameAdviser] = useState('');
    const [specializationAdviser, setSpecializationAdviser] = useState('قانونية');
    const [aboutAdviser, setAboutAdviser] = useState('');
    const [selectedTimesByDay, setSelectedTimesByDay] = useState([]);
    const [loading1, setLoading1] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImageAdviser(selectedImage);
    };

    const [timeCombinations, setTimeCombinations] = useState({});

    // Populate time combinations array
    const populateTimeCombinations = () => {
        const combinations = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const formattedHour = hour < 10 ? "0" + hour : hour;
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

    const scrollToTop = () => {
        const timeContainer = document.querySelector(".time-container");
        if (timeContainer) {
            // Scroll to the top of the container
            timeContainer.scrollTop = timeContainer.clientHeight - timeContainer.scrollHeight;
        }
    };

    const scrollToBottom = () => {
        const timeContainer = document.querySelector(".time-container");
        if (timeContainer) {
            // Scroll to the maximum scroll height, which will be the bottom
            timeContainer.scrollTop = timeContainer.scrollHeight - timeContainer.clientHeight;
        }
    };
    const currentMonthIndex = new Date().getMonth();
    const [month, setMonth] = useState(currentMonthIndex);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    // const [selectedTime, setSelectedTime] = useState([]);



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

    const handleTimeClickForDay = (day, month, year, time) => {
        const date = year + "-" + month + "-" + day;

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
                            range === lastRange ? {...range, to: time} : range
                        );
                    } else if (!lastRange || lastRange.to !== null) {
                        // If there is no last range or it is complete, add a new range
                        const newTimeRange = {from: time, to: null};
                        updatedSelectedTimes[existingDayIndex].times.push(newTimeRange);
                    }

                }
            } else {
                // Create a new entry if no selected times exist for the day
                updatedSelectedTimes.push({day: date, times: [{from: time, to: null}]});
            }

            return updatedSelectedTimes;
        });
    };


    // Function to get the selected times for a specific day
    const getSelectedTimesForDay = (day, month, year) => {
        const date = year + "-" + month + "-" + day;
        return selectedTimesByDay.find((item) => item.day === date)?.times || [];
    };


    const renderDays = () => {
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="day empty"/>);
        }

        for (let i = 1; i <= totalDays; i++) {
            const isActive = !isDateBeforeCurrent(year, month, i); // Check if date is active
            const isSelected = isActive && i === selectedDay; // Check if date is selected
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

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    const {SendAdviser} = UseAdviser();

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!imageAdviser || !nameAdviser || !specializationAdviser || !aboutAdviser) {
            alert('الرجاء تعبئة جميع الحقول');
            return;
        }
        try {
            setLoading1(true); // Start the loading state
            await SendAdviser(e, imageAdviser, nameAdviser, specializationAdviser, aboutAdviser, selectedTimesByDay);
            handleGoBack(); // Navigate back to the previous page
        } catch (error) {
            console.error('Error adding template:', error);
        } finally {
            setLoading1(false); // End the loading state
        }
    };
    return (
        <div className={"allSection"}>
            <div>
                <FaArrowRight className="back-go" onClick={handleGoBack}/>
                {/* Back button */}
            </div>
            <div className="section">
                <form className={"containForm"}>
                    <div className="profile-picture-container">
                        <label htmlFor="upload-input">
                            <div className="profile-picture">
                                {imageAdviser ? (
                                    <img src={URL.createObjectURL(imageAdviser)} alt="Profile"
                                         className="profile-image"/>
                                ) : (
                                    <div className="default-profile-image">
                                        <FaCamera className="camera-icon"/>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="upload-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{display: 'none'}}
                        />
                    </div>
                    <label>
                        اسم المستشار:
                        <input
                            type="text"
                            value={nameAdviser}
                            onChange={(e) => setNameAdviser(e.target.value)}
                        />
                    </label>
                    <label>
                        اختصاص المستشار:
                        <select
                            value={specializationAdviser}
                            onChange={(e) => setSpecializationAdviser(e.target.value)}>
                            <option>قانونية</option>
                            <option>أسرية</option>
                            <option>نفسية</option>
                        </select>
                    </label>
                    <label>
                        نبذة عن المستشار:
                        <textarea className={"about1"}
                                  value={aboutAdviser}
                                  onChange={(e) => setAboutAdviser(e.target.value)}
                        />
                    </label>

                </form>
                <button className={"save1"} onClick={(e) => handleUpload(e)}>
                    {loading1 ? (
                        <div className="loading-indicator">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>
                    ) : (
                        "حفظ"
                    )}
                </button>
            </div>

            <div className="section">
                <div className="calendar">
                    <div className="header">
                        <FiChevronRight className="prev" onClick={handleNextMonth}/>
                        <label>{monthNamesArabic[month]} {year}</label>
                        <FiChevronLeft className="next" onClick={handlePrevMonth}/>
                    </div>
                    <div className="weekdays">
                        {daysOfWeekArabic.map((day, index) => (
                            <div key={index} className="weekday">{day}</div>
                        ))}
                    </div>
                    <div className="days">
                        {renderDays()}
                    </div>
                </div>
            </div>

            <div className="section">
                {selectedDay !== null && (
                    <div className="time-picker">
                        <div className="scroll-arrow up" onClick={() => scrollToTop()}>
                            <FiChevronUp className="scroll-icon"/>
                        </div>
                        <div className="time-container">
                            {timeCombinations.map((time, index) => {
                                const isBetweenRanges = getSelectedTimesForDay(selectedDay, month + 1, year).some(
                                    (range) => range.from < time && range.to > time
                                );
                                const isSelected = getSelectedTimesForDay(selectedDay, month + 1, year).some(
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
                                        className={`time ${className}`}
                                        onClick={() => handleTimeClickForDay(selectedDay, month + 1, year, time)}
                                    >
                                        {isBetweenRanges && <div className={"display-div"}/>}
                                        {time}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="scroll-arrow down" onClick={() => scrollToBottom()}>
                            <FiChevronDown className="scroll-icon"/>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};
export default AddAdviser;