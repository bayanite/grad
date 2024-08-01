import './model.scss'
import React, { useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import {
    FaArrowRight,
    FaClock,
    FaPlusCircle,
    FaRegCalendarAlt,
    FaRegCircle,
    FaRegSquare,
    FaTimes,
    FaToggleOff,
    FaToggleOn,
    FaTrashAlt
} from "react-icons/fa";
import Model from "../../hooks/Model";


const AddModel = () => {
    const location = useLocation();
    const TypeName = location.state?.TypeName

    const latestDivRef = useRef(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [divValues, setDivValues] = useState([{ question: "", select: "خيار متعدد", options: [{ index:"",value: ""}] ,required: 0}]);
    const [activationStates, setActivationStates] = useState(Array(divValues.length).fill(false));
    console.log("divValues",divValues)

    const {createModel}=Model();

    const toggleActivation = (index) => {
        setActivationStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });

        setDivValues(prevDivValues => {
            const newDivValues = [...prevDivValues];
            newDivValues[index].required = activationStates[index] ? 0 : 1; // Set required to 0 if activated, 1 if deactivated
            return newDivValues;
        });
    };

    const renderModelDivs = () => {
        return divValues.map((value, index) => (
            <div key={index}
                 className={"model-div body"}
                 ref={index === divValues.length - 1 ? latestDivRef : null}>
                <input
                    className={`model-title question  ${formSubmitted && (value.question.trim() === '' || value.select.trim() === '') ? 'required-field' : ''}`}
                    type={"text"}
                    placeholder={"السؤال"}
                    value={value.question} onChange={(event) => handleQuestionChange(event, index)}
                    required
                />
                <select
                    className="model-select"
                    value={value.select}
                    onChange={(event) => handleSelectChange(event, index)}>
                    <option>خيار متعدد</option>
                    <option>مربعات اختيار</option>
                    <option>قائمة منسدلة</option>
                    <option>إجابة قصيرة</option>
                    <option>تاريخ</option>
                    <option>وقت</option>
                </select>
                {renderQuestionType(index)}
                <div className={"bottom_nav"}>
                    <FaPlusCircle className={"FaPlusCircle"} onClick={() => handleAddModelDiv(index)} />
                    <FaTrashAlt className={"FaPlusCircle"}  onClick={() => handleRemoveModelDiv(index)} />
                    <div className={"require"}>
                        <label style={{ "padding": "5px" }}>مطلوب</label>
                        {activationStates[index] ? (
                            <FaToggleOn
                                className={"FaToggleOn"}
                                onClick={() => toggleActivation(index)}
                            />
                        ) : (
                            <FaToggleOff
                                className={"FaToggleOff"}
                                onClick={() => toggleActivation(index)}
                            />
                        )}

                    </div>
                </div>
            </div>
        ));
    };

    const handleAddModelDiv = () => {
        const newDivValues = [...divValues];
         const requiredValue = activationStates[divValues.length] ? 1 : 0; // 1 for true, 0 for false
        newDivValues.push({ question: "", select: "خيار متعدد", options: [{ index:"",value: ""}], required: requiredValue  });
        setDivValues(newDivValues);
        if (latestDivRef.current) {
            latestDivRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleRemoveModelDiv = (index) => {
        setDivValues(prevModelDivs => prevModelDivs.filter((_, idx) => idx !== index));
    };

    const handleQuestionChange = (event, index) => {
        const newDivValues = [...divValues];
        newDivValues[index].question = event.target.value;
        setDivValues(newDivValues);
    };

    const handleSelectChange = (event, index) => {
        const newDivValues = [...divValues];
        const selectedType = event.target.value;
        newDivValues[index].select = event.target.value;
         if (["إجابة قصيرة", "تاريخ", "وقت"].includes(selectedType)) {
            newDivValues[index].options = [];
        } else {
            // If not "short answer", "date", or "time", create default option
            if (newDivValues[index].options.length > 0) {
                // Keep only the first option
                newDivValues[index].options = [newDivValues[index].options[0]];
            } else {
                // If options array is empty, create a default option
                newDivValues[index].options = [{ index: "", value: "" }];
            }
        }
        setDivValues(newDivValues);
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
        const question = divValues[questionIndex];

        const handleAddDropdowns = () => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options.push({ index: newDivValues[questionIndex].options.length, value: "" });
            setDivValues(newDivValues);
        };

        const handleChoiceChange = (event, questionIndex, choiceIndex) => {
            const newValue = event.target.value;
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options[choiceIndex].value = newValue;
            newDivValues[questionIndex].options[choiceIndex].index = choiceIndex;
            setDivValues(newDivValues);
        };

        const removeInputDropdown = (questionIndex, choiceIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
            setDivValues(newDivValues);
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

    const MultipleChoice = ( questionIndex ) => {
        const question = divValues[questionIndex];

        const handleAddChoice = (questionIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options.push({ index: newDivValues[questionIndex].options.length , value: "" });
            setDivValues(newDivValues);
        };


        const removeInputMultipleChoice = (questionIndex, choiceIndex) => {
            setDivValues(prevDivValues => {
                const newDivValues = [...prevDivValues];
                newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
                return newDivValues;
            });
        };

        const handleInputChange = (event, questionIndex, choiceIndex) => {
            const newValue = event.target.value;
            setDivValues(prevDivValues => {
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

    const CheckBoxes =(questionIndex) => {
        const question = divValues[questionIndex];

        const handleAddCheckBoxes = (index) => {
            const newDivValues = [...divValues];
            newDivValues[index].options.push({ index: newDivValues[index].options.length, value: "" });
            setDivValues(newDivValues);
        };

        const handleChoiceChange = (event, questionIndex, choiceIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options[choiceIndex].value = event.target.value;
            newDivValues[questionIndex].options[choiceIndex].index =choiceIndex;
            setDivValues(newDivValues);
        };
        const removeInputCheckBoxes = (questionIndex, choiceIndex) => {
            const newDivValues = [...divValues];
            newDivValues[questionIndex].options = newDivValues[questionIndex].options.filter((_, index) => index !== choiceIndex);
            setDivValues(newDivValues);
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
    }

    const renderQuestionType = (index) =>{
        const selectValue = divValues[index].select;
        switch (selectValue) {
            case "خيار متعدد":
                return MultipleChoice (index);
            case "مربعات اختيار":
                return CheckBoxes (index);
            case "قائمة منسدلة":
                return Dropdown (index);
            case "إجابة قصيرة":
                return ShortAnswer();
            case "تاريخ":
                return DateInput ();
            case "وقت":
                return TimeInput ();
            default:
                return null;
        }
    };

    const [inputValueTitle, setInputValueTitle] = useState('');

    const handleInputChangeTitle = (event) => {
        setInputValueTitle(event.target.value);

    };

    const [inputValueDes, setInputValueDes] = useState('');

    const handleInputChangeDes = (event) => {
        setInputValueDes(event.target.value);

    };

    const SendModel = async (e) => {
        e.preventDefault();
        // Check if any required fields are empty
        const requiredFieldsEmpty = divValues.some((value) =>{
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
        const titleEmpty = inputValueTitle.trim() === '';
        const descriptionEmpty = inputValueDes.trim() === '';
        if (titleEmpty || descriptionEmpty || requiredFieldsEmpty) {
            setFormSubmitted(true);// Mark the form as submitted
            return; // Exit the function if required fields are empty
        }
        try {
            await createModel(TypeName,inputValueTitle,inputValueDes,divValues);
            handleGoBack();
        } catch (error) {
            console.error('Error fetching courses:', error);
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
                    <button className={"save"} onClick={(e) => SendModel(e)}>
                        حفظ
                    </button>
                </>
            )}
        </div>


    );
};
export default AddModel;