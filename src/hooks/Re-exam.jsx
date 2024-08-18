import React, { useState } from 'react';
import Swal from "sweetalert2";

const ReExam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchOrderReExam = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}reExam/index`,
                { headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error('Failed to fetch certificate');
            }
            const data = await response.json();

            return data;

        } catch (error) {
            setError(error.message || 'An error occurred while fetching the certificates.');
        }
    };

    const checkOrder = async (id_reExam, status) => {
        console.log("id_reExam", id_reExam)
        console.log("status", status)
        setLoading(true);
        setError(null); // Reset error before making a new request

        const formData = new FormData();
        formData.append('status', status);
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}reExam/check/${id_reExam}`, {
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

    return { data, loading, error, fetchOrderReExam ,checkOrder};
};

export default ReExam;
