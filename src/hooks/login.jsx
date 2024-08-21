import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getFCMToken} from '../firebase'; // Import the function to get the FCM token


const Login = (setIsAuthenticated) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const sendFCMTokenToBackend = async (fcmToken, authToken) => {
        const data = {
            "fcm_token": fcmToken,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/fcmtoken`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('FCM Token sent successfully.');
            } else {
                console.error('Failed to send FCM Token:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending FCM Token:', error);
        }
    };
    const login = async (e, nameEmp, passwordEmp) => {
        e.preventDefault(); // Prevent form submission

        // Input validation
        if (!nameEmp || !passwordEmp) {
            setMessage("يرجى ملء جميع البيانات.");
            return;
        }

        const data = {
            "name": nameEmp,
            "password": passwordEmp,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    const token = data.token;
                    const role = data.role;
                    const name = data.name;

                    // Store user details in localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('userRole', role); // Store the user's role
                    localStorage.setItem('userName', name);
                    setIsAuthenticated(true);
                    const fcmToken = await getFCMToken();
                    if (fcmToken) {
                        await sendFCMTokenToBackend(fcmToken, token);
                    }
                    navigate('/');
                    setMessage("تم");
                    console.log("Token stored in local storage:", token);
                    // Get FCM token and send it to the backend

                } else {
                    setMessage(data.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات الخاصة بك.");
                }
            } else {
                const errorData = await response.json();
                setMessage(errorData.errors.data);
            }
        } catch (error) {
            setMessage("حدث خطأ. حاول مرة اخرى.");
        }
        return message;
    }


    return {
        login,
    };
};

export default Login;