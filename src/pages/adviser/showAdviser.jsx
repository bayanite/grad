import '../model/model.scss'
import './addAdviser.scss'
import '../courses/view courses/CreateTemplate.scss'
import {FaArrowRight, FaExclamationCircle, FaRegCheckCircle, FaRegTimesCircle} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useLocation} from "react-router-dom";
import UseAdviser from "../../hooks/useAdviser";
import Swal from "sweetalert2";

const ShowAdviser = () => {
    const location = useLocation();
    const id = location.state?.id
    const [infoAdviser, setInfoAdviser] = useState([])
    const [infoAppointments, setInfoAppointments] = useState([])
    const [timeCombinations, setTimeCombinations] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

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
    const {detailsAdviser, getAppointments, deleteDate, checkDate} = UseAdviser();


    // Call function to populate time combinations array
    useEffect(() => {
        populateTimeCombinations();
    }, []);
    useEffect(() => {
        checkServerConnectivity();
        // showAdviser();
    }, []);
    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}adviser/show/${id}`); // Replace with a basic endpoint
            // if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await showAdviser();
        } catch (error) {
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
            setLoading(false); // Stop the loading spinner
        }
    };

    const showAdviser = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await detailsAdviser(id);
            if (!data || !data.result || data.result.length === 0) {
                setError("لا توجد بيانات."); // Handle no data found
            } else {
                setInfoAdviser(data);
            }
        } catch (error) {
            // Catch the error and handle it without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
        } finally {
            setLoading(false);
        }


    }
    const showAppointments = async (date) => {
        try {
            const dataM = await getAppointments(date, id);
            setInfoAppointments(dataM);
        } catch (error) {
            console.error('Error fetching :', error);
        }

    }
    const handleDeleteDate = async (id) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من التراجع عن هذا!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفه!',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            const isDeleted = await deleteDate(id);
            if (isDeleted) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
                // Update course list
                if (selectedDate) {
                    showAppointments(selectedDate);
                }
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'فشل الحذف !',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        }
    }
    const handleCheckDate = async (e, id, statuse) => {

        try {
            // console.log("pppp")
            await checkDate(e, id, statuse);
            if (selectedDate) {
                showAppointments(selectedDate);
            }

        } catch (error) {
            console.error('Error fetching :', error);
        }
    }


    const currentMonthIndex = new Date().getMonth();
    const [month, setMonth] = useState(currentMonthIndex);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);


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

    const handleDayClick = (day, year, month) => {
        setSelectedDay(day);
        const date = year + "-" + month + "-" + day;
        setSelectedDate(date);
        showAppointments(date)
    };


    const renderDays = () => {
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);
        const days = [];

        if (infoAdviser.result && infoAdviser.result.length > 0 && infoAdviser.result[0].date) {
            for (let i = 0; i < firstDay; i++) {
                days.push(<div key={`empty-${i}`} className="day empty"/>);
            }

            for (let i = 1; i <= totalDays; i++) {
                const isActive = !isDateBeforeCurrent(year, month, i);
                const isSelected = isActive && i === selectedDay;
                const isSameDay = infoAdviser.result[0].date.some(day => {
                    const [yearStr, monthStr, dayStr] = day.day.split('-');
                    const infoAdviserYear = parseInt(yearStr, 10);
                    const infoAdviserMonth = parseInt(monthStr, 10);
                    const infoAdviserDay = parseInt(dayStr, 10);
                    return infoAdviserYear === year && infoAdviserMonth === month + 1 && infoAdviserDay === i;
                });

                const handleClick = isActive ? () => handleDayClick(i, year, month + 1) : () => handleDayClick(null);

                days.push(
                    <div
                        key={i}
                        className={`day ${isActive ? '' : 'inactive'} ${isSameDay ? 'info-adviser-day' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={handleClick}
                    >
                        {i} {/* Render the date number */}
                    </div>
                );
            }
        } else {
            for (let i = 0; i < firstDay; i++) {
                days.push(<div key={`empty-${i}`} className="day empty"/>);
            }

            for (let i = 1; i <= totalDays; i++) {
                const isActive = !isDateBeforeCurrent(year, month, i);
                const isSelected = isActive && i === selectedDay;
                const handleClick = isActive ? () => handleDayClick(i) : () => handleDayClick(null);

                days.push(
                    <div
                        key={i}
                        className={`day ${isActive ? '' : 'inactive'} ${isSelected ? 'selected' : ''}`}
                        onClick={handleClick}
                    >
                        {i}
                    </div>
                );
            }
        }

        return days;
    };


    const renderAppointments = () => {
        if (!selectedDay || !infoAppointments.DateGet) return null;
        return infoAppointments.DateGet.map((date, idx) => {
            if (date.reserve.length === 0) {
                return (
                    <div key={idx} className="no-appointments">
                        <div className="nav-up">
                            <FaRegTimesCircle className="FaRegTimesCircle" onClick={() => handleDeleteDate(date.id)}/>
                        </div>
                        <p>{date.from}<span>-</span>{date.to}</p>
                    </div>
                );
            } else {
                return date.reserve.map((appointment, i) => (
                    <div key={i} className={`appointment${appointment.status === "0" ? '1' : ''}`}>
                        {appointment.status === "0" ? (
                            <div>
                                <div className="nav-up">
                                    <FaRegCheckCircle className="FaRegCheckCircle"
                                                      onClick={(e) => handleCheckDate(e, appointment.id, "1")}/>
                                    <FaRegTimesCircle className="FaRegTimesCircle"
                                                      onClick={(e) => handleCheckDate(e, appointment.id, "0")}/>
                                </div>
                                <div>
                                    <h3>{appointment.name}</h3>
                                    <p>{appointment.mobilePhone}</p>
                                    <p>{date.from}<span>-</span>{date.to}</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="nav-up">
                                    <FaRegTimesCircle className="FaRegTimesCircle"
                                                      onClick={() => handleDeleteDate(date.id)}/>
                                </div>
                                <div>
                                    <h3>{appointment.name}</h3>
                                    <p>{appointment.mobilePhone}</p>
                                    <p>{date.from}<span>-</span>{date.to}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ));
            }
        });

    };

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    const infoAdvisers = infoAdviser && infoAdviser.result;

    return (
        <div className="allSection">
            <div>
                <FaArrowRight className="back-go" onClick={handleGoBack}/>
                {/* Back button */}
            </div>

            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/>
                    {/* Correctly closing the spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon"/> {/* Error icon */}
                    <p className="error-message">{error}</p>
                </div>
            ) : (
                <>
                    <div className="section">
                        {infoAdvisers && Array.isArray(infoAdvisers) && infoAdvisers.map((item, index) => (
                            <form key={index} className="containForm">
                                <div className="profile-picture-container">
                                    <label htmlFor="upload-input">
                                        <div className="profile-picture">
                                            <img src={process.env.REACT_APP_API_PATH + "/Uploads/" + item.photo}
                                                 alt="Profile" className="profile-image"/>
                                        </div>
                                    </label>
                                </div>
                                <label>اسم المستشار:</label>
                                <p className="show-details">{item.name}</p>

                                <label>اختصاص المستشار:</label>
                                <p className="show-details">{item.type}</p>

                                <label>نبذة عن المستشار:</label>
                                <p className="show-details-about">{item.about}</p>
                            </form>
                        ))}
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
                        <div className="show-appointment">
                            {renderAppointments()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShowAdviser;