import React, {useEffect, useState} from 'react';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {FaArrowRight, FaExclamationCircle, FaFileAlt, FaListAlt} from "react-icons/fa";
import CopyHooks from "../../../hooks/copyHooks";
import {useLocation} from "react-router-dom";
import './detailsCopyOnline.scss';

const DetailsCopyOnline = () => {
    const location = useLocation();
    const {fetchInfoOnlineCopy} = CopyHooks();
    const id = location.state?.id;
    const date = location.state?.date;

    const [onlineInfo, setOnlineInfo] = useState([]);
    const [openContainers, setOpenContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nodata, setNodata] = useState(null);

    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };

    const getInfoOnline = async () => {
        setLoading(true); // Start loading
        setError(null);   // Reset error
        setNodata(null);  // Reset no data message

        try {
            const data = await fetchInfoOnlineCopy(id);

            // Ensure `data` and `data.data` are properly checked
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                setOnlineInfo(data.data);
                setOpenContainers(Array(data.data[0].content?.length || 0).fill(false));
            } else if (data && data.data && Array.isArray(data.data) && data.data.length === 0) {
                setNodata('لا توجد بيانات لعرضها');
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
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        if (id) {
            getInfoOnline();
        }
    }, [id]);

    const toggleDropdown = (index) => {
        setOpenContainers(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div>
            <div className='ShowCopy-navbar-'>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <p>نسخة {new Date(date).toLocaleDateString('en-GB')}</p>
            </div>
            <div className="detailsCopy">
                {loading ? (
                    <div className="spinner-container2">
                        <div className="spinner"/>
                    </div>
                ) : error ? (
                    <div className="spinner-container2">
                        <FaExclamationCircle className="error-icon"/>
                        <p className="error-message-">{error}</p>
                    </div>
                ) : nodata ? (
                    <div className="spinner-container2">
                        <p className="error-message-">{nodata}</p>
                    </div>
                ) : (
                    <>
                        <div className="folder-menu">
                            {onlineInfo.map((container, containerIndex) => (
                                <div key={containerIndex}>
                                    {container.content && container.content.map((content, contentIndex) => (
                                        <div key={contentIndex}
                                             className={`folder-item ${openContainers[contentIndex] ? 'open' : ''}`}>
                                            <div className="folder-header" onClick={() => toggleDropdown(contentIndex)}>
                                                <div className="container-images">
                                                    {content.photo && (
                                                        <img
                                                            src={process.env.REACT_APP_API_PATH + "/Uploads/" + content.photo}
                                                            alt={`Image ${contentIndex + 1}`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="folder-header-text">
                                                    <h4>{content.name}</h4>
                                                    <p>{content.numberVideos} فيديوهات</p>
                                                    <p>{content.numberHours} ساعات</p>
                                                </div>
                                                {openContainers[contentIndex] ? <FiChevronUp/> : <FiChevronDown/>}
                                            </div>
                                            {openContainers[contentIndex] && (
                                                <div className="dropdown-content">
                                                    <div className="videos">
                                                        {content.videoFiles && content.videoFiles.map((video, videoIndex) => (
                                                            <div key={videoIndex} className="video">
                                                                <iframe
                                                                    src={process.env.REACT_APP_API_PATH + "/Uploads/" + video.video}
                                                                    width="50%"
                                                                    height="30%"
                                                                    title={`Video ${videoIndex + 1}`}
                                                                    allowFullScreen
                                                                />
                                                                <div className="video-details">
                                                                    <p>الاسم: {video.name}</p>
                                                                    <p>المدة: {formatTime(video.duration)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="additional-info">
                            <div className='AddOnlineCourse_Button-'>
                                <div>
                                    <div className='Form_Button-show'>
                                        <FaFileAlt className='button-icon'/>
                                    </div>
                                    <p>{onlineInfo[0]?.form || 'لايوجد استمارة'}</p>
                                </div>

                                <div>
                                    <div className='Questionnaire_Button-show'>
                                        <FaListAlt className='button-icon'/>
                                    </div>
                                    <p>{onlineInfo[0]?.poll || 'لايوجد استبيان'}</p>
                                </div>

                                <div>
                                    <div className='Exam_Button-show'>
                                        <FaListAlt className='button-icon'/>
                                    </div>
                                    <p>{onlineInfo[0]?.examforcourse || 'لايوجد امتحان'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-input-">
                            <div className="row_inpout">
                                <p className='input-label'>السعر</p>
                                <div className='AddOnlineCourse_input_'>
                                    {onlineInfo[0]?.price || 'مجانية'}
                                </div>
                            </div>
                            <div className="row_inpout">
                                <p className='input-label'>هل الدورة متسلسلة ؟</p>
                                <div className='AddOnlineCourse_input_'>
                                    {onlineInfo[0]?.serial || 'غير متسلسلة'}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetailsCopyOnline;

