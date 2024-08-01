import {useState} from 'react';
import Swal from "sweetalert2";

const DashboardApi = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const count = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,

                    },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch count');
            }
            const data = await response.json();

            return data;
        } catch (error) {
            setError(error);
        }
    };

    const PieChart = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}proportion`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch pie chart data');
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            setError(error);
        }
    };

    const appointments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}advisernow`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            setError(error);
        }
    };

    const statistics = async (year) => {
        try {
            console.log("year",year)
            const response = await fetch(`${process.env.REACT_APP_API_URL}statistic/${year}`, {
                method: 'GET',

                headers: {
                    'Authorization': `Bearer ${token}`,

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            const data = await response.json();
            console.log("ffff",data)
            return data;
        } catch (error) {
            setError(error);
        }
    };

    return {
        count,
        PieChart,
        statistics,
        appointments
    };
};

export default DashboardApi;