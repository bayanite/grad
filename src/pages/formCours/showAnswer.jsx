import React, {useEffect, useState} from 'react'
import {useLocation} from "react-router-dom";
import {FaArrowRight, FaExclamationCircle} from "react-icons/fa";
import "./showAnswer.scss"
import Model from "../../hooks/Model";

const ShowAnswer = () => {
    const [activationStates, setActivationStates] = useState(false);
    const [getFormUser, setGetFormUser] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const location = useLocation();
    const id_user = location.state?.id_user
    const id_online_center = location.state?.id_online_center
    const {displayUser} = Model();

    useEffect(() => {
        checkServerConnectivity();
        // show();
    }, []);
    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/displayUser/${id_user}/${id_online_center}`); // Replace with a basic endpoint
            if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await show();
        } catch (error) {
            // Handle the error without logging it to the console
            setError('فشل في الاتصال بالخادم!.');
            setLoading(false); // Stop the loading spinner
        }
    };
    const show = async () => {
        try {
            const data = await displayUser(id_user, id_online_center);
            if (!data || data.length === 0) {
                setError("لا توجد بيانات."); // Handle no data found
            } else {
                setGetFormUser(data);
            }
        } catch (error) {
            setError('فشل في الاتصال بالخادم! ');
        } finally {
            setLoading(false);
        }


    }
    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };
    const getFormUsers = getFormUser && getFormUser.data;

    return (
        <div className="model">
            <div className="go">
                <FaArrowRight className="back-button" onClick={handleGoBack}/>
                {/* Back button */}
            </div>
            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/>
                    {/* Correctly closing the spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon"/> {/* Error icon */}
                    <p className="error-message">{error}</p>
                </div>
            ) : (
                getFormUsers && Array.isArray(getFormUsers) && getFormUsers.length > 0 && (
                    <>
                        <div className="model-div title">
                            <h2 className="show-model" style={{color: "#D2B260"}}>
                                {getFormUsers[0].name} {getFormUsers[0].lastName}
                            </h2>
                            <h4 className="show-model">{getFormUsers[0].title}</h4>
                            <p className="show-model">{getFormUsers[0].description}</p>
                        </div>
                        {getFormUsers.map((item, index) => (
                            <div key={index} className="jf">
                                <div className="show-model-question">
                                    <h5>{item.question}</h5>
                                </div>
                                <div>
                                    <p className="show-model">{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </>
                )
            )}
        </div>
    );


}

export default ShowAnswer
