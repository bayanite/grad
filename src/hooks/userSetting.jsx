import React, {useState, useEffect} from 'react';
import Swal from "sweetalert2";

const useSetting = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');

    console.log("API URL:", process.env.REACT_APP_API_URL);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}booking/indexNew`,
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



    const checkUser = async (id, status) => {
        console.log("id", id)
        console.log("status", status)
        setLoading(true);
        setError(null); // Reset error before making a new request

        const formData = new FormData();
        formData.append('status', status);
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}booking/check/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData // Stringify the JSON data
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                throw new Error(errorData.message);
            } else {
                const responseData = await response.json();
                console.log("hhhhhhh", responseData)
                console.log("ffffffffffff", data)
                setData(responseData);

                // Show success message based on the status
                if (status === 1) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'تم القبول بنجاح',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else if (status === 0) {
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
            setError("An error occurred while updating the user status.");
            await Swal.fire({
                icon: 'error',
                title: 'حدث خطأ',
                text: 'An error occurred while updating the user status.',
            });
        } finally {
            setLoading(false);
        }
    };

    return {error, loading, data, fetchUser, checkUser};
};

export default useSetting;
