import '../model/model.scss';
import React, {useEffect, useRef, useState} from "react";
import {
    FaArrowRight,
    FaPlusCircle,
    FaRegCircle,
    FaRegDotCircle,
    FaTimes,
    FaTrashAlt,
} from "react-icons/fa";



const AddBank = () => {

    const latestDivRef = useRef(null);
    const [divValues, setDivValues] = useState([{ question: "", options: [{ option: "", correct: "0" }] }]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    console.log("saveDisabled",saveDisabled)
    useEffect(() => {
        checkSaveButtonState(); // Check initial state of save button
    }, [divValues]); // Re-run when divValues change

    const checkSaveButtonState = () => {
        const isAtLeastOneCorrect = divValues.every((value) =>
            value.options.some((option) => option.correct === 1)
        );
        setSaveDisabled(!isAtLeastOneCorrect); // Enable save button if at least one correct option is found
    };

    const renderModelDivs = () => {
        return divValues.map((value, index) => (
            <div key={index} className={"model-div body bank"} ref={index === divValues.length - 1 ? latestDivRef : null}>
                <input
                    className={`model-title question  ${formSubmitted && (value.question.trim() === '') ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={"السؤال"}
                    value={value.question} onChange={(event) => handleQuestionChange(event, index)}
                    required
                />
                {MultipleChoice(index)}
                <div className={"bottom_nav"}>
                    <FaPlusCircle className={"FaPlusCircle"} onClick={() => handleAddModelDiv(index)} />
                    <FaTrashAlt className={"FaPlusCircle"} onClick={() => handleRemoveModelDiv(index)} />
                </div>
            </div>
        ));
    };

    const handleAddModelDiv = () => {
        const newDivValues = [...divValues];
        newDivValues.push({ question: "", options: [{ option: "", correct: "0" }] });
        setDivValues(newDivValues);
        if (latestDivRef.current) {
            latestDivRef.current.scrollIntoView({ behavior: "smooth" });
        }
        checkSaveButtonState();
    };

    const handleRemoveModelDiv = (index) => {
        setDivValues((prevModelDivs) => {
            const updatedModelDivs = [...prevModelDivs];
            updatedModelDivs.splice(index, 1);
            return updatedModelDivs;
        });
        checkSaveButtonState();
    };

    const handleQuestionChange = (event, index) => {
        const newDivValues = [...divValues];
        newDivValues[index].question = event.target.value;
        setDivValues(newDivValues);
    };


    const MultipleChoice = (questionIndex) => {
        const question = divValues[questionIndex];

        const handleInputChange = (event, choiceIndex) => {
            const { value } = event.target;
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options[choiceIndex].option = value;
            setDivValues(newDivValues);
        };

        const handleAddChoice = () => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options.push({ option: "", correct: "0" });
            setDivValues(newDivValues);
            checkSaveButtonState();
        };

        const handleRemoveChoice = (choiceIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options.splice(choiceIndex, 1);
            setDivValues(newDivValues);
            checkSaveButtonState();
        };
        const handleToggleIcon = (questionIndex, choiceIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.map((option, index) => {
                if (index === choiceIndex) {
                    return { ...option, correct: option.correct ? 0 : 1 }; // Toggle between 1 and 0
                }
                return { ...option, correct: 0 }; // Set other options to 0
            });
            setDivValues(newDivValues);
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



    const [inputValueTitle, setInputValueTitle] = useState('');

    const handleInputChangeTitle = (event) => {
        setInputValueTitle(event.target.value);
    };

    const [inputValueDes, setInputValueDes] = useState('');

    const handleInputChangeDes = (event) => {
        setInputValueDes(event.target.value);
    };

    const SendBank = async (e) => {
        e.preventDefault();
        // Check if any required fields are empty
        const requiredFieldsEmpty = divValues.some((value) => value.question.trim() === '' || value.options.some(option => option.option.trim() === ''));
        const titleEmpty = inputValueTitle.trim() === '';
        const descriptionEmpty = inputValueDes.trim() === '';
        if (titleEmpty || descriptionEmpty || requiredFieldsEmpty) {
            setFormSubmitted(true);// Mark the form as submitted
            return; // Exit the function if required fields are empty
        }

        const data = {
            "title": inputValueTitle,
            "description": inputValueDes,
            "body": divValues,
        }

        console.log("jj", JSON.stringify(data))
        try {
            await fetch('http://127.0.0.1:8000/api/exam/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data)

            }).then(response => response.json()).then(data => console.log("ggg", data));

        } catch (error) {
            console.error(error)
        }
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
                <input
                    className={`model-title font ${formSubmitted && inputValueTitle.trim() === '' ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={" نموذج دون عنوان"}
                    value={inputValueTitle}
                    onChange={handleInputChangeTitle}
                    required
                />
                <input
                    className={`model-title ${formSubmitted && inputValueDes.trim() === '' ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={"وصف النموذج"}
                    value={inputValueDes}
                    onChange={handleInputChangeDes}
                    required
                />
                <div className={"add-button-container"}>
                    <FaPlusCircle className={"add-button"} onClick={handleAddModelDiv} />
                </div>
            </div>
            {divValues.length > 0 && (
                <>
                    {renderModelDivs()}
                    <button className={"save"} onClick={(e) => SendBank(e)} disabled={saveDisabled}>
                        حفظ
                    </button>
                </>
            )}
        </div>
    );
};

export default AddBank;

