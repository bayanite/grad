import '../courses/view courses/courses.scss';
import '../model/form/form.scss';
import {useNavigate} from 'react-router-dom';
import {FaExclamationCircle, FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import Exam from "../../hooks/Exam";

const Bank = () => {
    const navigate = useNavigate();
    const [exam, setExams] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const {deleteBank, allExam} = Exam();

    const handleClick = () => {
        navigate('/questionBank/addBank');
    };

    const handleClick1 = (title, description, id) => {
        navigate('/questionBank/showBank', {state: {title, description, id}});
    };

    const deleteExam = async (id) => {
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
                const isDeleted = await deleteBank(id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setExams(prevState => {
                        const updatedExam = prevState.data.exam.filter(item => item.id !== id);
                        return {...prevState, data: {...prevState.data, exam: updatedExam}};
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'فشل الحذف !',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                console.error('Error deleting exam:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'حدث خطأ في الحذف!',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        }
    };

    useEffect(() => {
        checkServerConnectivity();
    }, []);
    const checkServerConnectivity = async () => {
        try {
            // Make a simple GET request to check server status
            const response = await fetch(`${process.env.REACT_APP_API_URL}exam/index`); // Replace with a basic endpoint
            // if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await showExam();
        } catch (error) {
            // Handle the error without logging it to the console
            setError('فشل في الاتصال بالخادم!');
            setLoading(false); // Stop the loading spinner
        }
    };
    const showExam = async () => {
        setLoading(true); // Start loading
        setError(null); // Reset error before new request
        try {
            const data = await allExam();
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError('حدث خطأ في تحميل البيانات من الخادم.'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const exams = exam && exam.data && exam.data.exam;

    return (
        <div className="form">
            <div className="create_template">
                <FaPlus className="FaPlus" onClick={handleClick}/>
                <p>إنشاء نموذج امتحان </p>
            </div>

            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/>
                    {/* Correctly closing the spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon"/> {/* Error icon */}
                    <p className="error-message-">{error}</p>
                </div>
            ) : (
                exams && Array.isArray(exams) && exams.map((item, index) => (
                    <div key={index} className="template">
                        <img src={"/images/exam.jpg"} className="img_template"
                             onClick={() => handleClick1(item.title, item.description, item.id)}/>
                        <div className="content">
                            <h1 className="name_template">{item.title}</h1>
                            <text className="about_template">{item.description}</text>
                        </div>
                        <div className="trash-circle">
                            <FaTrashAlt className="FaTrashAlt" onClick={() => deleteExam(item.id)}/>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Bank;
