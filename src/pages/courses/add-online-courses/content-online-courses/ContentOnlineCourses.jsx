import PdfUpload from './PdfUpload';
import VideoUpload from './VideoUpload';
import React, {useEffect, useRef, useState} from 'react';
import './ContentOnlineCourses.scss'
import {TfiTimer} from "react-icons/tfi";
import {IoMdAdd} from "react-icons/io";
import {FaTrashAlt} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import CourseOnline from "../../../../hooks/createCourseOnline";

const ContentOnlineCourses = () => {


    const {fetchNameExam} = CourseOnline();
    const containerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const courseName = location.state?.courseName;
    const id = location.state?.id;
    const [selectedQuizIndex, setSelectedQuizIndex] = useState(null); // Define state for selected quiz index

    const [showExamPopup, setShowExamPopup] = useState(false); // State to control the exam popup visibility
    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [duration, setDuration] = useState('');
    const [numberAllVideos, setNumberAllVideos] = useState('0');
    const [contentExam, setContentExam] = useState('');
    const [title, setTitle] = useState('عنوان المحتوى');
    const [totalDuration, setTotalDuration] = useState('');
    const [dynamicContent, setDynamicContent] = useState([]);
    const [listExam, setListExam] = useState([]);
    const [error, setError] = useState(''); // New state variable for error messages
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null); // State to store the selected video index
    const [selectedExam, setSelectedExam] = useState({id: null, title: ''});

    const scrollToNewContent = () => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    const handleVideoDragStart = (e, contentIndex, videoIndex) => {
        e.dataTransfer.setData("contentIndex", contentIndex);
        e.dataTransfer.setData("videoIndex", videoIndex);
    };

    const handleVideoDragOver = (e) => {
        e.preventDefault();
    };

    const handleVideoDrop = (e, dropContentIndex, dropVideoIndex) => {
        const dragContentIndex = parseInt(e.dataTransfer.getData("contentIndex"));
        const dragVideoIndex = parseInt(e.dataTransfer.getData("videoIndex"));

        // Check if the drag and drop are happening within the same content
        if (dragContentIndex === dropContentIndex) {
            const updatedContent = [...dynamicContent];
            const dragVideo = updatedContent[dragContentIndex].videoFiles[dragVideoIndex];
            updatedContent[dragContentIndex].videoFiles.splice(dragVideoIndex, 1);
            updatedContent[dropContentIndex].videoFiles.splice(dropVideoIndex, 0, dragVideo);

            setDynamicContent(updatedContent);
        }
    };

    const handleEditClick = (index) => {
        const updatedContent = [...dynamicContent];
        updatedContent[index].name = "";
        setEditMode(index);
    };

    const handleSaveClick = () => {
        setEditMode(false); // يجب تعيينها لتكون غير فعالة عند الانتهاء من التحرير
        // يمكنك إضافة المنطق الإضافي هنا لحفظ العنوان المحرر، مثل استدعاء API أو تخزينه محليًا.
    };

    const handleInputChange = (event) => {
        setTitle(event.target.value);
    };

    const handleAddContent = () => {

        const newContent = {
            photo: '',
            name: 'عنوان المحتوى',
            videoFiles: [],
            pdfFiles: [],
            numberHours: '00:00',
            numberVideos: '0',
            exam: '0',
            numberQuestion: '0',
            durationExam: '00:00',
        };

        setDynamicContent([...dynamicContent, newContent]);
        scrollToNewContent();
    };

    const handleDeleteContent = (index) => {
        const updatedContent = [...dynamicContent];
        updatedContent.splice(index, 1);
        setDynamicContent(updatedContent);
    };

    const handleTitleChange = (index, event) => {
        const updatedContent = [...dynamicContent];
        updatedContent[index].name = event.target.value;
        setDynamicContent(updatedContent);
    };

    const handleAddImage = (index, event) => {
        const selectedImage = event.target.files[0];
        const updatedContent = [...dynamicContent];
        updatedContent[index].photo = selectedImage;
        setDynamicContent(updatedContent);
    }

    const fetchExams = async () => {
        try {
            const data = await fetchNameExam();
            setListExam(data.data.exam);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFileUpload = async (index, event) => {
        const files = event.target.files;

        try {
            const updatedContent = [...dynamicContent];

            // Create an array of promises to fetch durations for each video file
            const videoFilePromises = Array.from(files).map(async file => {
                try {
                    const duration = await getVideoDuration(file);
                    const durationInMinutes = convertSecondsToMinutes(duration);

                    return {
                        name: file.name,
                        video: file, // Store file as object URL
                        duration: durationInMinutes,
                        id_exam: '',
                    };
                } catch (error) {
                    console.error("Error occurred during file processing:", error);
                    return null; // Return null for failed file processing
                }
            });

            // Wait for all promises to resolve
            const newVideoFiles = await Promise.all(videoFilePromises);

            // Filter out null values (failed file processing)
            const filteredVideoFiles = newVideoFiles.filter(file => file !== null);

            // Update dynamic content with new video files
            updatedContent[index].videoFiles = [
                ...(updatedContent[index].videoFiles || []),
                ...filteredVideoFiles,
            ];

            updatedContent[index].numberVideos = updatedContent[index].videoFiles.length;
            updatedContent[index].numberHours = calculateTotalDuration(updatedContent[index].videoFiles);
            // Set the updated dynamic content
            setDynamicContent(updatedContent);
        } catch (error) {
            // Handle errors from getVideoDuration or any other unexpected errors
            console.error("Error occurred during file upload:", error);
        } finally {
            // Clear the input element's value to allow re-uploading the same file
            event.target.value = null;
        }
    };

    const handleFileUploadPdf = (index, event) => {
        const files = event.target.files;
        const updatedContent = [...dynamicContent];
        updatedContent[index].pdfFiles = Array.from(files).map(file => ({
            name: file.name,
            file: file
        }));
        setDynamicContent(updatedContent);
    };

    const handleDeletePdf = (contentIndex, pdfIndex) => {
        const updatedContent = [...dynamicContent];
        const contentToUpdate = updatedContent[contentIndex];
        const updatedPdfFiles = [...contentToUpdate.pdfFiles];
        updatedPdfFiles.splice(pdfIndex, 1);
        contentToUpdate.pdfFiles = updatedPdfFiles;
        setDynamicContent(updatedContent);
    };

    const getVideoDuration = async (file) => {
        return new Promise((resolve, reject) => {
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(file);
            videoElement.addEventListener('loadedmetadata', () => {
                resolve(videoElement.duration);
            });
            videoElement.addEventListener('error', (error) => {
                reject(error);
            });
        });
    };

    const convertSecondsToMinutes = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const calculateTotalDuration = (videoFiles) => {
        let totalSeconds = 0;
        videoFiles.forEach(video => {
            const [minutes, seconds] = video.duration.split(":").map(part => parseInt(part) || 0);
            totalSeconds += minutes * 60 + seconds;
        });

        return convertSecondsToMinutes(totalSeconds);
    };

    const getTotalNumberOfVideos = () => {
        return dynamicContent.reduce((total, content) => total + (content.videoFiles ? content.videoFiles.length : 0), 0);
    };

    useEffect(() => {
        setNumberAllVideos(getTotalNumberOfVideos());
    }, [dynamicContent]);

    const getTotalNumberOfContent = () => {
        return dynamicContent.length;
    };

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        let totalSeconds = 0;
        dynamicContent.forEach(content => {
            if (content.videoFiles && content.videoFiles.length > 0) {
                content.videoFiles.forEach(video => {
                    const [minutes, seconds] = video.duration.split(":").map(part => parseInt(part) || 0);
                    totalSeconds += minutes * 60 + seconds;
                });
            }
        });

        const formattedTotalDuration = convertSecondsToMinutes(totalSeconds);
        setTotalDuration(formattedTotalDuration);

    }, [dynamicContent]);

    const handleDeleteVideo = (contentIndex, videoIndex) => {
        const updatedContent = [...dynamicContent];
        const contentToUpdate = updatedContent[contentIndex];
        const updatedVideoFiles = [...contentToUpdate.videoFiles];
        updatedVideoFiles.splice(videoIndex, 1);
        contentToUpdate.videoFiles = updatedVideoFiles;
        setDynamicContent(updatedContent);
    };

    // const handleExamSelection = (index, id_exam, examTitle) => {
    //     const updatedContent = [...dynamicContent];
    //     const videoFile = updatedContent[index].videoFiles[selectedVideoIndex];
    //
    //     if (videoFile.examTitle === examTitle) {
    //         // If the examTitle is already set, remove it
    //         videoFile.id_exam = null;
    //         videoFile.examTitle = null;
    //         setSelectedExam(null); // Deselect the exam
    //     } else {
    //         // Otherwise, set the new examTitle
    //         videoFile.id_exam = id_exam;
    //         videoFile.examTitle = examTitle;
    //         setSelectedExam(id_exam); // Set the selected exam
    //     }
    //
    //     setDynamicContent(updatedContent);
    //     setShowExamPopup(false);
    // };

    // const handleLinkExamWithVideo = (contentIndex, videoIndex) => {
    //     setSelectedVideoIndex(videoIndex);
    //     setShowExamPopup(true);
    // };


    const handleExamSelection = (index, id_exam, examTitle) => {
        const updatedContent = [...dynamicContent];

        if (index !== null && selectedVideoIndex !== null) {
            const videoFile = updatedContent[index]?.videoFiles[selectedVideoIndex];

            if (videoFile) {
                if (videoFile.id_exam === id_exam) {
                    // If the examTitle is already set, remove it
                    videoFile.id_exam = null;
                    videoFile.examTitle = null;
                    setSelectedExam(null); // Deselect the exam
                } else {
                    // Otherwise, set the new examTitle
                    videoFile.id_exam = id_exam;
                    videoFile.examTitle = examTitle;
                    setSelectedExam(id_exam); // Set the selected exam
                }

                setDynamicContent(updatedContent);
            }
        }

        setShowExamPopup(false);
    };


    const handleLinkExamWithVideo = (contentIndex, videoIndex) => {
        setSelectedVideoIndex(videoIndex);
        setSelectedQuizIndex(contentIndex); // Store the content index
        setShowExamPopup(true);
    };

    const handleNext = (dynamicContent) => {
        // Initialize a new array to store error messages for each content item
        const newErrors = dynamicContent.map((content, index) => {
            if (!content.name || content.name.trim() === '' || content.name.trim() === 'عنوان المحتوى') {
                return `الرجاء إدخال عنوان للمحتوى ${index + 1}.`;
            }
            if (!content.photo) {
                return `الرجاء إضافة صورة للمحتوى ${index + 1}.`;
            }
            if (!content.videoFiles || content.videoFiles.length === 0) {
                return `يجب أن يحتوي المحتوى ${index + 1} على فيديو واحد على الأقل.`;
            }
            return null; // No error for this content item
        });

        // Check if there are any errors
        const hasErrors = newErrors.some(error => error !== null);

        // Update the errors state
        setError(newErrors);

        if (!hasErrors) {
            // If no errors, proceed with navigation
            navigate('/courses/add-online-courses/AddOnlineCourse', {
                state: {dynamicContent, courseName, id, numberAllVideos, totalDuration}
            });
        }
    };

    const handleQuizChange = (index, numberQuestions, duration, exam) => {
        const updatedContent = [...dynamicContent];
        updatedContent[index].numberQuestion = numberQuestions;
        updatedContent[index].durationExam = duration;
        updatedContent[index].exam = exam;
        setDynamicContent(updatedContent);
    };

    const handleShowQuizPopup = (index) => {
        const content = dynamicContent[index];
        const isVideoLinkedToExam = content.videoFiles.some(video => video.id_exam);

        if (!isVideoLinkedToExam) {
            alert("يجب ربط فيديو باختبار قبل إضافة اختبار إلى المحتوى."); // Alert the user to link a video with an exam first
            return;
        }
        setSelectedQuizIndex(index);
        setShowPopup(true);
    };

    // const handleSaveQuiz = () => {
    //     if (selectedQuizIndex !== null) {
    //         handleQuizChange(selectedQuizIndex, numberOfQuestions, duration);
    //         setShowExamPopup(false);
    //         setNumberOfQuestions('');
    //         setDuration('');
    //     }
    // };
    const handleSaveQuiz = () => {
        if (selectedQuizIndex !== null) {
            handleQuizChange(selectedQuizIndex, numberOfQuestions, duration, 1);
            setShowPopup(false);
            setNumberOfQuestions('');
            setDuration('');
        }
    };


    const handlePrevious = () => {
        navigate(-1);
    };

    return (
        <div className={"ContentOnlineCourses"}>
            <div className={"ContentOnlineCourses_navbar"}>
                <div className="navbar-title">
                    <p>محتويات الدورة</p>
                    <span>{numberAllVideos} فيديوهات / {getTotalNumberOfContent()} محتويات </span>
                </div>
                <div className="navbar-icon">
                    <TfiTimer/>
                    <span>{totalDuration}</span>
                </div>
                <div className="navbar-button">
                    <button className={"add"} onClick={handleAddContent}>
                        <IoMdAdd/>
                    </button>
                </div>
            </div>
            <div ref={containerRef} className={"ContentOnlineCourses_container"}>
                <div className={'scrollable-content'}>
                    {dynamicContent.map((content, index) => (
                        <div className={"dynamicContent"} key={index}>
                            <div className={"title-content"}>
                                <label htmlFor={`upload-input-${index}`} className="image-container">
                                    {content.photo &&
                                    <img src={URL.createObjectURL(content.photo)} alt="Selected"
                                         className="selected-image"/>}
                                    {!content.photo && <IoMdAdd className="add-icon"/>}
                                    <input
                                        id={`upload-input-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleAddImage(index, event)}
                                        style={{display: "none"}}
                                    />
                                </label>
                                <div className={"content-text"}>
                                    <div className="content-number">{index + 1}.</div>
                                    {editMode === index ? (
                                        <input
                                            type="text"
                                            value={content.name}
                                            onChange={(event) => handleTitleChange(index, event)}
                                        />
                                    ) : (
                                        <div>
                                            <text>{content.name}</text>
                                        </div>
                                    )}
                                    <span onClick={() => handleEditClick(index)}> / إعادة التسمية</span>
                                    <button onClick={() => handleDeleteContent(index)}>
                                        <FaTrashAlt/>
                                    </button>
                                </div>
                                <div className={"sum_of_duration_content"}>
                                    {content.videoFiles ? calculateTotalDuration(content.videoFiles) : '00:00'}
                                </div>
                            </div>

                            {/* VideoUpload Component */}
                            <VideoUpload
                                index={index}
                                handleFileUpload={handleFileUpload}
                                handleDeleteVideo={handleDeleteVideo}
                                handleLinkExamWithVideo={handleLinkExamWithVideo} // Pass handleLinkExamWithVideo function
                                handleVideoDragStart={handleVideoDragStart}
                                handleVideoDragOver={handleVideoDragOver}
                                handleVideoDrop={handleVideoDrop}
                                content={content}
                            />

                            {/* PdfUpload Component */}
                            <PdfUpload
                                index={index}
                                handleFileUploadPdf={handleFileUploadPdf}
                                handleDeletePdf={handleDeletePdf}
                                content={content}
                            />

                            {/* DynamicContent-input-exam */}
                            {/* عرض معلومات الاختبار إذا كانت موجودة */}
                            {content.exam === '1' && (
                                <div className="quiz-info">
                                    <p>عدد الأسئلة: {content.numberQuestion}</p>
                                    <p>مدة الاختبار: {content.durationExam}</p>
                                    <button onClick={() => handleShowQuizPopup(index)}>
                                        تعديل معلومات الاختبار
                                    </button>
                                </div>
                            )}

                            {/* زر إضافة اختبار */}
                            <div className={'dynamicContent-input-exam'}>
                                <label
                                    className={"exam-label"}
                                    onClick={() => handleShowQuizPopup(index)}
                                    style={{
                                        color: content.videoFiles.some(video => video.id_exam) ? 'black' : 'gray',
                                        cursor: content.videoFiles.some(video => video.id_exam) ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <IoMdAdd className="add-icon"/> إضافة اختبار
                                </label>
                            </div>

                            {/* Quiz Popup */}
                            {showPopup && (
                                <div className="popup">
                                    <div className="popup-content">
                                        <label>عدد الأسئلة</label>
                                        <input
                                            type="number"
                                            value={numberOfQuestions}
                                            onChange={(e) => setNumberOfQuestions(e.target.value)}
                                            placeholder="0"
                                        />
                                        <label>المدة الزمنية للاختبار</label>
                                        <input
                                            type="text"
                                            value={duration}
                                            placeholder="00:00"

                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                        <div className="button-group">
                                            <button className="save-button" onClick={handleSaveQuiz}>حفظ</button>
                                            <button className="cancel-button" onClick={() => setShowPopup(false)
                                            }>إلغاء
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showExamPopup && (
                                <div className="popup" onClick={() => setShowExamPopup(false)}>
                                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                                        <ul className="popup-list">
                                            {listExam.map((exam, indexExam) => {
                                                const isActive = dynamicContent[selectedQuizIndex]?.videoFiles[selectedVideoIndex]?.id_exam === exam.id;
                                                return (
                                                    <li
                                                        key={indexExam}
                                                        className={isActive ? 'active-item' : ''}
                                                        onClick={() => handleExamSelection(selectedQuizIndex, exam.id, exam.title)}
                                                    >
                                                        {exam.title}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {error[index] && <div className="error-message-content">{error[index]}</div>}
                        </div>

                    ))}
                </div>
                <div style={{display: 'flex', justifyContent: dynamicContent.length > 0 ? 'flex-end' : 'flex-start'}}>
                    {dynamicContent.length > 0 ? (
                        <>
                            <button onClick={() => handleNext(dynamicContent)} className={"next_content"}>التالي
                            </button>
                            <button onClick={handlePrevious} className={"previous_content"}>السابق</button>
                        </>
                    ) : (
                        <button onClick={handlePrevious} className={"previous_content"}>السابق</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContentOnlineCourses;
