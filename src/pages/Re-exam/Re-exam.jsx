// import React, {useEffect, useState} from 'react';
// import { FaArrowRight, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
// import { BsSendCheck } from "react-icons/bs";
// import usesSetting from "../../hooks/userSetting";
// import Spinner from "react-spinner-material";
// import showCertificateTamplate from "../../hooks/showCertificateTamplate";
// import ReExam from "../../hooks/Re-exam";
//
// const Re_exam = () => {
//
//     const [orderReExam, setOrderReExam] = useState([]);
//     const [loading, setLoading] = useState(true);
//     console.log("44444444444",orderReExam); // Check the fetched data here
//
//     const {fetchOrderReExam,checkOrder} = ReExam();
//     const getOrder = async () => {
//         try {
//             const data = await fetchOrderReExam();
//             console.log("333333333333",data.data); // Check the fetched data here
//             setOrderReExam(data.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching courses:', error);
//         }
//     };
//
//
//     const checkOrderExam = async (id, status) => {
//         try {
//             const data = await checkOrder(id, status);
//             getOrder();
//             console.log("User status updated:", data);
//         } catch (error) {
//             console.error('Error checking user:', error);
//         }
//     };
//
//     useEffect(() => {
//         getOrder();
//     }, []);
//     useEffect(() => {
//         if (!navigator.onLine) {
//             setHasInternet(false);
//             setLoading(false);
//         }
//     }, []);
//
//     const [search, setSearch] = useState('');
//
//
//     const handleGoBack = () => {
//         window.history.back();
//     };
//
//     const handleSearch = (event) => {
//         setSearch(event.target.value);
//     };
//
//     const filteredRows = orderReExam.filter(row =>
//         row.user_name?.toLowerCase().includes(search.toLowerCase()) ||
//         row.course_name?.toLowerCase().includes(search.toLowerCase())
//     );
//
//
//     return (
//         <div className="ShowCopys">
//             <>
//                 <div className="ShowCopy-navbar">
//                     <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
//                     {` طلبات إعادة الامتحان `}
//                     <input
//                         type="text"
//                         placeholder="بحث..."
//                         className="search-input"
//                         onChange={handleSearch}
//                     />
//                 </div>
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                         <tr>
//                             <th>اسم الطالب</th>
//                             <th>اسم الدورة</th>
//                             <th>تاريخ الدورة</th>
//                             <th>عدد مرات الاعادة</th>
//                             <th>حالة الطلب</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {filteredRows.map((row, index) => (
//                             <tr key={index}>
//                                 <td>{row.user_name} {row.user_lastname} </td>
//                                 <td>{row.course_name}</td>
//                                 <td>{row.created_at}</td>
//                                 <td>{row.count}</td>
//                                 <td>
//                                     <FaRegCheckCircle className="FaRegCheckCircle-"
//                                                       onClick={() => checkOrderExam(row.id, 1)}
//
//                                     />
//                                     <FaRegTimesCircle className="FaRegTimesCircle-"
//                                                       onClick={() => checkOrderExam(row.id, 0)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </>
//         </div>
//     );
// };
//
// export default Re_exam;
import React, {useEffect, useState} from 'react';
import {FaArrowRight, FaExclamationCircle, FaRegCheckCircle, FaRegTimesCircle} from 'react-icons/fa';
import ReExam from "../../hooks/Re-exam";
import Spinner from "react-spinner-material";

const Re_exam = () => {
    const [orderReExam, setOrderReExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(null); // State for handling "no data" message

    const { fetchOrderReExam, checkOrder } = ReExam();

    const getOrder = async () => {
        setLoading(true); // Ensure loading state is set before fetching data
        try {
            const data = await fetchOrderReExam();

            // Check the actual response structure
            console.log('Fetched data:', data);

            if (data && data.data) {
                setOrderReExam(data.data);
                setNoData(data.data.length === 0 ? 'لا توجد بيانات لعرضها' : null);
            } else {
                setError('فشل الاتصال بالخادم');
            }
        } catch (error) {
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت');
            } else {
                setError('فشل الاتصال بالخادم');
            }
        } finally {
            setLoading(false); // Ensure loading state is reset regardless of success or failure
        }
    };

    const checkOrderExam = async (id, status) => {
        try {
            await checkOrder(id, status);
            getOrder(); // Refresh the list after updating status
        } catch (error) {
            console.error('Error checking order:', error);
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت');
            } else {
                setError('فشل الاتصال بالخادم');
            }
        }
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredRows = orderReExam.filter(row =>
        row.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        row.course_name?.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        getOrder();
    }, []);

    return (
        <div className="ShowCopys">
            <div className="ShowCopy-navbar">
                <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
                {` طلبات إعادة الامتحان `}
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-input"
                    onChange={handleSearch}
                />
            </div>
            <div className="table-container">
                {loading ? (
                    <div className="spinner-container2">
                        <div className="spinner" /> {/* Loading spinner */}
                    </div>
                ) : error ? (
                    <div className="spinner-container2">
                        <FaExclamationCircle className="error-icon" /> {/* Error icon */}
                        <p className="error-message-">{error}</p>
                    </div>
                ) : noData ? (
                    <div className="spinner-container2">
                        <p className="error-message-">{noData}</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>اسم الطالب</th>
                            <th>اسم الدورة</th>
                            <th>تاريخ الدورة</th>
                            <th>عدد مرات الاعادة</th>
                            <th>حالة الطلب</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.user_name} {row.user_lastname}</td>
                                <td>{row.course_name}</td>
                                <td>{row.created_at}</td>
                                <td>{row.count}</td>
                                <td>
                                    <FaRegCheckCircle
                                        className="FaRegCheckCircle-"
                                        onClick={() => checkOrderExam(row.id, 1)}
                                    />
                                    <FaRegTimesCircle
                                        className="FaRegTimesCircle-"
                                        onClick={() => checkOrderExam(row.id, 0)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Re_exam;