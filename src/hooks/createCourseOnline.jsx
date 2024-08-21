import React, {useState} from 'react';
import Swal from "sweetalert2";


const CourseOnline = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Changed initial loading state to false
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const createCourseOnline = async (exam, price, id_form, id_poll, id_prefix, serial, id_course, numberHours, numberVideos, numberQuestion, durationExam, content) => {
        try {
            setLoading(true); // Set loading to true when starting the request

            const formData = new FormData();
            formData.append('exam', exam)
            formData.append('price', price)
            formData.append('id_form', id_form)
            formData.append('id_poll', id_poll)
            formData.append('id_prefix', id_prefix)
            formData.append('serial', serial)
            formData.append('id_course', id_course)
            formData.append('numberHours', numberHours)
            formData.append('numberVideos', numberVideos)
            formData.append('numberQuestion', numberQuestion)
            formData.append('durationExam', durationExam)
            content.forEach((item, index) => {
                formData.append(`content[${index}][photo]`, item.photo);
                formData.append(`content[${index}][name]`, item.name);
                formData.append(`content[${index}][numberHours]`, item.numberHours);
                formData.append(`content[${index}][numberVideos]`, item.numberVideos);
                formData.append(`content[${index}][exam]`, item.exam);
                formData.append(`content[${index}][numberQuestion]`, item.numberQuestion);
                formData.append(`content[${index}][durationExam]`, item.durationExam);

                item.videoFiles.forEach((videoFile, i) => {
                    formData.append(`content[${index}][videoFiles][${i}][name]`, videoFile.name);
                    formData.append(`content[${index}][videoFiles][${i}][video]`, videoFile.video);
                    formData.append(`content[${index}][videoFiles][${i}][id_exam]`, videoFile.id_exam);
                    formData.append(`content[${index}][videoFiles][${i}][duration]`, videoFile.duration);
                });

                // Append each PDF file
                item.pdfFiles.forEach((pdfFile, i) => {
                    formData.append(`content[${index}][pdfFiles][${i}][name]`, pdfFile.name);
                    formData.append(`content[${index}][pdfFiles][${i}][file]`, pdfFile.file);
                });
            });



            const response = await fetch(`${process.env.REACT_APP_API_URL}online/create`, {
                method: 'POST',
                body: formData,

                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();

                setError(errorData.message);
            } else {
                const responseData = await response.json();

                setData(responseData);

                // Show success notification
                await Swal.fire({
                    icon: 'success',
                    title: 'تم الاضافة بنجاح',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while adding the template.");
        } finally {
            setLoading(false);
        }
    };
    const fetchNameCourse = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/indexname`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            const data = await response.json();

            return data;

        } catch (error) {
            setError(error);
        } finally {
        }
    };
    const fetchNameExam = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}exam/index`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },

                });

            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            const data = await response.json();

            return data;

        } catch (error) {
            setError(error);
        } finally {
        }
    };
    const fetchContentCourse = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}online/showContent/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            const data = await response.json();

            return data;

        } catch (error) {
            setError(error);
        } finally {
        }
    };
    return {createCourseOnline, fetchNameCourse, fetchNameExam, fetchContentCourse, data, loading, error};
};

export default CourseOnline;
