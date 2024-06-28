import React, {useEffect, useState} from 'react'
import {Outlet} from "react-router-dom";
import {FaArrowRight, FaPlusCircle, FaToggleOff, FaToggleOn, FaTrashAlt} from "react-icons/fa";
import "./showAnswer.scss"
const ShowAnswer = () => {
    const [activationStates, setActivationStates] = useState(false);
    const [getFormUser, setGetFormUser] = useState([]);
    useEffect(() => {
        show();
    }, []);
    const show=async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/paper/displayUser/${11}/${2}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(data =>
                {
                    setGetFormUser(data)
                console.log("ggg", data)
            } );

        } catch (error) {
            console.error(error)
        }
    }
    const getFormUsers = getFormUser && getFormUser.data;

    return (
        <div className={"model"}>
            <div className={"go"}>
                <FaArrowRight className="back-button" />
                {/* Back button */}
            </div>
            {getFormUsers && Array.isArray(getFormUsers) && getFormUsers.length > 0 && (
                <div className={"model-div title"}>
                    <h2 className={"show-model"} style={{ color: "#D2B260" }}>
                        {getFormUsers[0].name} {getFormUsers[0].lastName}
                    </h2>
                    <h4 className={"show-model"}>{getFormUsers[0].title}</h4>
                    <p className={"show-model"}>{getFormUsers[0].description}</p>
                </div>
            )}
            {getFormUsers && Array.isArray(getFormUsers) && getFormUsers.map((item, index) => (
                <div key={index} className={"jf"}>
                    <div className={"show-model-question"}>
                        <h5>{item.question}</h5>
                    </div>
                    <div>
                        <p className={"show-model"}>{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );


}

export default ShowAnswer
