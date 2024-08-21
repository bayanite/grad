import {useState} from 'react';
import Swal from 'sweetalert2';

const useAddTemplate = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addTemplate = async (name, photo, about, text, teacher) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(); // Use FormData for handling files
            formData.append('name', name); // Append fields to the form data
            formData.append('photo', photo); // Append the file to the form data
            formData.append('about', about);
            formData.append('text', text);
            formData.append('teacher', teacher);

            const response = await fetch(`${process.env.REACT_APP_API_URL}course/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData, // Pass the form data directly as the body
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
                    title: 'تم إضافة الغلاف بنجاح',
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

    return {addTemplate, data, loading, error};
};

export default useAddTemplate;
