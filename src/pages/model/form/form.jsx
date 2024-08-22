import './form.scss';
import '../../courses/view courses/courses.scss';
import {useNavigate} from 'react-router-dom';
import {FaExclamationCircle, FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import Model from "../../../hooks/Model";

const Form = ({TypeName}) => {
    const [type, setType] = useState(TypeName);
    const navigate = useNavigate();
    const [form, setForms] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const {deleteForm, allForm} = Model();

    const handleClick = () => {
        navigate('/model/addModel', {state: {TypeName}});
    };

    const handleClick1 = (title, description, id) => {
        navigate('/model/showModel', {state: {title, description, id}});
    };

    const formDelete = async (id) => {
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
                const isDeleted = await deleteForm(id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setForms(prevState => {
                        const updatedPaper = prevState.data.paper.filter(item => item.id !== id);
                        return {...prevState, data: {...prevState.data, paper: updatedPaper}};
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
                // Handle the deletion error gracefully
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ في الاتصال بالخادم!',
                    text: 'يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.',
                    showConfirmButton: true,
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/index/${type}`); // Replace with a basic endpoint
            if (!response.ok) throw new Error('Server not reachable');

            // If the server is reachable, proceed to fetch the forms
            await showForm();
        } catch (error) {
            setError('فشل في الاتصال بالخادم!');
            setLoading(false); // Stop the loading spinner
        }
    };

    const showForm = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await allForm(type);
            if (!data || !data.data || !data.data.paper || data.data.paper.length === 0) {
                setError("لا توجد نماذج متاحة."); // Handle no data found
            } else {
                setForms(data);
            }
        } catch (error) {
            setError('فشل في الاتصال بالخادم! ');
        } finally {
            setLoading(false);
        }
    };

    const papers = form && form.data && form.data.paper;

    return (
        <div className={"form"}>
            <div className={"create_template"}>
                <FaPlus className={"FaPlus"} onClick={handleClick}/>
                <p>إنشاء نموذج</p>
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
                papers && Array.isArray(papers) && papers.length > 0 &&
                papers.map((item, index) => (
                    <div key={index} className={'template'}>
                        <img
                            src={"/images/form.jpg"}
                            className={'img_template'}
                            onClick={() => handleClick1(item.title, item.description, item.id)}
                        />
                        <div className={'content'}>
                            <h1 className={'name_template'}>{item.title}</h1>
                            <p className={'about_template'}>{item.description}</p>
                        </div>
                        <div className="trash-circle">
                            <FaTrashAlt className={"FaTrashAlt"} onClick={() => formDelete(item.id)}/>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Form;


