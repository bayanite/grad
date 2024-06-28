import '../model/model.scss'
import React, {useEffect, useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import {
    FaArrowRight,
    FaPlusCircle,
    FaRegCircle, FaRegDotCircle,
    FaTimes,
} from "react-icons/fa";


const ShowBank = () => {
    const latestDivRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dataModel, setDataModel] = useState([]);
    const [ids, setIds] = useState([]);
    const [idModel, setIdModel] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);

    const location = useLocation();
    const title1 = location.state?.title
    const description1 = location.state?.description
    const id1 = location.state?.id

    useEffect(() => {
        if (title1) {
            setTitle(title1);}
        if(description1){
            setDescription(description1);
        }
        if(id1){
            setIdModel(id1);
            ShowBank(id1)
        }

    }, [title1, description1,id1]);

    const ShowBank = async (id) => {
        // e.preventDefault();
        console.log("id",id)
        await fetch(`http://127.0.0.1:8000/api/exam/show/${id}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setDataModel(data);
            })
    }

    const deleteQuestion = async (e,id) => {
        // e.preventDefault();
        console.log("kkk",id)
        setIds(id);
        const d={
            "ids":[id],
        }
        try {
            console.log(JSON.stringify(ids))
            await fetch('http://127.0.0.1:8000/api/exam/deleteQusetions',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(d)
            })
                .then(response=> response.json())
                .then(data=> {
                    console.log("ggg", data)
                    if(data.data.exam==="success"){
                        setDataModel(prevState => {
                            const updatedPaper = prevState.data.exam.filter(item => item.id !== id);
                            return {...prevState, data: {...prevState.data, exam: updatedPaper}};
                        });
                    }
                });

        } catch (error) {
            console.error(error)
        }
    }

    const examData = dataModel && dataModel.data && dataModel.data.exam;
    const renderModelDivs = () => {
        return examData && Array.isArray(examData) && examData.map((value1, index1) => (
            <div key={index1} className={"model-div body "}>
                <p className={"showQuestion"} >{value1.question}</p>
                <FaTimes className={"close"} onClick={(e)=>deleteQuestion(e,value1.id)}/>
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
        const requiredFieldsEmpty = questions.some((value) => value.question.trim() === '' || value.options.some(option => option.option.trim() === ''));

        if (requiredFieldsEmpty) {
            setFormSubmitted(true); // Mark the form as submitted
            return; // Exit the function if required fields are empty
        }

        const data = {
            "id_exame":id1,
            "body":questions,
        }

        try {
            await fetch('http://127.0.0.1:8000/api/exam/addQuestions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data)

            }).then(response=> response.json()).then(data=> console.log("ggg",data));

        } catch (error) {
            console.error(error)
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
                    className={`model-title question  ${formSubmitted && (question.question.trim() === '' || question.select.trim() === '') ? 'required-field' : ''}`}
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
                حفظ
            </button>

        </div>


    );
};


export default ShowBank;