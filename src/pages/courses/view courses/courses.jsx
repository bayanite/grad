import React, {useEffect, useRef, useState} from 'react';
import {FaExclamationCircle, FaPlus} from 'react-icons/fa';
import './courses.scss';
import './CreateTemplate';
import {MdMoreVert} from 'react-icons/md';
import CreateTemplate from './CreateTemplate';
import {useNavigate} from 'react-router-dom';
import useGetCourses from "../../../hooks/showcourses";
import deleteCourse from '../../../hooks/deleteTemplate';
import Swal from "sweetalert2";
import EditCourse from "../edit-course/editCourse";

const Courses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [editPopupIndex, setEditPopupIndex] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [noData, setNoData] = useState(null); // New state for handling errors


    const navigate = useNavigate();
    const menuRefs = useRef([]);
    const {fetchCourses} = useGetCourses();

    const toggle = () => {
        setIsOpen(!isOpen);
        setCurrentCourse(null); // Reset current course data when adding a new course
    };

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const toggleEditPopup = (index) => {
        setEditPopupIndex(editPopupIndex === index ? null : index);
        setCurrentCourse(editPopupIndex === index ? null : courses[index]); // Set current course data when editing
    };

    const handleAddOnlineCourse = (courseName, id) => {
        navigate('/courses/add-online-courses/AddOnlineCourse', {state: {courseName, id}});
    };

    const handleAnnounceCourse = (courseName, id) => {
        navigate('/courses/announce-course/AnnounceCourse', {state: {courseName, id}});
    };

    const handleShowCopy = (courseName, id) => {
        navigate('/courses/show-copy/ShowCopy', {state: {courseName, id}});
    };

    const handleDelete = async (id) => {
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
            const isDeleted = await deleteCourse(id);
            if (isDeleted) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
                getCourses();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'فشل الحذف!',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickInsideMenu = menuRefs.current.some((menuRef) => menuRef && menuRef.contains(event.target));
            const isClickInsideEditPopup = editPopupIndex !== null && event.target.closest('.popup');

            if (!isClickInsideMenu && !isClickInsideEditPopup) {
                setOpenMenuIndex(null);
                setEditPopupIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editPopupIndex]);

    const getCourses = async () => {
        try {
            const data = await fetchCourses();
            if (data && data.data && data.data.data) {
                setCourses(data.data.data);
                if (data.data.data.length === 0) {
                    setNoData('لا توجد بيانات لعرضها');
                }
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        } catch (error) {
            if (!navigator.onLine) {
                setError('لايوجد اتصال بالإنترنت');
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className={'courses'}>

            <div className={'create_template'}>
                <FaPlus className={'FaPlus'} onClick={toggle}/>
                <p className={'title_template'}>إضافة دورة جديدة</p>
                {isOpen && <CreateTemplate toggle={toggle} onSave={getCourses}/>}
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
            ) : courses.length === 0 ? (
                <div className="spinner-container2">
                    <div className="error-message-">
                        {noData}
                    </div>
                </div>
            ) : (
                <>

                    {courses.map((item, index) => (
                        <div key={item.id} className={'template'} ref={(ref) => (menuRefs.current[index] = ref)}>
                            <img
                                src={process.env.REACT_APP_API_PATH + "/Uploads/" + item.photo}
                                onClick={() => handleShowCopy(item.name, item.id)}
                                className="img_template"
                                alt="Course"
                            />
                            <div className={'content'}>
                                <h1 className={'name_template'}>{item.name}</h1>
                                <h5 className={'title_template'}>حول الدورة</h5>
                                <p className={'about_template'}>{item.about}</p>
                            </div>
                            <MdMoreVert className={'MdMoreVert'} onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(index);
                            }}/>
                            {openMenuIndex === index && (
                                <div className="menu">
                                    <div className="menu-content">
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            toggleEditPopup(index);
                                        }}>تعديل</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddOnlineCourse(item.name, item.id);
                                        }}>اضافة دورة أون لاين</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnnounceCourse(item.name, item.id);
                                        }}>اعلان عن دورة في المركز</p>
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                        }}>حذف</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {editPopupIndex !== null && (
                        <EditCourse
                            toggle={() => toggleEditPopup(null)}
                            onSave={getCourses}
                            courseData={currentCourse}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Courses;
