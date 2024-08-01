import React, {useEffect, useState} from 'react'
import {Outlet, useLocation} from "react-router-dom";
import {FaArrowRight, FaPlusCircle, FaToggleOff, FaToggleOn, FaTrashAlt} from "react-icons/fa";
import "./showAnswer.scss"
import Model from "../../hooks/Model";
const ShowAnswer = () => {
    const [activationStates, setActivationStates] = useState(false);
    const [getFormUser, setGetFormUser] = useState([]);
    const location = useLocation();
    const id_user = location.state?.id_user
    const id_online_center = location.state?.id_online_center
    const {displayUser}=Model();

    useEffect(() => {
        show();
    }, []);
    const show= async () => {
        try {
            const data = await displayUser(id_user,id_online_center);
            setGetFormUser(data)
        } catch (error) {
            console.error('Error fetching courses:', error);
        }

    }
    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };
    const getFormUsers = getFormUser && getFormUser.data;

    return (
        <div className={"model"}>
            <div className={"go"}>
                <FaArrowRight className="back-button" onClick={handleGoBack} />
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
