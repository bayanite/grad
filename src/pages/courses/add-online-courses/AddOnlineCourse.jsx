import React, {useState, useEffect, useRef} from 'react';
import './AddOnlineCourse.scss';
import '../view courses/courses.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaListAlt, FaFileAlt, FaPlus, FaArrowRight} from 'react-icons/fa';
import {MdVideoLibrary} from "react-icons/md";
import CourseOnline from "../../../hooks/createCourseOnline";
import Model from "../../../hooks/Model";

const AddOnlineCourse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const id = location.state?.id;
    const totalDuration = location.state?.totalDuration;
    const numberVideos = location.state?.numberVideos;
    const dynamicContent = location.state?.dynamicContent;
    console.log("cfcfgv",dynamicContent)
    console.log("numberVideos",numberVideos)
    console.log("duration",totalDuration)

    const {fetchForm} = Model();

    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState(0);
    const [isSeries, setIsSeries] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [durationMinut, setDurationMinut] = useState('');
    const [model, setModel] = useState([]);
    const [contentExam, setContentExam] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nameCourse, setNameCourse] = useState([]);
    const [selectCourse, setSelectCourse] = useState('');
    const [showFormPopup, setShowFormPopup] = useState(false);
    const [showQuestionnairePopup, setShowQuestionnairePopup] = useState(false);
    const formPopupRef = useRef(null);
    const questionnairePopupRef = useRef(null);
    const examPopupRef = useRef(null);
    const [selectedForm, setSelectedForm] = useState({ id: null, title: '' });
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState({ id: null, title: '' });


    const handleSelectCourse = (event) => {
        setSelectCourse(event.target.value);
    };

    const handleExamButtonClick = () => {
        setShowPopup(true);
    };

    const handleContentExamChange = (event) => {
        setContentExam(event.target.value);
    };

    const handleClosePopupEx = () => {
        setShowPopup(false);
    };

    const handleSave = () => {
        setShowPopup(false);
    };

    const handleCourseTypeChange = (e) => {
        setIsSeries(e.target.value === 'series');
        setSelectedSeries(e.target.value === 'series' ? 1 : 0);
    };

    const handlePaymentTypeChange = (e) => {
        setIsFree(e.target.value === 'free');
        if (e.target.value === 'free') {
            setPrice(0);
        }
    };

    const handleNumberOfQuestionsChange = (event) => {
        const inputValue = event.target.value;
        let value = parseInt(inputValue);
        if (!isNaN(value) && value >= 0) {
            setNumberOfQuestions(value);
        } else {
            setNumberOfQuestions('');
        }
    };

    const handleDurationChange = (event) => {
        const inputValue = event.target.value;
        let value = parseInt(inputValue);
        setDurationMinut(value);
    };

    const handleContentCourse = () => {
        navigate('/courses/add-online-courses/content-online-courses/ContentOnlineCourses', {state: {courseName, id}});
    };
    const handleFormClick = (id, title) => {
        if (selectedForm.id === id) {
            setSelectedForm({ id: null, title: '' });
        } else {
            setSelectedForm({ id, title });
        }
        setShowFormPopup(false);
    };

    const handleQuestionnaireClick = (id, title) => {
        if (selectedQuestionnaire.id === id) {
            setSelectedQuestionnaire({ id: null, title: '' });
        } else {
            setSelectedQuestionnaire({ id, title });
        }
        setShowQuestionnairePopup(false);
    };

    const handleQuestionnaireButtonClick = async () => {
        try {
            const data = await fetchForm('استبيان');
            console.log('Fetched questionnaire data:', data); // Log fetched data
            if (data && data.data && Array.isArray(data.data.paper)) {
                setModel(data.data.paper);
            } else {
                console.error('Unexpected data structure:', data);
                setModel([]);
            }
            setShowQuestionnairePopup(true);
        } catch (error) {
            console.error('Error fetching questionnaire data:', error);
        }
    };

    const handleFormButtonClick = async () => {
        try {
            const data = await fetchForm('استمارة');
            console.log('Fetched form data:', data); // Log fetched data
            if (data && data.data && Array.isArray(data.data.paper)) {
                setModel(data.data.paper);
            } else {
                console.error('Unexpected data structure:', data);
                setModel([]);
            }
            setShowFormPopup(true);
        } catch (error) {
            console.error('Error fetching form data:', error);
        }
    };

    const handleClosePopup = (event) => {
        if (
            formPopupRef.current && !formPopupRef.current.contains(event.target) &&
            questionnairePopupRef.current && !questionnairePopupRef.current.contains(event.target) &&
            examPopupRef.current && !examPopupRef.current.contains(event.target)
        ) {
            setShowFormPopup(false);
            setShowQuestionnairePopup(false);
            setShowPopup(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClosePopup);

        return () => {
            document.removeEventListener('mousedown', handleClosePopup);
        };
    }, []);

    const handlePrevious = () => {
        navigate(-1);
    };

    const {createCourseOnline, fetchNameCourse} = CourseOnline();

    const fetchName = async () => {
        try {
            const data = await fetchNameCourse();
            setNameCourse(data.data.data);
        } catch (error) {
            console.error('Error fetching course names:', error);
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourseOnline(0, price, selectedForm.id, selectedQuestionnaire.id, selectCourse, selectedSeries, id, duration, numberVideos, 0, 0, dynamicContent);
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };


    useEffect(() => {
        fetchName();
    }, []);

    return (
        <div className={'AddOnlineCourse'}>
            <div className={'AddOnlineCourse-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                {`إضافة دورة أون لاين لدورة `}
                <span style={{color: '#D2B260', fontWeight: 'bold'}}>{courseName}</span>
            </div>

            <div className={'AddOnlineCourse_container'}>
                <div
                    className={dynamicContent && dynamicContent.length > 0 ? "AddOnlineCourse_Content dynamic-content" : "AddOnlineCourse_Content"}>
                    {dynamicContent && dynamicContent.length > 0 ? (
                        dynamicContent.map((content, index) => (
                            <div key={index} className="content-item">
                                <img src={URL.createObjectURL(content.photo)} className="content-image" alt="Content"/>
                                <div className="content-text-container">
                                    <span className={"content-item-text"}>{content.name}</span>
                                    <span className="video-info">
                                        <MdVideoLibrary/>
                                        <span> {content.videoFiles.length} </span>
                                        دروس
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="AddOnlineCourse_Content_icon" onClick={handleContentCourse}>
                            <FaPlus className={'FaPlus'}/>
                            <p className={'title_template'}>إضافة دورة جديدة </p>
                        </div>
                    )}
                </div>

                <div className={'AddOnlineCourse_Button'}>
                    <div>
                        <div className={'Form_Button'} onClick={handleFormButtonClick}>
                            <FaFileAlt className={'button-icon'}/>
                        </div>
                        {showFormPopup && (
                            <div className="popup" ref={formPopupRef} onClick={() => setShowFormPopup(false)}>
                                <div className="popup-content">
                                    <ul className="popup-list">
                                        {model.map((item, index) => (
                                            <li
                                                key={index}
                                                className={selectedForm.id === item.id ? 'active-item' : ''}
                                                onClick={() => handleFormClick(item.id, item.title)}
                                            >
                                                {item.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        <p>{selectedForm.title || 'اختيار استمارة'}</p>
                    </div>

                    <div>
                        <div className={'Questionnaire_Button'} onClick={handleQuestionnaireButtonClick}>
                            <FaFileAlt className={'button-icon'}/>
                        </div>
                        {showQuestionnairePopup && (
                            <div className="popup" ref={questionnairePopupRef} onClick={() => setShowQuestionnairePopup(false)}>
                                <div className="popup-content">
                                    <ul className="popup-list">
                                        {model.map((item, index) => (
                                            <li
                                                key={index}
                                                className={selectedQuestionnaire.id === item.id ? 'active-item' : ''}
                                                onClick={() => handleQuestionnaireClick(item.id, item.title)}
                                            >
                                                {item.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        <p>{selectedQuestionnaire.title || 'اختيار استبيان'}</p>
                    </div>

                    <div>
                        <div className={'Exam_Button'} onClick={handleExamButtonClick}>
                            <FaListAlt className={'button-icon'}/>
                        </div>
                        <p>اضافة امتحان </p>
                    </div>

                    {showPopup && (
                        <div className="popup" ref={examPopupRef} onClick={() => setShowPopup(false)}>
                            <div className="popup-content">
                                <label>
                                    عدد الاسئلة
                                    <input type="text" value={numberOfQuestions}
                                           onChange={handleNumberOfQuestionsChange} required/>
                                </label>
                                <label>
                                    مدة الامتحان (في الدقائق)
                                    <input type="text" value={durationMinut} onChange={handleDurationChange} required/>
                                </label>

                                <button className={"cancel-button"} onClick={handleClosePopupEx}>إلغاء</button>
                                <button className={"save-button"} onClick={handleSave}>حفظ</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={"flex-input"}>
                    <div className={'AddOnlineCourse_input'}>
                        <label>
                            نوع الدورة
                            <select value={isSeries ? 'series' : 'non-series'} onChange={handleCourseTypeChange}>
                                <option value="non-series">غير متسلسلة</option>
                                <option value="series">متسلسلة</option>
                            </select>
                        </label>
                        {isSeries && (
                            <label>
                                اختر الدورة السابقة:
                                <select value={selectCourse} onChange={handleSelectCourse}>
                                    {nameCourse.map(element =>
                                        <option key={element.id} value={element.id}>{element.name}</option>
                                    )}
                                </select>
                            </label>
                        )}
                    </div>

                    <div className={'AddOnlineCourse_input'}>
                        <label>
                            التسجيل على الدورة
                            <select value={isFree ? 'free' : 'paid'} onChange={handlePaymentTypeChange}>
                                <option value="free"> مجاناً</option>
                                <option value="paid"> مدفوع</option>
                            </select>
                        </label>
                        {!isFree && (
                            <label>
                                أدخل رسم التبرع :
                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                                       placeholder="اكتب هنا"/>
                            </label>
                        )}
                    </div>
                </div>
                <button className={"save-"} onClick={handleSaveCourse}>حفظ</button>
            </div>
        </div>
    );
};

export default AddOnlineCourse;
