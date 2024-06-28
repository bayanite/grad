import React, { useState } from 'react';

const Model = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchForm = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/indexname/${type}`,
                { headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            setData(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error); // Log the error
            setError(error.message || 'An error occurred while fetching the data.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { error, loading, data, fetchForm };
};

export default Model;
