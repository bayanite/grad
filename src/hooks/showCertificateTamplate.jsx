import React, {useState} from 'react';

const useCertificateTemplate = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const addCertificate = async (photo) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('photo', photo);

            const response = await fetch(`${process.env.REACT_APP_API_URL}certificate/create`, {
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
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while adding the template.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificate = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}certificate/index`,
                {
                    headers: {
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

    const deleteCertificate = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}certificate/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to delete course.');
            }
            return true; // Return true to indicate successful deletion
        } catch (error) {
            console.error(error);
            return false; // Return false to indicate failure
        }
    }
    const fetchCertificateUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}certificate/all`,
                {
                    headers: {
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


    return {data, loading, error, addCertificate, fetchCertificate, deleteCertificate, fetchCertificateUser};
};

export default useCertificateTemplate;
