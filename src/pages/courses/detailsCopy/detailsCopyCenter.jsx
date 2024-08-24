import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import CopyHooks from "../../../hooks/copyHooks";
import {FaArrowRight, FaExclamationCircle, FaFileAlt} from "react-icons/fa";
import './detailsCopyCenter.scss';

const DetailsCopyCenter = () => {
    const {fetchInfoCenterCopy} = CopyHooks();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const id = location.state?.id;
    const date = location.state?.date;

    const [centerInfo, setCenterInfo] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(null); // State for handling "no data" message

    const handlePrevious = () => {
        navigate(-1);
    };

    const getInfoCenter = async () => {
        try {
            const data = await fetchInfoCenterCopy(id);

            if (data && data.data && data.data.length > 0) {
                setCenterInfo(data.data[0]); // Assuming data.data is an array with one object
                setNoData(null);
            } else if (data && data.data.length === 0) {
                setNoData('لا توجد بيانات لعرضها');
            } else {
                setError('فشل الاتصال بالخادم !');
            }
        } catch (error) {
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت !');
            } else {
                setError('فشل الاتصال بالخادم !');
            }
        } finally {
            setLoading(false); // Ensure loading state is reset regardless of success or failure
        }
    };

    useEffect(() => {
        if (id) {
            getInfoCenter();
        }
    }, [id]);

    // Helper function to format dates safely
    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('en-GB') : 'Invalid Date';
    };

    return (
        <div className="AddOnlineCourse">
            <div className='ShowCopy-navbar-'>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                <p>نسخة {formatDate(date)}</p>
            </div>
            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/>
                    {/* Loading spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon"/> {/* Error icon */}
                    <p className="error-message-">{error}</p>
                </div>
            ) : noData ? (
                <div className="spinner-container2">
                    <p className="error-message-">{noData}</p>
                </div>
            ) : centerInfo ? (
                <div className={'AddOnlineCourse_container'}>
                    <div className={"AddOnlineCourse_Content"}>
                        <div className={'AddOnlineCourse_input_info'}>
                            <p>بداية التسجيل :</p>
                            <div className={"data-center"}>
                                {formatDate(centerInfo.start)}
                            </div>
                            <p>نهاية التسجيل :</p>
                            <div className={"data-center"}>
                                {formatDate(centerInfo.end)}
                            </div>
                            <p>عدد المحاضرات :</p>
                            <div className={"data-center"}>
                                {centerInfo.numberContents || 'غير متوفر'}
                            </div>
                            <p>عدد الساعات التدريبية :</p>
                            <div className={"data-center"}>
                                {centerInfo.numberHours || 'غير متوفر'}
                            </div>
                        </div>
                    </div>

                    <div className="AddOnlineCourse_Button">
                        <div>
                            <div className="Form_Button-show">
                                <FaFileAlt className="button-icon"/>
                            </div>
                            <p>
                                {centerInfo.form || 'لا يوجد استمارة'}
                            </p>
                        </div>
                        <div>
                            <div className="Questionnaire_Button-show">
                                <FaFileAlt className="button-icon"/>
                            </div>
                            <p>{centerInfo.poll || 'لا يوجد استبيان'}</p>
                        </div>
                    </div>

                    <div className="flex-input">
                        <div className="AddOnlineCourse_input">
                            <label>
                                رسوم الدورة
                                <div>
                                    {centerInfo.price || 'مجانا'}
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default DetailsCopyCenter;
