import React, {useState, useEffect} from 'react';
import './CreateTemplate.scss';
import {IoClose} from "react-icons/io5";
import {FaCamera} from 'react-icons/fa';
import AddTemplate from "../../../hooks/addTemplate";


const CreateTemplate = ({toggle, onSave}) => {
    const [image, setImage] = useState(null);
    const [nameOfCourse, setNameOfCourse] = useState('');
    const [aboutOfCourse, setAboutOfCourse] = useState('');
    const [textCertificate, setTextCertificate] = useState('');
    const [teacher, setTeacher] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading1, setLoading1] = useState(false); // Loading state


    useEffect(() => {
        // Check if all fields are filled
        if (nameOfCourse && aboutOfCourse && textCertificate && teacher && image) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [nameOfCourse, aboutOfCourse, textCertificate, teacher, image]);

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const {addTemplate} = AddTemplate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            try {
                setLoading1(true);
                await addTemplate(nameOfCourse, image, aboutOfCourse, textCertificate, teacher);
                toggle();
                onSave();
            } catch (error) {
                console.error('Error adding template:', error);
            }
            finally {
                setLoading1(false); // End the loading state
            }
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner popcourse">
                <nav className="popup-navbar">
                    <h5>إضافة دورة جديدة</h5>
                    <IoClose className={"IoClose"} onClick={toggle}/>
                </nav>
                <form className={"form-"}>
                    <div className="profile-picture-container">
                        <label htmlFor="upload-input">
                            <div className="profile-picture">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Profile" className="profile-image"/>
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
                            style={{display: 'none'}}
                        />
                    </div>
                    <label>اسم الدورة:
                        <input
                            type="text"
                            value={nameOfCourse}
                            onChange={(e) => setNameOfCourse(e.target.value)}
                        />
                    </label>
                    <label>مدرس الدورة:
                        <input
                            type="text"
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                        />
                    </label>
                    <label>حول الدورة:
                        <textarea
                            className={"about"}
                            value={aboutOfCourse}
                            onChange={(e) => setAboutOfCourse(e.target.value)}
                        />
                    </label>
                    <label>نص الشهادة:
                        <textarea
                            className={"about"}
                            value={textCertificate}
                            onChange={(e) => setTextCertificate(e.target.value)}
                        />
                    </label>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginRight: '190px'}}>
                        <button
                            type="submit"
                            onClick={(e) => handleSubmit(e)}
                            disabled={!isFormValid}
                        >
                                {/*حفظ*/}
                            {loading1 ? (
                                <div className="loading-indicator">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </div>
                            ) : (
                                "حفظ"
                            )}
                        </button>
                        <button type="button" onClick={toggle}>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTemplate;