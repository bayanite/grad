import React, {useEffect, useRef, useState} from 'react';
import {FaArrowRight, FaCloudUploadAlt, FaExclamationCircle} from 'react-icons/fa';
import '../courses/view courses/courses.scss';
import './ShowTamplate.scss';
import {MdFileUpload, MdMoreVert} from 'react-icons/md';
import {useNavigate} from 'react-router-dom';
import showCertificateTamplate from '../../hooks/showCertificateTamplate';
import Swal from 'sweetalert2';

const ShowTamplate = () => {
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState([]);
    const [error, setError] = useState(null);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [editPopupIndex, setEditPopupIndex] = useState(null);
    const [noData, setNoData] = useState(null); // New state for handling errors

    const navigate = useNavigate();
    const menuRefs = useRef([]);
    const [image, setImage] = useState(null);

    const {addCertificate, fetchCertificate, deleteCertificate} = showCertificateTamplate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickInsideMenu = menuRefs.current.some((menuRef) => menuRef && menuRef.contains(event.target));
            const isClickInsideEditPopup = editPopupIndex !== null && event.target.closest('.create_template');
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

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const handleGoBack = () => {
        window.history.back();
    };
    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };
    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await addCertificate(image);
            getCertificate();
            setImage('');
        } catch (error) {
            console.error('Error adding template:', error);
            setError('Failed to upload the certificate template.');
        }
    };
    // if (data && data.data && data.data.data) {
    //     setUser(data.data.data);
    //     if (data.data.data.length === 0) {
    //         setNoData('لا توجد بيانات لعرضها');
    //     }
    // } else {
    //     setError('فشل الاتصال بالخادم');
    // }
    const getCertificate = async () => {
        try {
            const data = await fetchCertificate();
            if (data && data.data && data.data.data) {
                setCertificate(data.data.data);
                if (data.data.data.length === 0) {
                    setNoData('لا توجد قوالب لعرضها');
                }
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت');
            } else {
                setError('فشل الاتصال بالخادم');
            }
            setLoading(false);
        }
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
            cancelButtonText: 'إلغاء',
        });

        if (result.isConfirmed) {
            const isDeleted = await deleteCertificate(id);
            if (isDeleted) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
                getCertificate();
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
        getCertificate();
    }, []);

    return (
        <div className={'courses-'}>

            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <p>عرض القوالب</p>
            </div>
            <div className={'courses--'}>
                <div className={'create_template-'}>
                    <div className="profile-picture-container-">
                        <label htmlFor="upload-input">
                            <div className="profile-picture-">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Profile"
                                         className="profile-image-"/>
                                ) : (
                                    <div className="default-profile-image-">
                                        <FaCloudUploadAlt className="camera-icon-"/>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="upload-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{display: 'none'}}
                        />
                    </div>
                    {image && (
                        <MdFileUpload onClick={handleUpload} className="up-icon-"/>
                    )}
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

                ) : certificate.length === 0 ? (
                    <div className="spinner-container2">
                        <div className="error-message-">
                            {noData}
                        </div>
                    </div>
                ) : (
                    <>

                        {certificate.map((item, index) => (
                            <div key={item.id} className={'template-'} ref={(ref) => (menuRefs.current[index] = ref)}>
                                <img
                                    src={process.env.REACT_APP_API_PATH + '/Uploads/' + item.photo}
                                    className="img_template-"
                                    alt="Template"
                                />
                                <MdMoreVert
                                    className={'MdMoreVert'}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(index);
                                    }}
                                />
                                {openMenuIndex === index && (
                                    <div className="menu">
                                        <div className="menu-content">
                                            <p onClick={() => handleDelete(item.id)}>حذف</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            < /div>

        </div>
    );
};

export default ShowTamplate;
