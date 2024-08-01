import React, {useState, useEffect, useRef, CSSProperties} from 'react';
import {FaArrowRight, FaCloudUploadAlt,} from 'react-icons/fa';
import '../courses/view courses/courses.scss';
import './ShowTamplate.scss'
import {MdFileUpload, MdMoreVert} from 'react-icons/md';
import {useNavigate} from 'react-router-dom';
import showCertificateTamplate from "../../hooks/showCertificateTamplate";
import Swal from "sweetalert2";
import Spinner from "react-spinner-material";

import deleteCourse from "../../hooks/deleteTemplate";


const ShowTamplate = () => {
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [editPopupIndex, setEditPopupIndex] = useState(null);
    const navigate = useNavigate();
    const menuRefs = useRef([]);



    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside of the menu or the edit popup
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


    const [image, setImage] = useState(null);


    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        console.log(selectedImage)
        setImage(selectedImage)

    };
    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };
    const {addCertificate, fetchCertificate,deleteCertificate} = showCertificateTamplate();

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await addCertificate(image);
            getCertificate()
            setImage('')

        } catch (error) {
            console.error('Error adding template:', error);
        }
    };
    const getCertificate = async () => {
        try {
            const data = await fetchCertificate();
            setCertificate(data.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleDelete = async (id) => {
        // Show confirmation dialog
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
            const isDeleted = await deleteCertificate(id);
            if (isDeleted) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف بنجاح',
                    showConfirmButton: false,
                    timer: 1000,
                });
                // Update course list
                getCertificate();
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'فشل الحذف !',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        }
    }
    useEffect(() => {
        getCertificate();
    }, []);


    return (
        <div className={'courses-'}>
            {loading ? (
                <div className="spinner-container">
                    <Spinner size={120} visible={true} />
                </div>
            ) : (
                <>
            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <p>  عرض القوالب  </p>

            </div>
            <div className={'courses--'}>
                <div className={'create_template-'}>
                    {/*<FaPlus className={'FaPlus'} onClick={toggle}/>*/}
                    <div className="profile-picture-container-">
                        <label htmlFor="upload-input">
                            <div className="profile-picture-">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Profile" className="profile-image-"/>
                                ) : (
                                    <div className="default-profile-image-">
                                        <FaCloudUploadAlt
                                            className="camera-icon-"/>
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
                    {/* Conditional rendering of the upload button */}
                    {image && (
                        <MdFileUpload onClick={handleUpload}
                                      className="up-icon-"/>
                    )}
                    {/*<p className={'title_template'}>إضافة قالب شهادة جديد </p>*/}
                    {/*{isOpen && <CertificateTamplateAdd toggle={toggle} />}*/}
                </div>

                {certificate.map((item, index) => (
                    <div key={item.id} className={'template-'}
                         ref={(ref) => (menuRefs.current[index] = ref)}>
                        <img src={process.env.REACT_APP_API_PATH + "/Uploads/" + item.photo}
                             className="img_template-"/>

                        <MdMoreVert className={'MdMoreVert'} onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(index)
                        }}/>
                        {openMenuIndex === index && (
                            <div className="menu">
                                <div className="menu-content">
                                    <p onClick={() => handleDelete(item.id)}>حذف</p>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </div>

                </>
            )}
        </div>
    );
};

export default ShowTamplate;
