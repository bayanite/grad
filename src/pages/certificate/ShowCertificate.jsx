
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {FaArrowRight, FaExclamationCircle, FaEye, FaFilter} from "react-icons/fa";
import './ShowCertificate.scss';
import {TbListDetails} from "react-icons/tb";
import showCertificateTamplate from "../../hooks/showCertificateTamplate";

const ShowCertificate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const courseName = location.state?.courseName;

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('date');
    const [search, setSearch] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [filterCourseName, setFilterCourseName] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);
    const [certificateUser, setCertificateUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for handling errors
    const [noData, setNoData] = useState(null); // New state for handling errors

    const {fetchCertificateUser} = showCertificateTamplate();

    const handleShowTamplate = () => {
        navigate("/certificate/ShowTamplate");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleFilterApply = () => {
        filterAndSortRows();
        setFilterVisible(false); // Close the filter modal after applying filters
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const getCertificateUsers = async () => {
        try {
            // if (data && data.data && data.data.data) {
            //     setUser(data.data.data);
            //     if (data.data.data.length === 0) {
            //         setNoData('لا توجد بيانات لعرضها');
            //     }
            // } else {
            //     setError('فشل الاتصال بالخادم');
            // }
            const data = await fetchCertificateUser();
            if (data) {
                setCertificateUser(data);
                if (data.length === 0) {
                    setNoData('لا توجد بيانات لعرضها');
                }
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        } catch (error) {
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت');
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        getCertificateUsers();
    }, []);

    useEffect(() => {
        filterAndSortRows();
    }, [certificateUser, search, filterType, filterCourseName, sortOrder, sortField]);

    const filterAndSortRows = () => {
        const filtered = certificateUser.filter((val) => {
            return (
                (!search || val.name.toLowerCase().includes(search.toLowerCase())) &&
                (!filterType || val.type === filterType) &&
                (!filterCourseName || val.course === filterCourseName)
            );
        }).sort((a, b) => {
            if (sortField === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortField === 'number') {
                return sortOrder === 'asc'
                    ? a.number - b.number
                    : b.number - a.number;
            }
            return 0;
        });

        setFilteredRows(filtered);
    };

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
        setFilterCourseName(''); // Reset course name filter when type changes
    };

    const getCoursesForType = (type) => {
        if (type === '') {
            return Array.from(new Set(certificateUser.map(row => row.course)));
        }
        return Array.from(new Set(certificateUser.filter(row => row.type === type).map(row => row.course)));
    };

    const handleViewCertificate = (imageUrl) => {
        window.open(`${process.env.REACT_APP_API_PATH}/Uploads/${imageUrl}`, '_blank');
    };

    return (
        <div className={'ShowCopys'}>
            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                {`  الشهادات الصادرة  `}
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-filter"
                    value={search}
                    onChange={handleSearch}
                />
                <FaFilter className="filter-icon" onClick={() => setFilterVisible(true)}/>
                {filterVisible && (
                    <div className="filter-modal">
                        <div className="filter-content">
                            <h2>تصفية النتائج</h2>
                            <label>
                                نوع التسجيل:
                                <select value={filterType} onChange={handleFilterTypeChange}>
                                    <option value="">الكل</option>
                                    <option value="أون لاين">أون لاين</option>
                                    <option value="مركز">مركز</option>
                                </select>
                            </label>
                            <label>
                                اسم الدورة:
                                <select value={filterCourseName} onChange={(e) => setFilterCourseName(e.target.value)}>
                                    <option value="">الكل</option>
                                    {getCoursesForType(filterType).map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                ترتيب حسب التاريخ:
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="asc">من الأقدم</option>
                                    <option value="desc">من الأحدث</option>
                                </select>
                            </label>
                            <button className={"apply-filter"} onClick={handleFilterApply}>تطبيق</button>
                            <button className={"close-filter"} onClick={() => setFilterVisible(false)}>إغلاق</button>
                        </div>
                    </div>
                )}
                <div className="navbar-button-">
                    <button className={"show"} onClick={handleShowTamplate}>
                        عرض القوالب
                    </button>
                    <TbListDetails className="icon-show" onClick={handleShowTamplate}/>
                </div>
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
                ) : certificateUser.length === 0 ? (
                    <div className="spinner-container2">
                        <div className="error-message-">
                            {noData}
                        </div>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>الرقم التسلسلي</th>
                            <th>تاريخ المنح</th>
                            <th>الاسم</th>
                            <th>نوع التسجيل</th>
                            <th>اسم الدورة</th>
                            <th>
                                عرض الشهادة
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {(
                            filteredRows.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.number}</td>
                                    <td>{row.created_at}</td>
                                    <td>{row.profile_name} {row.profile_lastname}</td>
                                    <td>{row.type}</td>
                                    <td>{row.course_name}</td>
                                    <td>
                                        <FaEye className="FaEye"
                                               onClick={() => handleViewCertificate(row.certificate)}/>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ShowCertificate;
