import React, {useState, useEffect, useRef} from 'react';
// import '../add-online-courses/AddOnlineCourse.scss';
import './ShowCopy.scss';
import {format} from 'date-fns';

import '../view courses/courses.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowRight, FaCalendarAlt, FaStar, FaToggleOff, FaToggleOn} from 'react-icons/fa';
import {MdEdit, MdMoreVert} from "react-icons/md";
import {FaUsersLine} from "react-icons/fa6";
import CopyHooks from "../../../hooks/copyHooks";
import Swal from "sweetalert2";

const ShowCopy = () => {
    const {fetchCopy, activationCopy, deleteCopy} = CopyHooks();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;
    const idc = location.state?.id;
    console.log("courseName", courseName);
    console.log("idc", idc);
    const [copy, setCopy] = useState([]);
    const getCopy = async () => {
        try {
            const data = await fetchCopy(idc);
            setCopy(data.data.data);
        } catch (error) {
            console.log('Error fetching copy data');
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
                console.log("xxxxxxxxxxx", response);
                if (response.data.data === 'success') {
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    // Update course list
                    getCopy();
                } else {
                    // Show error message from backend
                    Swal.fire({
                        title: response && response.data && response.data.data ? response.data.data : 'حدث خطأ ! الرجاء إعادة المحاولة',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } catch (error) {
                console.error('Error deleting copy:', error);
                Swal.fire(
                    'Error!',
                    'An error occurred while deleting the copy.',
                    'error'
                );
            }
        }
    };

    useEffect(() => {
        if (idc) {
            getCopy();
        }
    }, [idc]);

    const handlePrevious = () => {
        navigate('/courses');
    };

    const handleSearch = () => {
    };
    const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
        setSortOrder(newSortOrder);
    };
    const [selectedTab, setSelectedTab] = useState('all');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };
    const [isOn, setIsOn] = useState(false);

    const toggleButton = () => {
        setIsOn(prevState => !prevState);
    };
    const [activationStates, setActivationState] = useState(false);
    const toggleActivation = async (index, idOnline, isopen) => {
        try {
            const data = await activationCopy(idOnline, isopen);
            console.log("User isopen updated:", data);
            // Update the local state after successful activation copy
            setCopy(prevCopy => {
                const newCopy = [...prevCopy];
                newCopy[index] = {...newCopy[index], isopen};
                return newCopy;
            });
        } catch (error) {
            console.error('Error updating user isopen:', error);
        }
    };

    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };
    const handleShowRegistered = (id) => {
        console.log("lllllllll");
        navigate('/courses/show-registered/ShowRegistered', {state: {id}});
    };
    const handleDetailsCopy = (id, date, type) => {
        console.log("zzzzzzzzzzzzz", id);
        console.log("XXXXXXXXX", date);
        if (type === 'online') {
            navigate('/courses/detailsCopy/detailsCopyOnline', {state: {id, date}});
        } else if (type === 'center') {
            navigate('/courses/detailsCopy/DetailsCopyCenter', {state: {id,date}});
        }
    };

    const activeCopy = async (id, isopen) => {
        console.log("id", id);
        console.log("isopen", isopen);
        try {
            const data = await activationCopy(id, isopen);
            console.log("User isopen updated:", data);
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    return (
        <div className={'ShowCopys'}>
            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handlePrevious}/>
                {` دورة `}
                <span style={{color: '#D2B260', fontWeight: 'bold', marginRight: '10px'}}>{courseName}</span>
            </div>

            <div className={"usersRow"}>
                {copy.map((row, index) => (
                    <div
                        key={index}
                        className={
                            `copy-folder ${row.isopen === "0" ? 'gray' : row.id_online != null ? 'pink' : row.id_center != null ? 'green' : ''}`
                        }
                    >
                        <div className={"toggle"}>
                            {row.isopen !== null && (
                                row.isopen === "1" ? (
                                    <FaToggleOn
                                        className={"FaToggleOn"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleActivation(index, row.id, "0");
                                            console.log("FaToggleOn");
                                        }}
                                    />
                                ) : (
                                    <FaToggleOff
                                        className={"FaToggleOff"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleActivation(index, row.id, "1");
                                            console.log("FaToggleOff");
                                        }}
                                    />
                                )
                            )}
                        </div>

                        <div className="content-">
                            <div className="row">
                                <FaCalendarAlt className="icon-"/>
                                <span className="text-">{format(new Date(row.created_at), 'yyyy/MM/dd')}</span>
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
                            <MdMoreVert className={"MdMoreVert-"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMenu(index)
                                        }}/>
                            {openMenuIndex === index && (
                                <div className="menu-">
                                    <div className="menu-content-">
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowRegistered(row.id);
                                        }}>عرض المسجلين</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            handleDetailsCopy(row.id, row.created_at, row.id_online ? 'online' : 'center');
                                        }}>عرض معلومات النسخة</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            DeleteCopy(row.id);
                                        }}>حذف</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowCopy;
