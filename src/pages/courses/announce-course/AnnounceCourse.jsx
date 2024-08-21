import React, {useRef, useState} from 'react';
import '../add-online-courses/AddOnlineCourse.scss';
import '../view courses/courses.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowRight, FaFileAlt} from 'react-icons/fa';
import CourseCenter from "../../../hooks/createCourseCenter";
import Model from "../../../hooks/Model";

const AnnounceCourse = () => {
    const {fetchForm} = Model();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const id = location.state?.id;

    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState('0');
    const [isSeries, setIsSeries] = useState(false);
    const [beginningOfRegistration, setBeginningOfRegistration] = useState('');
    const [endingOfRegistration, setEndingOfRegistration] = useState('');
    const [numberOfLessons, setNumberOfLessons] = useState('');
    const [numberOfHour, setNumberOfHour] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showQuestionnairePopup, setShowQuestionnairePopup] = useState(false);
    const formPopupRef = useRef(null);
    const [showFormPopup, setShowFormPopup] = useState(false);
    const [model, setModel] = useState([]);
    const [selectedForm, setSelectedForm] = useState({id: null, title: ''});
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState({id: null, title: ''});
    const questionnairePopupRef = useRef(null);
    const [loading1, setLoading1] = useState(false); // Loading state

    const handleFormButtonClick = async () => {
        try {
            const data = await fetchForm('استمارة');
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

    const handleQuestionnaireButtonClick = async () => {
        try {
            const data = await fetchForm('استبيان');
            if (data && data.data && Array.isArray(data.data.paper)) {
                setModel(data.data.paper);
            } else {
                setModel([]);
            }
            setShowQuestionnairePopup(true);
        } catch (error) {
            console.error('Error fetching questionnaire data:', error);
        }
    };

    const handleBeginningChange = (event) => {
        const startDate = event.target.value;
        if (new Date(startDate) >= new Date(endingOfRegistration)) {
            alert("تاريخ البداية يجب أن يكون قبل تاريخ الانتهاء");
            setBeginningOfRegistration('');
            setEndingOfRegistration('');
        }
        setBeginningOfRegistration(startDate);
    };

    const handleEndingChange = (event) => {
        const endDate = event.target.value;
        if (new Date(endDate) <= new Date(beginningOfRegistration)) {
            alert("تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية");
            setEndingOfRegistration('');
        } else {
            setEndingOfRegistration(endDate);
        }
    };

    const handleLessonsChange = (event) => {
        setNumberOfLessons(event.target.value);
    };

    const handleHourChange = (event) => {
        setNumberOfHour(event.target.value);
    };

    const handleCourseTypeChange = (e) => {
        setIsSeries(e.target.value === 'series');
    };

    const handlePaymentTypeChange = (e) => {
        const paymentType = e.target.value;
        if (paymentType === 'free') {
            setIsFree(true);
            setPrice('0');
        } else {
            setIsFree(false);
            setPrice(''); // Allow user to input price for paid option

            // Handle setting price for non-free options if needed
        }
    };

    const handlePrevious = () => {
        navigate('/courses');
    };

    const {createCourseCenter} = CourseCenter();

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const formId = selectedForm.id ? selectedForm.id : null;

        // Check if no questionnaire is selected
        const questionnaireId = selectedQuestionnaire.id ? selectedQuestionnaire.id : null;

        try {
            setLoading1(true);
            await createCourseCenter(
                beginningOfRegistration,
                endingOfRegistration,
                numberOfHour,
                numberOfLessons,
                id,
                formId,
                questionnaireId,
                price
            );
            navigate('/courses'); // Navigate to the desired route after saving

        } catch (error) {
            console.error('Error adding template:', error);
        } finally {
            setLoading1(false); // End the loading state
        }
    };

    const handleFormClick = (id, title) => {
        if (selectedForm.id === id) {
            setSelectedForm({id: null, title: ''});
        } else {
            setSelectedForm({id, title});
        }
        setShowFormPopup(false);
    };

    const handleQuestionnaireClick = (id, title) => {
        if (selectedQuestionnaire.id === id) {
            setSelectedQuestionnaire({id: null, title: ''});
        } else {
            setSelectedQuestionnaire({id, title});
        }
        setShowQuestionnairePopup(false);
    };

    return (
        <div className={'AddOnlineCourse'}>
            <div className={'AddOnlineCourse-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                {`الإعلان عن دورة في المركز لدورة  `}
                <span style={{color: '#D2B260', fontWeight: 'bold'}}>{courseName}</span>
            </div>
            <div className={'AddOnlineCourse_container'}>
                <div className={"AddOnlineCourse_Content"}>
                    <div className={'AddOnlineCourse_input_info'}>
                        <label>
                            بداية التسجيل :
                            <input
                                type="date"
                                value={beginningOfRegistration}
                                onChange={handleBeginningChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </label>
                        <label>
                            نهاية التسجيل :
                            <input
                                type="date"
                                value={endingOfRegistration}
                                onChange={handleEndingChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </label>
                        <label>
                            عدد المحاضرات :
                            <input
                                type="text"
                                value={numberOfLessons}
                                onChange={handleLessonsChange}
                            />
                        </label>
                        <label>
                            عدد الساعات التدريبية :
                            <input
                                type="text"
                                value={numberOfHour}
                                onChange={handleHourChange}
                            />
                        </label>
                    </div>
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
                            <div className="popup" ref={questionnairePopupRef}
                                 onClick={() => setShowQuestionnairePopup(false)}>
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
                </div>

                <div className={"flex-input"}>
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
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="اكتب هنا"
                                />
                            </label>
                        )}
                    </div>
                </div>
                <button className={"save-"} onClick={handleSaveCourse}>
                    {loading1 ? (
                        <div className="loading-indicator">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>
                    ) : (
                        "حفظ"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AnnounceCourse;
