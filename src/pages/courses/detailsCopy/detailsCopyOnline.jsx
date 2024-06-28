import React, {useEffect, useState} from 'react';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {FaArrowRight, FaFileAlt, FaListAlt} from "react-icons/fa";
import CopyHooks from "../../../hooks/copyHooks";
import {useLocation} from "react-router-dom";
import {format} from "date-fns";
import './detailsCopyOnline.scss';

const DetailsCopyOnline = () => {
    const location = useLocation();
    const {fetchInfoOnlineCopy} = CopyHooks();
    const id = location.state?.id;
    const date = location.state?.date;

    const [onlineInfo, setOnlineInfo] = useState([{
        form: null,
        poll: "",
        examforcourse: "",
        serial: "",
        price: 0,
        content: []
    }]);
    const [openContainers, setOpenContainers] = useState([]);

    const getInfoOnline = async () => {
        try {
            const data = await fetchInfoOnlineCopy(id);
            setOnlineInfo(data.data);
            setOpenContainers(Array(data.data[0].content.length).fill(false));
        } catch (error) {
            console.log('Error fetching copy data', error);
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
        window.history.back(); // Go back to the previous page
    };

    return (
        <div>
            <div className='ShowCopy-navbar-'>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <p> نسخة {format(new Date(date), 'yyyy/MM/dd')} </p>
            </div>
            <div className="detailsCopy">
                <div className="folder-menu">
                    {onlineInfo.map((container, containerIndex) => (
                        <div key={containerIndex}>
                            {container.content.map((content, contentIndex) => (
                                <div key={contentIndex}
                                     className={`folder-item ${openContainers[contentIndex] ? 'open' : ''}`}>
                                    <div className="folder-header" onClick={() => toggleDropdown(contentIndex)}>
                                        <div className="container-images">
                                            {content.photo &&
                                            <img src={process.env.REACT_APP_API_PATH + "/Uploads/" + content.photo}
                                                 alt={`Image ${contentIndex + 1}`}/>}
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
                                                {content.videoFiles.map((video, videoIndex) => (
                                                    <div key={videoIndex} className="video">
                                                        {/*<img srcz={process.env.REACT_APP_API_PATH + "/Uploads/" + video.poster} alt={`Image ${contentIndex + 1}`} />*/}
                                                        <iframe
                                                           src={process.env.REACT_APP_API_PATH + "/Uploads/" + video.video}// Assuming video.url holds the URL of the video
                                                            width="50%"
                                                            height="30%"
                                                            title={`Video ${videoIndex + 1}`}
                                                            allowFullScreen
                                                        />
                                                        <p>Duration: {video.duration}</p>
                                                        <p>Name: {video.name}</p>
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
                    <div className='AddOnlineCourse_Button'>
                        <div>
                            <div className='Form_Button'>
                                <FaFileAlt className='button-icon'/>
                            </div>
                            <p> {onlineInfo[0].form ? onlineInfo[0].form : 'لايوجد استمارة'}</p>
                        </div>

                        <div>
                            <div className='Questionnaire_Button'>
                                <FaListAlt className='button-icon'/>
                            </div>
                            <p>{onlineInfo[0].poll ? onlineInfo[0].poll : 'لايوجد استبيان'}</p></div>

                        <div>
                            <div className='Exam_Button'>
                                <FaListAlt className='button-icon'/>
                            </div>
                            <p>{onlineInfo[0].examforcourse ? onlineInfo[0].examforcourse : 'لايوجد امتحان'}</p></div>
                    </div>
                </div>
                <div className="flex-input-">
                    <div className={"row_inpout"}>
                        <p className='input-label'>السعر</p>
                        <div className='AddOnlineCourse_input_'>
                            {onlineInfo[0].price}
                        </div>
                    </div>
                    <div className={"row_inpout"}>

                        <p className='input-label'>هل الدورة متسلسلة ؟</p>
                        <div className='AddOnlineCourse_input_'>
                            {onlineInfo[0].serial}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsCopyOnline;
