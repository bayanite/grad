import { useState } from 'react';
import Swal from 'sweetalert2';

const useEditTemplate = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editCourse = async (id, name, photo, about, text, teacher) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(); // Use FormData for handling files
            formData.append('name', name); // Append fields to the form data
            formData.append('photo', photo); // Append the file to the form data
            formData.append('about', about);
            formData.append('text', text);
            formData.append('teacher', teacher);

            let url = `${process.env.REACT_APP_API_URL}course/index`;
            let method = 'GET';

            if (id) {
                // If id is provided, we are editing an existing course
                url = `${process.env.REACT_APP_API_URL}course/update/${id}`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }); // Pass the form data directly as the body

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
            } else {
                const responseData = await response.json();
                setData(responseData);

                // Show success notification
                await Swal.fire({
                    icon: 'success',
                    title: 'تم تعديل البيانات بنجاح',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error(error);
            setError("حدث خطأ أثناء تعديل البيانات.");
        } finally {
            setLoading(false);
        }
    };

    return { editCourse, data, loading, error };
};

export default useEditTemplate;
