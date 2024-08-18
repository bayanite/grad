import './App.css'
import './assets/Font.css';
import {FaBell, FaInfoCircle, FaSignOutAlt, FaUser} from "react-icons/fa";
import Spinner from "react-spinner-material";
import {MdQuiz} from "react-icons/md";
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Sidebar from "./sidebar/Sidebar";
import Courses from "./pages/courses/view courses/courses";
import DashboardPage from "./pages/dashboard/Dashboard";
import ShowCopy from './pages/courses/show-copy/ShowCopy';
import AddOnlineCourse from './pages/courses/add-online-courses/AddOnlineCourse'; // Replace with your actual component
import AnnounceCourse from './pages/courses/announce-course/AnnounceCourse';
import ContentOnlineCourses from './pages/courses/add-online-courses/content-online-courses/ContentOnlineCourses';
import ShowAccount from './pages/mangmentAccount/showAccount';
import ShowAnswer from './pages/formCours/showAnswer';
import Review from './pages/formCours/review';
import Model from "./pages/model/model";
import AddModel from "./pages/model/addModel";
import ShowModel from "./pages/model/showModel";
import Bank from "./pages/questionBank/bank";
import AddBank from "./pages/questionBank/addBank";
import ShowBank from "./pages/questionBank/showBank";
import Adviser from "./pages/adviser/adviser";
import AddAdviser from "./pages/adviser/addAdviser";
import ShowAdviser from "./pages/adviser/showAdviser";
import SignInUp from "./pages/Sign_in_up/sign_in_up";
import React, {useEffect, useState} from "react";
import ShowRegistered from './pages/courses/show-registered/ShowRegistered';
import UserSetting from "./pages/setting-user/user";
import Re_exam from "./pages/Re-exam/Re-exam";
import ShowCertificate from "./pages/certificate/ShowCertificate";
import ShowTamplate from "./pages/certificate/ShowTamplate";
import DetailsCopyOnline from "./pages/courses/detailsCopy/detailsCopyOnline";
import DetailsCopyCenter from "./pages/courses/detailsCopy/detailsCopyCenter";
import Setting from './setting';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [settingVisible, setSettingVisible] = useState(false);  // State to control the visibility of the Setting component
    const navigate = useNavigate(); // Make sure this is within the functional component

    useEffect(() => {
        // Check if token exists in local storage
        //localStorage.clear();
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        if (token) {
            setIsAuthenticated(true);
            setUserName(name);
        }
        setLoading(false);
    }, []);

    const handelShowOrder = () => {
        navigate("/Re-exam/Re-exam");
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner size={120} visible={true}/>
            </div>
        ); // or a loading spinner
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };


// Initialize Firebase


    return (
        <div className="main">
            {isAuthenticated ? (
                <>
                    <Sidebar setIsAuthenticated={setIsAuthenticated}/>
                    <div className="container">
                        <div className="sub-container1">
                            <div className="icon-container">
                                <MdQuiz className="icon_main brown" onClick={handelShowOrder}/>
                                <span className="tooltip-text">طلبات الامتحان</span>
                            </div>
                            <div className="icon-container">
                                <FaSignOutAlt className="icon_main brown" onClick={handleLogout}/>
                                <span className="tooltip-text">تسجيل الخروج</span>
                            </div>
                            <div className="icon-container"
                                 onClick={() => setSettingVisible(true)}>  {/* Toggle setting visibility */}
                                <FaInfoCircle className="icon_main brown"/>
                                <span className="tooltip-text">حول</span>
                            </div>

                            <div className="icon-container">
                                <FaUser className="icon_main brown"/>
                                <span className="tooltip-text">{userName}</span>
                            </div>
                        </div>
                        <div className="sub-container">
                            <Routes>
                                <Route index element={<DashboardPage/>}/>
                                <Route path="/courses" element={<Courses/>}/>
                                <Route path="/users" element={<UserSetting/>}/>
                                <Route path="/adviser" element={<Adviser/>}/>
                                <Route path="/model" element={<Model/>}/>
                                <Route path="/certificate" element={<ShowCertificate/>}/>
                                <Route path="/questionBank" element={<Bank/>}/>
                                <Route path="/stats" element={<ShowAccount/>}/>

                                <Route path="/courses/show-copy/ShowCopy" element={<ShowCopy/>}/>
                                <Route path="/courses/show-registered/ShowRegistered" element={<ShowRegistered/>}/>

                                <Route path="/courses/announce-course/AnnounceCourse" element={<AnnounceCourse/>}/>
                                <Route path="/courses/add-online-courses/AddOnlineCourse" element={<AddOnlineCourse/>}/>
                                <Route path="/courses/add-online-courses/content-online-courses/ContentOnlineCourses"
                                       element={<ContentOnlineCourses/>}/>

                                <Route path="/courses/dashboard" element={<DashboardPage/>}/>

                                <Route path="/model/AddModel" element={<AddModel/>}/>
                                <Route path="/model/ShowModel" element={<ShowModel/>}/>
                                <Route path="/questionBank/AddBank" element={<AddBank/>}/>
                                <Route path="/questionBank/ShowBank" element={<ShowBank/>}/>

                                <Route path="/adviser/addAdviser" element={<AddAdviser/>}/>
                                <Route path="/adviser/showAdviser" element={<ShowAdviser/>}/>

                                <Route path="/certificate/ShowTamplate" element={<ShowTamplate/>}/>
                                {/*<Route path="/model/questionnaire/questionnaire" element={<Showqus/>}/>*/}
                                <Route path="/courses/detailsCopy/detailsCopyOnline" element={<DetailsCopyOnline/>}/>
                                <Route path="/courses/detailsCopy/detailsCopyCenter" element={<DetailsCopyCenter/>}/>
                                <Route path="/users/showForm" element={<ShowAnswer/>}/>
                                <Route path="/users/showReview" element={<Review/>}/>
                                <Route path="/Re-exam/Re-exam" element={<Re_exam/>}/>
                            </Routes>
                        </div>
                    </div>
                    <Setting visible={settingVisible}
                             onClose={() => setSettingVisible(false)}/> {/* Render Setting component */}
                </>
            ) : (
                <SignInUp setIsAuthenticated={setIsAuthenticated}/>
            )}
        </div>
    );
}

const AppWrapper = () => (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

export default AppWrapper;
