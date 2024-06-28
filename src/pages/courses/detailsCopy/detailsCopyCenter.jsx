import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaFileAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import './detailsCopyCenter.scss';
import CopyHooks from "../../../hooks/copyHooks";
import { format } from "date-fns";

const DetailsCopyCenter = () => {
    const { fetchInfoCenterCopy } = CopyHooks();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const id = location.state?.id;
    const date = location.state?.date;

    const [centerInfo, setCenterInfo] = useState(null);

    const handlePrevious = () => {
        navigate(-1);
    };

    const getInfoCenter = async () => {
        try {
            const data = await fetchInfoCenterCopy(id);
            setCenterInfo(data.data[0]); // Assuming data.data is an array with one object
        } catch (error) {
            console.log('Error fetching copy data', error);
        }
    };

    useEffect(() => {
        getInfoCenter();
    }, []);

    if (!centerInfo) {
        return <div>Loading...</div>; // Display loading state while fetching data
    }

    // Debugging logs
    console.log('Date from location:', date);
    console.log('Center info:', centerInfo);

    // Helper function to format dates safely
    const formatDate = (date) => {
        return date ? format(new Date(date), 'yyyy/MM/dd') : 'Invalid Date';
    };

    return (
        <div className="AddOnlineCourse">
            <div className='ShowCopy-navbar-'>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                <p> نسخة {format(new Date(date), 'yyyy/MM/dd')} </p>
            </div>
            <div className="AddOnlineCourse_container">
                <div className="AddOnlineCourse_Content">
                    <div className="AddOnlineCourse_input_info">
                        <label>
                            بداية التسجيل :
                            <div>
                                {formatDate(centerInfo.start)}
                            </div>
                        </label>
                        <label>
                            نهاية التسجيل :
                            <div>
                                {formatDate(centerInfo.end)}
                            </div>
                        </label>
                        <label>
                            عدد المحاضرات :
                            <div>
                                {centerInfo.numberContents}
                            </div>
                        </label>
                        <label>
                            عدد الساعات التدريبية :
                            <div>
                                {centerInfo.numberHours}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="AddOnlineCourse_Button">
                    <div>
                        <div className="Form_Button">
                            <FaFileAlt className="button-icon" />
                        </div>
                        <p>
                            {centerInfo.form ? centerInfo.form : 'لايوجد استمارة'}
                        </p>
                    </div>
                    <div>
                        <div className="Questionnaire_Button">
                            <FaFileAlt className="button-icon" />
                        </div>
                        <p>{centerInfo.poll ? centerInfo.poll : 'لايوجد استبيان'}</p>
                    </div>
                </div>

                <div className="flex-input">
                    <div className="AddOnlineCourse_input">
                        <label>
                            رسوم الدورة
                            <div>
                                {centerInfo.price}
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsCopyCenter;
