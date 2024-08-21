import React from 'react';
import Swal from "sweetalert2";

const UseAdviser = () => {
    const token = localStorage.getItem('token');


    const SendAdviser = async (e, imageAdviser, nameAdviser, specializationAdviser, aboutAdviser, selectedTimesByDay) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("photo", imageAdviser);
        formData.append("name", nameAdviser);
        formData.append("type", specializationAdviser);
        formData.append("about", aboutAdviser);
        formData.append("date", JSON.stringify(selectedTimesByDay));

        try {
            await fetch(`${process.env.REACT_APP_API_URL}adviser/create`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },

            }).then(response => response.json());

        } catch (error) {
            console.error(error)
        }

    };
    const SendDates = async (e, selectedTimesByDay, id) => {
        e.preventDefault();

        const data = {
            "date": selectedTimesByDay,
        }

        try {
            await fetch(`${process.env.REACT_APP_API_URL}date/create/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

                body: JSON.stringify(data)

            }).then(response => response.json());

        } catch (error) {
            console.error(error)
        }
    };

    const deleteAdviser = async (e, id) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}adviser/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }
            return true
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    const fetchAdvisers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}adviser/index`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const detailsAdviser = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}adviser/show/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }

    };

    const getAppointments = async (date, id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}date/showday/${id}/${date}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };
    const deleteDate = async (id) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}date/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }
            return true
        } catch (error) {
            console.error(error);
        }

    }

    const checkDate = async (e, id, statuse) => {
        e.preventDefault()
        const data = {
            'id': id,
            'status': statuse
        }
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}reserve/check`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            } else {
                if (statuse === "1") {
                    await Swal.fire({
                        icon: 'success',
                        title: 'تم القبول بنجاح',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else if (statuse === "0") {
                    await Swal.fire({
                        icon: 'success',
                        title: 'تم الرفض بنجاح',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }


    }

    return {
        SendAdviser,
        SendDates,
        fetchAdvisers,
        deleteAdviser,
        detailsAdviser,
        getAppointments,
        deleteDate,
        checkDate
    };
};

export default UseAdviser;