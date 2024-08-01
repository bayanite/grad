import React, { useState } from 'react';
import './style.scss';
import { FaLock, FaLockOpen, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Login from "../../hooks/login";

const SignInUp = ({ setIsAuthenticated }) => {
    const [nameEmp, setNameEmp] = useState('');
    const [passwordEmp, setPasswordEmp] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
     const {login}=Login(setIsAuthenticated);

    const signIn =async (e)=>{
        try {
          const mes= await login(e,nameEmp,passwordEmp);
            setErrorMessage(mes);
        } catch (error) {
            console.error('Error adding template:', error);
        }
    }

    return (
        <div className="container1">
            <div className="forms-container">
                <div className="signin-signup">
                    <form action="#" className="form1 sign-in-form" onSubmit={signIn}>
                        <h2 className="title1">تسجيل الدخول</h2>
                        <div className="input-field">
                            <FaUser className="icon" />
                            <input
                                type="text"
                                placeholder="اسم المستخدم"
                                onChange={(e) => setNameEmp(e.target.value)}
                            />
                        </div>
                        <div className="input-field">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="كلمة المرور"
                                onChange={(e) => setPasswordEmp(e.target.value)}
                            />
                            {isPasswordVisible ? (
                                <FaLockOpen className="icon" onClick={togglePasswordVisibility} />
                            ) : (
                                <FaLock className="icon" onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input type="submit" value="تسجيل دخول" className="btn solid" />
                    </form>
                </div>
            </div>
            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content1">
                        <h3>مرحبًا بعودتك</h3>
                        <p> لتبقى على اتصال معنا يرجى ادخال معلوماتك لتسجيل الدخول. </p>
                    </div>
                    <img src={"/images/log.svg"} className="image" alt="" />
                </div>
            </div>
        </div>
    );
};

export default SignInUp;
