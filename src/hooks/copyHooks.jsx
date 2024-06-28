import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';

const CopyHooks = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const fetchCopy = async (id) => {
        console.log("fetchCopy");

        console.log("idddddddd", id);
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
            console.log("eeeeeeeeeee", JSON.stringify(data));
            return data;
        } catch (error) {
            setError(error.message);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchInfoOnlineCopy = async (id) => {
        console.log("fetchInfoOnlineCopy");

        console.log("idddddddd", id);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/detailsOnlineCopy/${id}`,
                { headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
            if (!response.ok) {
                throw new Error('Failed to fetch copy');
            }
            const data = await response.json();
            console.log("eeeeeeeeeee", JSON.stringify(data));
            return data;
        } catch (error) {
            setError(error.message);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchInfoCenterCopy = async (id) => {
        console.log("fetchInfoCenterCopy");

        console.log("idddddddd", id);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/detailsCenterCopy/${id}`,
                { headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            if (!response.ok) {
                throw new Error('Failed to fetch copy');
            }
            const data = await response.json();
            console.log("eeeeeeeeeee", JSON.stringify(data));
            return data;
        } catch (error) {
            setError(error.message);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };


    const fetchRegister = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}booking/indexOk/${id}`,
                { headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log("Data received:", JSON.stringify(data));

            return data;
        } catch (error) {
            setError(error.message || 'An error occurred while fetching the user.');
            throw error; // Re-throw the error so it can be caught in the calling function
        }
    };

    const deleteCopy = async (id) => {
        console.log("gggggggg", id)
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
            console.log("-----------------", responseData)

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
        console.log("id", id);
        console.log("isopen", isopen);
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
            console.log("hhhhhhh", responseData);
            console.log("ffffffffffff", data);
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

    return {error, fetchCopy,fetchInfoOnlineCopy,fetchInfoCenterCopy, activationCopy, fetchRegister, deleteCopy};
};

export default CopyHooks;
