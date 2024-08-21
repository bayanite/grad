import {useState} from 'react';

const useGetCourses = () => {
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchCourses = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/index`,
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
    const fetchCopy = async (id) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}course/displayCopy/${id}`,
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
            setError(error);
        } finally {
        }
    };
    return {error, fetchCourses, fetchCopy};
};

export default useGetCourses;