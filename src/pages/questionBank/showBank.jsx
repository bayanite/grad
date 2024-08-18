import '../model/model.scss'
import React, {useEffect, useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import {
    FaArrowRight, FaExclamationCircle,
    FaPlusCircle,
    FaRegCircle, FaRegDotCircle,
    FaTimes,
} from "react-icons/fa";
import Exam from "../../hooks/Exam";
import Swal from "sweetalert2";


const ShowBank = () => {
    const [loading, setLoading] = useState(true); // Loading state
    const [loading1, setLoading1] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const latestDivRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dataModel, setDataModel] = useState([]);
    // const [ids, setIds] = useState([]);
    const [idModel, setIdModel] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);

    const location = useLocation();
    const title1 = location.state?.title
    const description1 = location.state?.description
    const id1 = location.state?.id

    const {detailsBank,deleteQuestionExam,addQuestionExam}=Exam();

    useEffect(() => {
        if (title1) {
            setTitle(title1);}
        if(description1){
            setDescription(description1);
        }
        if(id1){
            setIdModel(id1);
            // ShowBank(id1)
            checkServerConnectivity();
        }

    }, [title1, description1,id1]);

    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}exam/show/${id1}`); // Replace with a basic endpoint
            // if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await ShowBank(id1);
        } catch (error) {
            // Handle the error without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
            setLoading(false); // Stop the loading spinner
        }
    };

    const ShowBank = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await detailsBank(id);
            if (!data || !data.data || !data.data.exam || data.data.exam.length === 0) {
                setError("لا توجد بيانات."); // Handle no data found
            } else {
                setDataModel(data);
            }
        } catch (error) {
            // Catch the error and handle it without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
        } finally {
            setLoading(false);
        }
        //     setDataModel(data);
        // } catch (error) {
        //     console.error('Error fetching :', error);
        // }
    }

    const deleteQuestion = async (id) => {

        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من التراجع عن هذا!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفه!',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            try {
                // setIds(id)
                const isDeleted = await deleteQuestionExam(id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setDataModel(prevState => {
                        const updatedPaper = prevState.data.exam.filter(item => item.id !== id);
                        return {...prevState, data: {...prevState.data, exam: updatedPaper}};
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'فشل الحذف !',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                console.error('Error deleting adviser:', error);
            }
        }
    }

    const examData = dataModel && dataModel.data && dataModel.data.exam;
    const renderModelDivs = () => {
        return examData && Array.isArray(examData) && examData.map((value1, index1) => (
            <div key={index1} className={"model-div body "}>
                <p className={"showQuestion"} >{value1.question}</p>
                <FaTimes className={"close"} onClick={(e)=>deleteQuestion(value1.id)}/>
                {MultipleChoice(index1)} {/* Pass options array to renderQuestionType */}
            </div>
        ));
    };

    const MultipleChoice = ( index ) => {
        const question = examData[index];
        if (question) {
            return (
                <div className={"MultipleChoice"}>
                    {question.option.map((option, optionIndex) => (
                        <div key={optionIndex} className={"MultipleChoiceBody"}>
                            {option.correct === "1" ? (
                                <FaRegDotCircle className={"FaRegDotCircle"} />
                            ) : (
                                <FaRegCircle className={"FaRegCircle"} />
                            )}
                            <option>{option.option}</option>
                        </div>
                    ))}
                </div>
            );
        }
    };

    //***************** add question *****************//

    console.log("saveDisabled",saveDisabled)
    useEffect(() => {
        checkSaveButtonState(); // Check initial state of save button
    }, [questions]); // Re-run when divValues change

    const checkSaveButtonState = () => {
        const isAtLeastOneCorrect = questions.every((value) =>
            value.options.some((option) => option.correct === 1)
        );
        setSaveDisabled(!isAtLeastOneCorrect); // Enable save button if at least one correct option is found
    };

    const AddQuestion = async (e) => {
        e.preventDefault();
        const requiredFieldsEmpty = questions.some((value) => {
            if (value.question.trim() === '' || value.options.some(option => option.option.trim() === '')) {
                return true; // If question or select field is empty, return true
            }
        });

        if (requiredFieldsEmpty) {
            setFormSubmitted(true); // Mark the form as submitted
            return; // Exit the function if required fields are empty
        }

        try {
            setLoading1(true); // Start the loading state
            await addQuestionExam(id1,questions);
            await Swal.fire({
                icon: 'success',
                title: 'تمت الإضافة بنجاح',
                showConfirmButton: false,
                timer: 1500
            });
            setQuestions([]);
            await ShowBank(id1)

        } catch (error) {
            console.error('Error fetching courses:', error);
        }finally {
            setLoading1(false); // End the loading state
        }

    };

    const removeQuestion = (index) => {
        setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
    };

    const handleAddModelDiv = () => {
        const newDivValues = [...questions];
        newDivValues.push({ question: "",  options: [{ option: "", correct: "0" }] });
        setQuestions(newDivValues);
        if (latestDivRef.current) {
            latestDivRef.current.scrollIntoView({ behavior: "smooth" });
        }
        checkSaveButtonState();
    };

    // Function to handle question change
    const handleQuestionChange = (event, index) => {
        const newDivValues = [...questions];
        newDivValues[index].question = event.target.value;
        setQuestions(newDivValues);
    };

    // Function to add options for multiple choice questions
    const handleAddMultipleChoiceOption = (questionIndex) => {
        const question = questions[questionIndex];

        const handleInputChange = (event, choiceIndex) => {
            const { value } = event.target;
            const newDivValues = [...questions];
            newDivValues[questionIndex].options[choiceIndex].option = value;
            setQuestions(newDivValues);
        };

        const handleAddChoice = () => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options.push({ option: "", correct: "0" });
            setQuestions(newDivValues);
            checkSaveButtonState();
        };

        const handleRemoveChoice = (choiceIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options.splice(choiceIndex, 1);
            setQuestions(newDivValues);
            checkSaveButtonState();
        };
        const handleToggleIcon = (questionIndex, choiceIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.map((option, index) => {
                if (index === choiceIndex) {
                    return { ...option, correct: option.correct ? 0 : 1 }; // Toggle between 1 and 0
                }
                return { ...option, correct: 0 }; // Set other options to 0
            });
            setQuestions(newDivValues);
            checkSaveButtonState();
        };
        return (
            <div className={"MultipleChoice"}>
                {question.options.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className={"MultipleChoiceBody"}>
                        {choice.correct === 1 ? (
                            <FaRegDotCircle className={"FaRegDotCircle"} onClick={() => handleToggleIcon(questionIndex, choiceIndex)} />
                        ) : (
                            <FaRegCircle className={"FaRegCircle"} onClick={() => handleToggleIcon(questionIndex, choiceIndex)} />
                        )}
                        <input
                            type="text"
                            value={choice.option}
                            onChange={(event) => handleInputChange(event, choiceIndex)}
                            required
                        />
                        {choiceIndex === 0 ? null : ( // Render delete icon for non-first options
                            <FaTimes onClick={() => handleRemoveChoice(choiceIndex)} />
                        )}
                    </div>
                ))}
                <div className={"MultipleChoiceBody button"}>
                    <FaRegCircle className={"FaRegCircle"} />
                    <button onClick={() => handleAddChoice(questionIndex)}>إضافة خيار</button>
                </div>
            </div>
        );
    };

// Function to render questions
    const renderQuestions = () => {
        return questions.map((question, index) => (
            <div key={index} className={"model-div body bank"} ref={index === questions.length - 1 ? latestDivRef : null}>
                <input
                    className={`model-title question  ${formSubmitted && (question.question.trim() === '' || question.options.some(option => option.option.trim() === '')) ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={"السؤال"}
                    value={question.question}
                    onChange={(event) => handleQuestionChange(event, index)}
                    required
                />
                <FaTimes className="close" onClick={() => removeQuestion(index)} />
                {handleAddMultipleChoiceOption( index)}
            </div>
        ));
    };

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (

        <div className={"model"}>
            <div className={"go"}>
            <FaArrowRight className="back-button" onClick={handleGoBack}/>
            {/* Back button */}
            </div>
            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/> {/* Correctly closing the spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon" /> {/* Error icon */}
                    <p className="error-message-">{error}</p>
                </div>
            ) : (
                <>
            <div className={"model-div title"}>
                <h1 className={"showTitle"}>{title}</h1>
                <p className={"showTitle"}>{description}</p>
                <div className={"add-button-container"}>
                    <FaPlusCircle className={"add-button"} onClick={handleAddModelDiv} />
                </div>
            </div>
            {renderModelDivs()}
            {renderQuestions()}
            <button className={"save"}  onClick={(e)=>AddQuestion(e)} style={{ display: questions.length === 0 ? 'none' : 'block' }}>
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
                </>
            )}
        </div>


    );
};


export default ShowBank;