// import React, { useState, useEffect } from 'react';
// import { FaArrowRight, FaFileAlt } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
// import './detailsCopyCenter.scss';
// import CopyHooks from "../../../hooks/copyHooks";
// import { format } from "date-fns";
//
// const DetailsCopyCenter = () => {
//     const { fetchInfoCenterCopy } = CopyHooks();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const courseName = location.state?.courseName;
//     const id = location.state?.id;
//     const date = location.state?.date;
//
//     const [centerInfo, setCenterInfo] = useState(null);
//
//     const handlePrevious = () => {
//         navigate(-1);
//     };
//
//     const getInfoCenter = async () => {
//         try {
//             const data = await fetchInfoCenterCopy(id);
//             setCenterInfo(data.data[0]); // Assuming data.data is an array with one object
//         } catch (error) {
//             console.log('Error fetching copy data', error);
//         }
//     };
//
//     useEffect(() => {
//         getInfoCenter();
//     }, []);
//
//     if (!centerInfo) {
//         return <div>Loading...</div>; // Display loading state while fetching data
//     }
//
//     // Debugging logs
//     console.log('Date from location:', date);
//     console.log('Center info:', centerInfo);
//
//     // Helper function to format dates safely
//     const formatDate = (date) => {
//         return date ? format(new Date(date), 'yyyy/MM/dd') : 'Invalid Date';
//     };
//     useEffect(() => {
//         if (!navigator.onLine) {
//             setHasInternet(false);
//             setLoading(false);
//         }
//     }, []);
//
//     return (
//         <div className="AddOnlineCourse">
//             <div className='ShowCopy-navbar-'>
//                 <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
//                 <p> نسخة {format(new Date(date), 'yyyy/MM/dd')} </p>
//             </div>
//             <div className={'AddOnlineCourse_container'}>
//                 <div className={"AddOnlineCourse_Content"}>
//                     <div className={'AddOnlineCourse_input_info'}>
//                             بداية التسجيل :
//                             <div className={"data-center"}>
//                                 {formatDate(centerInfo.start)}
//                             </div>
//                             نهاية التسجيل :
//                             <div className={"data-center"}>
//                                 {formatDate(centerInfo.end)}
//                             </div>
//                             عدد المحاضرات :
//                             <div className={"data-center"}>
//                                 {centerInfo.numberContents}
//                             </div>
//                             عدد الساعات التدريبية :
//                             <div className={"data-center"}>
//                                 {centerInfo.numberHours}
//                             </div>
//                     </div>
//                 </div>
//
//                 <div className="AddOnlineCourse_Button">
//                     <div>
//                         <div className="Form_Button-show">
//                             <FaFileAlt className="button-icon" />
//                         </div>
//                         <p>
//                             {centerInfo.form ? centerInfo.form : 'لايوجد استمارة'}
//                         </p>
//                     </div>
//                     <div>
//                         <div className="Questionnaire_Button-show">
//                             <FaFileAlt className="button-icon" />
//                         </div>
//                         <p>{centerInfo.poll ? centerInfo.poll : 'لايوجد استبيان'}</p>
//                     </div>
//                 </div>
//
//                 <div className="flex-input">
//                     <div className="AddOnlineCourse_input">
//                         <label>
//                             رسوم الدورة
//                             <div>
//                                 {centerInfo.price}
//                             </div>
//                         </label>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default DetailsCopyCenter;
import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaFileAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import './detailsCopyCenter.scss';
import CopyHooks from "../../../hooks/copyHooks";
import { format } from "date-fns";
import Spinner from "react-spinner-material";

const DetailsCopyCenter = () => {
    const { fetchInfoCenterCopy } = CopyHooks();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const id = location.state?.id;
    const date = location.state?.date;

    const [centerInfo, setCenterInfo] = useState(null);
    const [hasInternet, setHasInternet] = useState(true); // State to track internet connectivity
    const [loading, setLoading] = useState(true); // State to track loading status

    const handlePrevious = () => {
        navigate(-1);
    };

    const getInfoCenter = async () => {
        try {
            const data = await fetchInfoCenterCopy(id);
            setCenterInfo(data.data[0]); // Assuming data.data is an array with one object
            setLoading(false); // Stop loading once data is fetched
        } catch (error) {
            console.log('Error fetching copy data', error);
            setLoading(false); // Stop loading in case of an error
        }
    };

    useEffect(() => {
        getInfoCenter();
    }, [id]);

    useEffect(() => {
        const handleOnlineStatus = () => {
            setHasInternet(navigator.onLine);
        };

        handleOnlineStatus(); // Check internet status on component mount

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    // Helper function to format dates safely
    const formatDate = (date) => {
        return date ? format(new Date(date), 'yyyy/MM/dd') : 'Invalid Date';
    };


    return (
        <div className="AddOnlineCourse">
            <div className='ShowCopy-navbar-'>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                <p> نسخة {formatDate(date)} </p>
            </div>
            {loading ? (
                    <div className="spinner-container">
                        <Spinner size={120} visible={true} />
                    </div>
                )
                : !hasInternet ? (
                    <div className="no-data">
                        <p>لا يوجد اتصال بالإنترنت</p>
                    </div>
                ) : centerInfo.length === 0 ? (
                    <div className="no-data">
                        <p>لا يوجد نسخ من هذه الدورة بعد</p>
                    </div>
                ) : (
                    <>

            <div className={'AddOnlineCourse_container'}>
                <div className={"AddOnlineCourse_Content"}>
                    <div className={'AddOnlineCourse_input_info'}>
                        بداية التسجيل :
                        <div className={"data-center"}>
                            {formatDate(centerInfo.start)}
                        </div>
                        نهاية التسجيل :
                        <div className={"data-center"}>
                            {formatDate(centerInfo.end)}
                        </div>
                        عدد المحاضرات :
                        <div className={"data-center"}>
                            {centerInfo.numberContents}
                        </div>
                        عدد الساعات التدريبية :
                        <div className={"data-center"}>
                            {centerInfo.numberHours}
                        </div>
                    </div>
                </div>

                <div className="AddOnlineCourse_Button">
                    <div>
                        <div className="Form_Button-show">
                            <FaFileAlt className="button-icon" />
                        </div>
                        <p>
                            {centerInfo.form ? centerInfo.form : 'لا يوجد استمارة'}
                        </p>
                    </div>
                    <div>
                        <div className="Questionnaire_Button-show">
                            <FaFileAlt className="button-icon" />
                        </div>
                        <p>{centerInfo.poll ? centerInfo.poll : 'لا يوجد استبيان'}</p>
                    </div>
                </div>

                <div className="flex-input">
                    <div className="AddOnlineCourse_input">
                        <label>
                            رسوم الدورة
                            <div>
                                {centerInfo.price}
                            </div>
                        </label>
                    </div>
                </div>
            </div>
                    </>
                )}
        </div>
    );
};

export default DetailsCopyCenter;
