import './model.scss'
import React, {useEffect, useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import {
    FaArrowRight,
    FaClock, FaExclamationCircle,
    FaPlusCircle,
    FaRegCalendarAlt,
    FaRegCircle,
    FaRegSquare,
    FaTimes,
    FaToggleOff,
    FaToggleOn,
} from "react-icons/fa";
import Model from "../../hooks/Model";
import Swal from "sweetalert2";


const ShowModel = () => {
    const [loading, setLoading] = useState(true); // Loading state
    const [loading1, setLoading1] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const latestDivRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dataModel, setDataModel] = useState([]);
     const [ids, setIds] = useState([]);
    const [idModel, setIdModel] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activationStates, setActivationStates] = useState(Array(questions.length).fill(false));
    const location = useLocation();
    const title1 = location.state?.title
    const description1 = location.state?.description
    const id1 = location.state?.id

    const {detailsForm,deleteQuestion,addQuestion}=Model()

    useEffect(() => {
        if (title1) {
            setTitle(title1);}
        if(description1){
            setDescription(description1);
        }
        if(id1){
            setIdModel(id1);
            // setLoading(true); // Start loading when fetching data
            // formDetails(id1)
            checkServerConnectivity();
        }

    }, [title1, description1,id1]);

    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/show/${id1}`); // Replace with a basic endpoint
            if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await formDetails(id1);
        } catch (error) {
            // Handle the error without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
            setLoading(false); // Stop the loading spinner
        }
    };
    const formDetails = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await detailsForm(id);
            if (!data || !data.data || !data.data.paper || data.data.paper.length === 0) {
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
        //     setLoading(false); // Stop loading when data is fetched
        // } catch (error) {
        //     // setError('Failed to fetch the data. Please try again.');
        //     setLoading(false); // Stop loading even if there is an error
        //     console.error('Error fetching courses:', error);
        // }
    }

    const questionDelete = async (id) => {
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
                const isDeleted = await deleteQuestion(id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setDataModel(prevState => {
                        const updatedPaper = prevState.data.paper.filter(item => item.id !== id);
                        return {...prevState, data: {...prevState.data, paper: updatedPaper}};
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

    const paperData = dataModel && dataModel.data && dataModel.data.paper;
    const renderModelDivs = () => {
        return paperData && Array.isArray(paperData) && paperData.map((value1, index1) => (
            <div key={index1} className={"model-div body"}>
               <p className={"showQuestion"} >{value1.question}</p>
               <FaTimes className={"close"} onClick={()=>questionDelete(value1.id)}/>
                {renderQuestionType(value1.select, index1)} {/* Pass options array to renderQuestionType */}
            </div>
            ));
    };

    const TimeInput=()=> {
        return (
            <div className={"DateInput"}>
                <input type="time"  disabled />
                <FaClock className={"FaClock"} />
            </div>
        );
    }

    const DateInput=()=> {
        return (
            <div className={"DateInput"}>
                <input type="date"  disabled />
                <FaRegCalendarAlt className={"FaRegCalendarAlt"} />
            </div>
        );
    }

    const ShortAnswer=()=> {
        return (
            <div className={"shortAnswer"}>
                <textarea placeholder="نص الإجابة" readOnly/>
            </div>
        );
    }

    const Dropdown = ( questionIndex ) => {
        const question = paperData[questionIndex];

        if(question) {
        return (
            <div className={"MultipleChoice"}>
                {question.optionpaper.map((option, optionIndex) => (
                    <div key={optionIndex} className={"MultipleChoiceBody"}>
                        <span className="dropdown-number">{optionIndex + 1}.</span> {/* Use choiceIndex instead of index */}
                        <option>{option.value}</option>

                    </div>
                ))}

            </div>
        );}
    };

    const MultipleChoice = ( questionIndex ) => {
        const question = paperData[questionIndex];

         if(question) {
             return (
                 <div className={"MultipleChoice"}>
                     {question.optionpaper.map((option, optionIndex) => (
                         <div key={optionIndex} className={"MultipleChoiceBody"}>
                             <FaRegCircle className={"FaRegCircle"}/>
                             <option>{option.value}</option>
                         </div>
                     ))}

                 </div>

             );
         }
    };

    const CheckBoxes =(questionIndex) => {
        const question = paperData[questionIndex];

          if(question){
        return (
            <div className={"MultipleChoice"}>
                {question.optionpaper.map((option, optionIndex) => (
                    <div key={optionIndex} className={"MultipleChoiceBody"}>
                        <FaRegSquare className={"FaRegCircle"} />
                        <option>{option.value}</option>

                    </div>
                ))}

            </div>
        );
        }
    }

    const renderQuestionType = (select, index) => {
        switch (select) {
            case "خيار متعدد":
                return MultipleChoice( index);
            case "مربعات اختيار":
                return CheckBoxes( index);
            case "قائمة منسدلة":
                return Dropdown( index);
            case "إجابة قصيرة":
                return ShortAnswer();
            case "تاريخ":
                return DateInput();
            case "وقت":
                return TimeInput();
            default:
                return null;
        }
    };

    //***************** add question *****************//

    const questionAdd = async (e) => {
        e.preventDefault();
        // Check if any required fields are empty
        const requiredFieldsEmpty = questions.some((value) => {
            if (value.question.trim() === '' || value.select.trim() === '') {
                return true; // If question or select field is empty, return true
            }

            // If select field is not empty and options are required
            if (['خيار متعدد', 'مربعات اختيار', 'قائمة منسدلة'].includes(value.select.trim())) {
                // Check if any option is empty
                return value.options.some(option => option.value.trim() === '');
            }

            return false; // If all conditions pass, return false
        });

        if (requiredFieldsEmpty) {
            setFormSubmitted(true); // Mark the form as submitted
            return; // Exit the function if required fields are empty
        }
        try {
            setLoading1(true); // Start the loading state
            await addQuestion(id1,questions);
            await Swal.fire({
                icon: 'success',
                title: 'تمت الإضافة بنجاح',
                showConfirmButton: false,
                timer: 1500
            });
              setQuestions([]);
             await formDetails(id1)

        } catch (error) {

            console.error('Error fetching courses:', error);
        }finally {
            setLoading1(false); // End the loading state
        }
    };

    const handleAddModelDiv = () => {
        const newDivValues = [...questions];
        const requiredValue = activationStates[questions.length] ? 1 : 0; // 1 for true, 0 for false
        newDivValues.push({ question: "", select: "خيار متعدد", options: [{ index:"",value: ""}], required: requiredValue  });
        setQuestions(newDivValues);
        if (latestDivRef.current) {
            latestDivRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSelectChange = (event, index) => {
        const newQuestions = [...questions];
        const selectedType = event.target.value;
        newQuestions[index].select = selectedType;

        // Clear options array if the selected type is "short answer", "date", or "time"
        if (["إجابة قصيرة", "تاريخ", "وقت"].includes(selectedType)) {
            newQuestions[index].options = [];
        } else {
            // If not "short answer", "date", or "time", create default option
            if (newQuestions[index].options.length > 0) {
                // Keep only the first option
                newQuestions[index].options = [newQuestions[index].options[0]];
            } else {
                // If options array is empty, create a default option
                newQuestions[index].options = [{ index: "", value: "" }];
            }
        }
        setQuestions(newQuestions);
    };

    // Function to remove a question
    const removeQuestion = (index) => {
        setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
    };

    const toggleActivation = (index) => {
        setActivationStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });

        setQuestions(prevDivValues => {
            const newDivValues = [...prevDivValues];
            newDivValues[index].required = activationStates[index] ? 0 : 1; // Set required to 0 if activated, 1 if deactivated
            return newDivValues;
        });
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

        const handleAddChoice = (questionIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options.push({ index: newDivValues[questionIndex].options.length , value: "" });
            setQuestions(newDivValues);
        };


        const removeInputMultipleChoice = (questionIndex, choiceIndex) => {
            setQuestions(prevDivValues => {
                const newDivValues = [...prevDivValues];
                newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
                return newDivValues;
            });
        };

        const handleInputChange = (event, questionIndex, choiceIndex) => {
            const newValue = event.target.value;
            setQuestions(prevDivValues => {
                const newDivValues = [...prevDivValues];
                newDivValues[questionIndex].options[choiceIndex].value = newValue;
                newDivValues[questionIndex].options[choiceIndex].index = choiceIndex;
                return newDivValues;
            });
        };

        return (
            <div className={"MultipleChoice"}>
                {question.options.map((choice, choiceIndex) => (
                    <div key={choice.index} className={"MultipleChoiceBody"}>
                        <FaRegCircle className={"FaRegCircle"} />
                        <input
                            type="text"
                            value={choice.value}
                            onChange={(event) => handleInputChange(event, questionIndex, choiceIndex)}
                            required
                        />
                        {choiceIndex === 0 ? null : ( // Render delete icon for non-first options
                            <FaTimes onClick={() => removeInputMultipleChoice(questionIndex, choiceIndex)} />
                        )}
                    </div>
                ))}
                <div className={"MultipleChoiceBody"}>
                    <FaRegCircle className={"FaRegCircle"} />
                    <button onClick={() => handleAddChoice(questionIndex)}>إضافة خيار</button>
                </div>
            </div>

        );
    };

    // Function to add options for checkbox questions
    const handleAddCheckboxOption = (questionIndex) => {
        const question = questions[questionIndex];

        const handleAddCheckBoxes = (index) => {
            const newDivValues = [...questions];
            newDivValues[index].options.push({ index: newDivValues[index].options.length, value: "" });
            setQuestions(newDivValues);
        };

        const handleChoiceChange = (event, questionIndex, choiceIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options[choiceIndex].value = event.target.value;
            newDivValues[questionIndex].options[choiceIndex].index =choiceIndex;
            setQuestions(newDivValues);
        };
        const removeInputCheckBoxes = (questionIndex, choiceIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
            setQuestions(newDivValues);
        };

        return (
            <div className={"MultipleChoice"}>
                {question.options.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className={"MultipleChoiceBody"}>
                        <FaRegSquare className={"FaRegCircle"} />
                        <input
                            type="text"
                            value={choice.value}
                            onChange={(event) => handleChoiceChange(event, questionIndex, choiceIndex)}
                            required
                        />
                        {choiceIndex === 0 ? null : ( // Render delete icon for non-first options
                            <FaTimes onClick={() => removeInputCheckBoxes(questionIndex, choiceIndex)} />
                        )}
                    </div>
                ))}
                <div className={"MultipleChoiceBody"}>
                    <FaRegSquare className={"FaRegCircle"} />
                    <button onClick={() => handleAddCheckBoxes(questionIndex)}>إضافة خيار</button>
                </div>
            </div>
        );
    };

   // Function to add options for dropdown questions
    const handleAddDropdownOption = (questionIndex) => {
        const question = questions[questionIndex];

        const handleAddDropdowns = () => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options.push({ index: newDivValues[questionIndex].options.length, value: "" });
            setQuestions(newDivValues);
        };

        const handleChoiceChange = (event, questionIndex, choiceIndex) => {
            const newValue = event.target.value;
            const newDivValues = [...questions];
            newDivValues[questionIndex].options[choiceIndex].value = newValue;
            newDivValues[questionIndex].options[choiceIndex].index = choiceIndex;
            setQuestions(newDivValues);
        };

        const removeInputDropdown = (questionIndex, choiceIndex) => {
            const newDivValues = [...questions];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
            setQuestions(newDivValues);
        };

        return (
            <div className={"MultipleChoice"}>
                {question.options.map((choice, choiceIndex) => (
                    <div key={choice.index} className={"MultipleChoiceBody"}>
                        <span className="dropdown-number">{choiceIndex + 1}.</span> {/* Use choiceIndex instead of index */}
                        <input
                            type="text"
                            value={choice.value}
                            onChange={(event) => handleChoiceChange(event, questionIndex, choiceIndex)}
                            required
                        />
                        {choiceIndex === 0 ? null : ( // Render delete icon for non-first options
                            <FaTimes onClick={() => removeInputDropdown(questionIndex, choiceIndex)} />
                        )}
                    </div>
                ))}
                <div className={"MultipleChoiceBody"}>
                    <span className="dropdown-number">{question.options.length + 1}.</span>
                    <button onClick={handleAddDropdowns}>إضافة خيار</button>
                </div>
            </div>
        );
    };

  // Function to add options for ShortAnswer questions
    const handleAddShortAnswerOption =()=>{
        return (
            <div className={"shortAnswer"}>
                <textarea placeholder="نص الإجابة" readOnly/>
            </div>
        );
    };

    // Function to add options for DateInput questions
    const handleAddDateInputOption =()=>{
        return (
            <div className={"DateInput"}>
                <input type="date"  disabled />
                <FaRegCalendarAlt className={"FaRegCalendarAlt"} />
            </div>
        );
    };

    // Function to add options for DateInput questions
    const handleAddTimeInputOption =()=>{
        return (
            <div className={"DateInput"}>
                <input type="time"  disabled />
                <FaClock className={"FaClock"} />
            </div>
        );
    };



// Function to render options for a question
    const renderOptions = (index) => {
        const selectValue = questions[index].select;
        switch (selectValue) {
            case "خيار متعدد":
                return handleAddMultipleChoiceOption (index);
            case "مربعات اختيار":
                return handleAddCheckboxOption (index);
            case "قائمة منسدلة":
                return handleAddDropdownOption (index);
            case "إجابة قصيرة":
                return handleAddShortAnswerOption();
            case "تاريخ":
                return handleAddDateInputOption();
            case "وقت":
                return handleAddTimeInputOption();
            default:
                return null;
        }
    };

// Function to render questions
    const renderQuestions = () => {
        return questions.map((question, index) => (
            <div key={index} className={"model-div body"} ref={index === questions.length - 1 ? latestDivRef : null}>
                <input
                    className={`model-title question  ${formSubmitted && (question.question.trim() === '' || question.select.trim() === '') ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={"السؤال"}
                    value={question.question}
                    onChange={(event) => handleQuestionChange(event, index)}
                    required
                />
                <select
                    className="model-select"
                    value={question.select}
                    onChange={(event) => handleSelectChange(event, index)}
                >
                    <option>خيار متعدد</option>
                    <option>مربعات اختيار</option>
                    <option>قائمة منسدلة</option>
                    <option>إجابة قصيرة</option>
                    <option>تاريخ</option>
                    <option>وقت</option>
                </select>
                <FaTimes className="close" onClick={() => removeQuestion(index)} />
                {renderOptions( index)}
                <div className={"bottom_nav"}>
                    <div className={"require"}>
                        <label style={{ "padding": "5px" }}>مطلوب</label>
                        {activationStates[index] ? (
                            <FaToggleOn className={"FaToggleOn"} onClick={() => toggleActivation(index)} />
                        ) : (
                            <FaToggleOff className={"FaToggleOff"} onClick={() => toggleActivation(index)} />
                        )}
                    </div>

                </div>
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
            <button className={"save"}  onClick={(e)=>questionAdd(e)} style={{ display: questions.length === 0 ? 'none' : 'block' }}>
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


export default ShowModel;