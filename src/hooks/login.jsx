import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
const Login = (setIsAuthenticated) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const login = async (e,nameEmp,passwordEmp) => {
        e.preventDefault(); // Prevent form submission

        // Input validation
        if (!nameEmp || !passwordEmp) {
            setMessage("يرجى ملء جميع البيانات.");
            return message;
        }

        const data = {
            "name": nameEmp,
            "password": passwordEmp,
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log(response.ok)
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    const token = data.token;
                    const role = data.role;
                    const name = data.name;
                    console.log(role)
                    localStorage.setItem('token', token);
                    localStorage.setItem('userRole', role); // Store the user's role
                    localStorage.setItem('userName', name);
                    setIsAuthenticated(true);
                    navigate('/');
                    setMessage("تم");
                    console.log("Token stored in local storage:", token);
                }else{
                    setMessage(data.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات الخاصة بك.");
                }
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات الخاصة بك.");
                console.error("Login failed:", response.statusText);
            }
        } catch (error) {
            setMessage("حدث خطأ. حاول مرة اخرى.");
            console.error(error);
        }
        return message;
    }
    return{login}
};

export default Login;