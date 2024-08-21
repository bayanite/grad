import React, {useEffect, useState} from 'react';
import {FaArrowRight, FaExclamationCircle} from 'react-icons/fa';
import './showAnswer.scss';
import {useLocation} from "react-router-dom";
import Model from "../../hooks/Model";

const Review = () => {
    // const data = {
    //     title: "dd",
    //     "0": {
    //         question_id: 1,
    //         question: "hhhg",
    //         select: "وقت", // Time
    //         answer: [
    //             {
    //                 value: 23
    //             },
    //             {
    //                 value: 233
    //             },
    //             {
    //                 value: 2333
    //             }
    //         ]
    //     },
    //     "1": {
    //         question_id: 2,
    //         question: "dd",
    //         select: "مربعات اختيار", // Checkbox
    //         answer: [
    //             {
    //                 value: "gop",
    //                 num: 4
    //             },
    //             {
    //                 value: "g",
    //                 num: 6
    //             }
    //         ]
    //     },
    //     "2": {
    //         question_id: 5,
    //         question: "axc",
    //         select: "خيار متعدد", // Multiple choice
    //         answer: [
    //             {
    //                 value: "w",
    //                 num: 2
    //             }
    //         ]
    //     }
    // };
    const [activationStates, setActivationStates] = useState(false);
    const [getReview, setGetReview] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const location = useLocation();
    const id_online_center = location.state?.id_online_center
    const {showReview} = Model();

    useEffect(() => {
        checkServerConnectivity();
        // show();
    }, []);
    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/displayPaper/${id_online_center}`); // Replace with a basic endpoint
            if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await show();
        } catch (error) {
            // Handle the error without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
            setLoading(false); // Stop the loading spinner
        }
    };
    const show = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await showReview(id_online_center);
            if (!data || data.length === 0) {
                setError("لا توجد بيانات."); // Handle no data found
            } else {
                setGetReview(data);
            }
        } catch (error) {
            // Catch the error and handle it without logging it to the console
            setError('خطأ في الاتصال بالخادم! يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.');
        } finally {
            setLoading(false);
        }


    }

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

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
                    <p className="error-message-">{error}</p>
                </div>
            ) : (
                getReview.title && (
                    <>
                        <div className="model-div title">
                            <h1 className="showTitle">{getReview.title}</h1>
                            <p className="showTitle">{getReview.description}</p>
                        </div>
                        {Object.values(getReview).map((item, index) =>
                            item.question ? (
                                <div key={index} className="jf">
                                    <div className="show-model-question">
                                        <h5>{item.question}</h5>
                                    </div>
                                    <div>
                                        {item.select === "وقت" || item.select === "تاريخ" || item.select === "إجابة قصيرة" ? (
                                            <ul className="show-model list">
                                                {item.answer.map((ans, idx) => (
                                                    <li key={idx}>{ans.value}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <ul className="show-model list">
                                                {item.answer.map((ans, idx) => (
                                                    <li key={idx} className="list-item">
                                                        {ans.value}
                                                        {ans.num && (
                                                            <span className="circle">{ans.num}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ) : null
                        )}
                    </>
                )
            )}
        </div>
    );

};

export default Review;
