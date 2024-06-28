import PdfUpload from './PdfUpload';
import VideoUpload from './VideoUpload';
import React, {useEffect, useRef, useState} from 'react';
import './ContentOnlineCourses.scss'
import {TfiTimer} from "react-icons/tfi";
import {IoMdAdd} from "react-icons/io";
import {FaArrowLeft, FaArrowRight, FaCamera, FaTrashAlt} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import CourseOnline from "../../../../hooks/createCourseOnline";

const ContentOnlineCourses = () => {

    const {fetchContentCourse} = CourseOnline();
    const containerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const courseName = location.state?.courseName;
    const id = location.state?.id;

    const [showExamPopup, setShowExamPopup] = useState(false); // State to control the exam popup visibility
    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [duration, setDuration] = useState('');
    const [contentExam, setContentExam] = useState('');
    const [title, setTitle] = useState('عنوان المحتوى');
    const [totalDuration, setTotalDuration] = useState("0:00");
    const [dynamicContent, setDynamicContent] = useState([]);
    const [contentCourse, setContentCourse] = useState([]);
    const [error, setError] = useState(''); // New state variable for error messages

    console.log('Number of Questions:44  ', numberOfQuestions);
    console.log('Duration:44  ', duration);

    const handleSaveExam = (numberOfQuestions, duration) => {
        // Add your save logic here
        console.log("Number of questions:", numberOfQuestions);
        console.log("Duration:", duration);
        setShowExamPopup(false); // Close the popup after saving
    };

    const handleNumberOfQuestionsChange = (event) => {
        const inputValue = event.target.value;
        // Parse the input value as an integer
        let value = parseInt(inputValue);

        // Validate the input value
        if (!isNaN(value) && value >= 0) {
            // If it's a valid non-negative integer, update the state
            setNumberOfQuestions(value);
        } else {
            // Otherwise, reset the number of questions to an empty string
            setNumberOfQuestions('');
        }
    };

    const handleDurationChange = (event) => {
        const inputValue = event.target.value;
        // Parse the input value as an integer
        let value = parseInt(inputValue);
        setDuration(value);
    };

    const handleSave = () => {
        // Add your save logic here
        setShowPopup(false); // Close the popup after saving
    };

    const handleExamButtonClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    console.log("kkk", courseName)
    // Function to toggle the exam popup visibility
    const toggleExamPopup = () => {
        setShowExamPopup(!showExamPopup);
    };

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
            numberHours: '00:00',
            numberVideos: '0',
            videoFiles: [],
            pdfFiles: [],
            exam: '0',
            numberQuestion: '0',
            durationExam: '00:00',
            id_exam: '',
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

    const fetchContent = async () => {
        console.log("ppppppp", id)
        try {
            const data = await fetchContentCourse(id);
            setContentCourse(data.data.data);
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
                        duration: durationInMinutes
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

    const handleNumberQuestionsChange = (index, event) => {
        const value = event.target.value;
        const updatedContent = [...dynamicContent];
        updatedContent[index].numberQuestion = value;
        setDynamicContent(updatedContent);
    };

    const handleExamDurationChange = (index, event) => {
        const value = event.target.value;
        const updatedContent = [...dynamicContent];
        updatedContent[index].durationExam = value;
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

    const getTotalNumberOfContent = () => {
        return dynamicContent.length;
    };

    useEffect(() => {
        fetchContent();
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

    const handleNext = (dynamicContent) => {
        // Validate that each content item has a photo
        const missingPhoto = dynamicContent.some(content => !content.photo);
        const missingName = dynamicContent.some(content => content.name === "عنوان المحتوى");
        const missingVideoFiles = dynamicContent.some(content => content.videoFiles.length === 0);

        if (missingPhoto) {
            alert("الرجاء ادخال الصورة");
            return;
        }  if (missingName) {
            alert("الرجاء ادخال الاسم");
            return;
        }  if (missingVideoFiles) {
            alert("الرجاء اضافة فيديوهات");
            return;
        }


        // Proceed to the next page if validation passes
        setError(''); // Clear any previous error
        navigate('/courses/add-online-courses/AddOnlineCourse', {state: {dynamicContent, courseName, id}}); // Replace '/next-page' with your actual next page route
    };

    const handlePrevious = () => {
        navigate(-1);
    };

    return (
        <div className={"ContentOnlineCourses"}>
            <div className={"ContentOnlineCourses_navbar"}>
                <div className="navbar-title">
                    <text>محتويات الدورة</text>
                    <span>{getTotalNumberOfVideos()} فيديوهات / {getTotalNumberOfContent()} محتويات </span>
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
                        <div className={"dynamicContent"}>
                            <div key={index} className={"title-content"}>
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

                            <VideoUpload
                                index={index}
                                handleFileUpload={handleFileUpload}
                                handleDeleteVideo={handleDeleteVideo}
                                handleVideoDragStart={handleVideoDragStart}
                                handleVideoDragOver={handleVideoDragOver}
                                handleVideoDrop={handleVideoDrop}
                                content={content}
                            />
                            <PdfUpload
                                index={index}
                                handleFileUploadPdf={handleFileUploadPdf}
                                handleDeletePdf={handleDeletePdf}
                                content={content}
                            />
                            <div className={'dynamicContent-input-exam'}>
                                <label className={"exam-label"} onClick={() => setShowPopup(true)}>
                                    <IoMdAdd className="add-icon"/>
                                    إضافة اختبار
                                </label>
                                {content.numberQuestion !== '0' && content.durationExam !== '00:00' && (
                                    <div className="exam-details">
                                        <p>عدد الأسئلة: {content.numberQuestion}</p>
                                        <p>مدة الامتحان: {content.durationExam}</p>
                                    </div>
                                )}
                                {showPopup && (
                                    <div className="popup" onClick={handleClosePopup}>
                                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                            <label>
                                                عدد الاسئلة
                                                <input type="text" value={content.numberQuestion}
                                                       onChange={(event) => handleNumberQuestionsChange(index, event)}
                                                       required/> </label>
                                            <label>
                                                مدة الامتحان (في الدقائق)
                                                <input
                                                    type="text"
                                                    value={content.durationExam}
                                                    onChange={(event) => handleExamDurationChange(index, event)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                اختر الامتحان
                                                <select
                                                    onChange={(event) => handleNumberQuestionsChange(index, event)}
                                                    required
                                                >  {contentCourse.map(element =>
                                                    <option key={element.id}
                                                            value={contentExam}
                                                    >{element.name}</option>)}</select>
                                            </label>
                                            <div className={"arrow-icon-exam"}>
                                                <FaArrowLeft/>
                                            </div>
                                        </div>
                                    </div>
                                )}</div>
                        </div>
                    ))}
                </div>
                <div style={{display: 'flex', justifyContent: dynamicContent.length > 0 ? 'flex-end' : 'flex-start'}}>
                    {dynamicContent.length > 0 ? (
                        <>
                            <button onClick={() => {
                                handleNext(dynamicContent)
                            }} className={"next_content"}>التالي
                            </button>
                            <button onClick={handlePrevious} className={"previous_content"}>السابق</button>
                        </>
                    ) : (
                        <button onClick={handlePrevious} className={"previous_content"}>السابق</button>
                    )}
                </div>
            </div>
            {/*{error && <div className="error-message">{error}</div>}*/}
        </div>
    );
}

export default ContentOnlineCourses;
