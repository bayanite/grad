import {useState} from 'react';
import Swal from 'sweetalert2';

const CopyHooks = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const fetchCopy = async (id) => {

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/displayCopy/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch copy');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };
    const fetchInfoOnlineCopy = async (id) => {

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/detailsOnlineCopy/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            if (!response.ok) {
                throw new Error('Failed to fetch copy');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };
    const fetchInfoCenterCopy = async (id) => {

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/detailsCenterCopy/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            if (!response.ok) {
                throw new Error('Failed to fetch copy');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };


    const fetchRegister = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}booking/indexOk/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            setError(error.message || 'An error occurred while fetching the user.');
            throw error; // Re-throw the error so it can be caught in the calling function
        }
    };

    const deleteCopy = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/deleteCopy/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to delete course.');
            }
            return responseData; // Return true to indicate successful deletion
        } catch (error) {
            console.error(error);
            return false; // Return false to indicate failure
        }
    }

    const activationCopy = async (id, isopen) => {

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('isopen', isopen);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/activateCopy/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                throw new Error(errorData.message);
            }

            const responseData = await response.json();

            setData(responseData);

            // Show success message based on the isopen
            if (isopen === '1') {
                await Swal.fire({
                    icon: 'success',
                    title: 'تم التفعيل بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
            } else if (isopen === '0') {
                await Swal.fire({
                    icon: 'success',
                    title: 'تم الغاء التفعيل بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while updating the user isopen.");
            await Swal.fire({
                icon: 'error',
                title: 'حدث خطأ',
                text: 'An error occurred while updating the user isopen.',
            });
        } finally {
            setLoading(false);
        }
    };
    const saveMark = async (id_book, mark) => {
        const formData = new FormData();
        formData.append('mark', mark);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}exam/addMark/${id_book}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to save mark');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving mark', error);
            throw error;
        }
    };

    return {
        error,
        fetchCopy,
        fetchInfoOnlineCopy,
        fetchInfoCenterCopy,
        activationCopy,
        fetchRegister,
        deleteCopy,
        saveMark
    };
};

export default CopyHooks;
