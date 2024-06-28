import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { FaCamera } from 'react-icons/fa';
import useEditTemplate from "../../../hooks/editTemplate";

const EditCourse = ({ toggle, onSave, courseData }) => {
    const [image, setImage] = useState(courseData ? courseData.photo : '');
    const [nameOfCourse, setNameOfCourse] = useState(courseData ? courseData.name : '');
    const [aboutOfCourse, setAboutOfCourse] = useState(courseData ? courseData.about : '');
    const [teacher, setTeacher] = useState(courseData ? courseData.teacher : '');
    const [textCertificate, setTextCertificate] = useState(courseData ? courseData.text : '');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (courseData) {
            setImage(courseData.photo || '');
            setNameOfCourse(courseData.name || '');
            setAboutOfCourse(courseData.about || '');
            setTeacher(courseData.teacher || '');
            setTextCertificate(courseData.text || '');
        }
    }, [courseData]);

    useEffect(() => {
        setIsFormValid(nameOfCourse && aboutOfCourse);
    }, [nameOfCourse, aboutOfCourse]);

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const { editCourse } = useEditTemplate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', nameOfCourse);
            formData.append('about', aboutOfCourse);
            formData.append('teacher', teacher);
            formData.append('text', textCertificate);

            if (image instanceof File) {
                formData.append('photo', image);
            }

            if (courseData.id) {
                await editCourse(courseData.id, formData);
            }
            toggle();
            onSave();
        } catch (error) {
            console.error('Error editing course:', error);
        }
    };

    const getImageSrc = () => {
        if (typeof image === 'string') {
            return process.env.REACT_APP_API_PATH + "/Uploads/" + image;
        } else if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return '';
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <nav className="popup-navbar">
                    <h5>{'تعديل دورة'}</h5>
                    <IoClose className="IoClose" onClick={toggle} />
                </nav>
                <form className="form-" onSubmit={handleSubmit}>
                    <div className="profile-picture-container">
                        <label htmlFor="upload-input">
                            <div className="profile-picture">
                                {image ? (
                                    <img src={getImageSrc()} alt="Profile" className="profile-image"/>
                                ) : (
                                    <div className="default-profile-image">
                                        <FaCamera className="camera-icon"/>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="upload-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <label>اسم الدورة:
                        <input
                            type="text"
                            value={nameOfCourse || ''}
                            onChange={(e) => setNameOfCourse(e.target.value)}
                        />
                    </label>
                    <label>مدرس الدورة:
                        <input
                            type="text"
                            value={teacher || ''}
                            onChange={(e) => setTeacher(e.target.value)}
                        />
                    </label>
                    <label>حول الدورة:
                        <textarea
                            className="about"
                            value={aboutOfCourse || ''}
                            onChange={(e) => setAboutOfCourse(e.target.value)}
                        />
                    </label>
                    <label>نص الشهادة:
                        <textarea
                            className="about"
                            value={textCertificate || ''}
                            onChange={(e) => setTextCertificate(e.target.value)}
                        />
                    </label>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginRight: '190px'}}>
                        <button type="submit" disabled={!isFormValid}>
                            تحديث
                        </button>
                        <button type="button" onClick={toggle}>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;
