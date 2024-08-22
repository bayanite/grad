import React, {useEffect, useState} from 'react';
import {FaArrowRight, FaExclamationCircle, FaRegCheckCircle, FaRegTimesCircle} from 'react-icons/fa';
import ReExam from "../../hooks/Re-exam";

const Re_exam = () => {
    const [orderReExam, setOrderReExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(null); // State for handling "no data" message

    const {fetchOrderReExam, checkOrder} = ReExam();

    const getOrder = async () => {
        setLoading(true); // Ensure loading state is set before fetching data
        try {
            const data = await fetchOrderReExam();

            // Check the actual response structure

            if (data && data.data) {
                setOrderReExam(data.data);
                setNoData(data.data.length === 0 ? 'لا توجد بيانات لعرضها' : null);
            } else {
                setError('فشل الاتصال بالخادم !');
            }
        } catch (error) {
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت !');
            } else {
                setError('فشل الاتصال بالخادم !');
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
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت !');
            } else {
                setError('فشل الاتصال بالخادم !');
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
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
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
                        <div className="spinner"/>
                        {/* Loading spinner */}
                    </div>
                ) : error ? (
                    <div className="spinner-container2">
                        <FaExclamationCircle className="error-icon"/> {/* Error icon */}
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