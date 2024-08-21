import React, {useState} from 'react';
import Swal from "sweetalert2";

const CourseCenter = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Changed initial loading state to false
    const [error, setError] = useState(null);

    const createCourseCenter = async (start, end, numberHours, numberContents, id_course, id_form, id_poll, price) => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true); // Set loading to true when starting the request

            const courseData = {
                price: price,
                id_form: id_form,
                id_poll: id_poll,
                id_course: id_course,
                numberHours: numberHours,
                numberContents: numberContents,
                start: start,
                end: end
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}center/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                    'Authorization': `Bearer ${token}`,

                },
                body: JSON.stringify(courseData) // Stringify the JSON data
            });

            if (!response.ok) {
                throw new Error('Failed to create course center');
            }

            const responseData = await response.json();
            setData(responseData);

            // Show a success message
            await Swal.fire({
                icon: 'success',
                title: 'تم الاضافة بنجاح',
                showConfirmButton: false,
                timer: 1500
            });

        } catch (error) {
            console.error(error);

            // Show an error message
            await Swal.fire({
                icon: 'error',
                title: 'حدث خطأ',
                showConfirmButton: false,
                timer: 1500,
                text: error.message || 'An error occurred while creating the course center.',
            });
        } finally {
            setLoading(false); // Set loading to false after request is completed
        }
    };
    return {createCourseCenter, data, loading, error};
};

export default CourseCenter;

