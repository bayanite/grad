import React, {useState, useEffect, useRef} from 'react';
import './ShowCopy.scss';
import {format} from 'date-fns';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowRight, FaCalendarAlt, FaExclamationCircle, FaStar, FaToggleOff, FaToggleOn} from 'react-icons/fa';
import {MdMoreVert} from "react-icons/md";
import {FaUsersLine} from "react-icons/fa6";
import CopyHooks from "../../../hooks/copyHooks";
import Swal from "sweetalert2";
import Spinner from "react-spinner-material";

const ShowCopy = () => {
        const {fetchCopy, activationCopy, deleteCopy} = CopyHooks();
        const navigate = useNavigate();
        const location = useLocation();
        const courseName = location.state?.courseName;
        const idc = location.state?.id;
        const [copy, setCopy] = useState([]);
        const [loading, setLoading] = useState(true);
        const [hasInternet, setHasInternet] = useState(true);
        const menuRef = useRef(null);
        const [openMenuIndex, setOpenMenuIndex] = useState(null);
        const [error, setError] = useState(null);
        const [noData, setNoData] = useState(null); // State for handling "no data" message
        useEffect(() => {
            if (idc) {
                getCopy();
            }

            const handleClickOutside = (event) => {
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setOpenMenuIndex(null);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [idc]);

            const getCopy = async () => {
                try {
                    const data = await fetchCopy(idc);
                    if (data && data.data&& data.data.data) {
                        setCopy(data.data.data);
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

            const DeleteCopy = async (id) => {
                const result = await Swal.fire({
                    title: 'هل أنت متأكد؟',
                    text: "لن تتمكن من التراجع عن هذا!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'نعم، احذفه!',
                    cancelButtonText: 'إلغاء'
                });

                if (result.isConfirmed) {
                    try {
                        const response = await deleteCopy(id);
                        if (response.data.data === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحذف بنجاح',
                                showConfirmButton: false,
                                timer: 1000,
                            });
                            getCopy();
                        } else {
                            Swal.fire({
                                title: response.data.data || 'حدث خطأ ! الرجاء إعادة المحاولة',
                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    } catch (error) {
                        console.error('Error deleting copy:', error);
                        Swal.fire('Error!', 'An error occurred while deleting the copy.', 'error');
                    }
                }
            };

            const handlePrevious = () => {
                navigate('/courses');
            };

            const handleShowRegistered = (id, type) => {
                navigate('/courses/show-registered/ShowRegistered', {state: {id, type}});
            };

            const handleDetailsCopy = (id, date, type) => {
                if (type === 'online') {
                    navigate('/courses/detailsCopy/detailsCopyOnline', {state: {id, date}});
                } else if (type === 'center') {
                    navigate('/courses/detailsCopy/DetailsCopyCenter', {state: {id, date}});
                }
            };

            const toggleActivation = async (index, idOnline, isopen) => {
                try {
                    await activationCopy(idOnline, isopen);
                    setCopy(prevCopy => {
                        const newCopy = [...prevCopy];
                        newCopy[index] = {...newCopy[index], isopen};
                        return newCopy;
                    });
                } catch (error) {
                    console.error('Error updating copy activation status:', error);
                }
            };

            const toggleMenu = (index) => {
                setOpenMenuIndex(openMenuIndex === index ? null : index);
            };

            const handleShowReview = (id_online_center) => {
                navigate('/users/showReview', {state: {id_online_center}});
            };

            return (
                <div className="ShowCopys">

                    <div className="ShowCopy-navbar">
                        <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                        {` دورة `}
                        <span style={{color: '#D2B260', fontWeight: 'bold', marginRight: '10px'}}>{courseName}</span>
                    </div>
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
                        <>

                            <div className="usersRow">
                                {copy.map((row, index) => (
                                    <div
                                        key={row.id}
                                        className={`copy-folder ${row.isopen === "0" ? 'gray' : row.id_online ? 'pink' : row.id_center ? 'green' : ''}`}
                                    >
                                        <div className="toggle">
                                            {row.isopen !== null && (
                                                row.isopen === "1" ? (
                                                    <FaToggleOn
                                                        className="FaToggleOn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleActivation(index, row.id, "0");
                                                        }}
                                                    />
                                                ) : (
                                                    <FaToggleOff
                                                        className="FaToggleOff"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleActivation(index, row.id, "1");
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <div className="content-">
                                            <div className="row">
                                                <FaCalendarAlt className="icon-"/>
                                                <span
                                                    className="text-">{format(new Date(row.created_at), 'yyyy/MM/dd')}</span>
                                            </div>
                                            <div className="row">
                                                <FaUsersLine className="icon-"/>
                                                <span className="text-">{row.total_bookings}</span>
                                            </div>
                                            <div className="row">
                                                <FaStar className="icon-"/>
                                                <span className="text-">{row.average_rate}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <MdMoreVert
                                                className="MdMoreVert-"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(index);
                                                }}
                                            />
                                            {openMenuIndex === index && (
                                                <div ref={menuRef} className="menu-">
                                                    <div className="menu-content-">
                                                        <p onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShowRegistered(row.id, row.id_online ? 'online' : 'center');
                                                        }}>عرض المسجلين</p>
                                                        <p onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDetailsCopy(row.id, row.created_at, row.id_online ? 'online' : 'center');
                                                        }}>عرض معلومات النسخة</p>
                                                        <p onClick={(e) => {
                                                            e.stopPropagation();
                                                            DeleteCopy(row.id);
                                                        }}>حذف</p>
                                                        <p onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShowReview(row.id_online);
                                                        }}>عرض الآراء</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            );
        };

    export default ShowCopy;
