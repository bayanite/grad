import './questionnaire.scss'
import '../form/form.scss'
import '../../courses/view courses/courses.scss'
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Model from "../../../hooks/Model";
import Swal from "sweetalert2";


const Questionnaire = ({TypeName}) => {
    const [type, setType] = useState(TypeName);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/model/addModel',{state: {TypeName}});
    };
    const handleClick1 = (title,description,id) => {
        navigate('/model/showModel',{state: { title, description,id } });
    };

    const [questionnaire, setQuestionnaire] = useState([]);
    const {deleteForm,allForm}=Model()
//=====================================================
    const deleteForm1 = async (id) => {

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
                    setQuestionnaire(prevState => {
                        const updatedPaper = prevState.data.paper.filter(item => item.id !== id);
                        return { ...prevState, data: { ...prevState.data, paper: updatedPaper } };
                    });//remove without refresh all page
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'فشل الحذف !',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                console.error('Error deleting adviser:', error);
            }
        }
    }
//=====================================================
    useEffect(() => {
        showForm1()
    }, [])

    const showForm1 = async () => {
        try {
            const data = await allForm(type);
            setQuestionnaire(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }
    const papers = questionnaire && questionnaire.data && questionnaire.data.paper;

    return (
        <div className={"form"}>
            <div className={"create_template"}>
                <FaPlus className={"FaPlus"} onClick={handleClick}/>
                <p>إنشاء نموذج</p>
            </div>
            {papers && Array.isArray(papers) && papers.map((item, index) => (
                <div key={index} className={'template'}>
                    <img src={"/images/survey.jpg"} className={'img_template'} onClick={()=>handleClick1(item.title,item.description,item.id)} />
                    <div className={'content'}>
                        <h1 className={'name_template'}>{item.title}</h1>
                        <text className={'about_template'}>{item.description}</text>
                    </div>
                    <div className="trash-circle">
                        <FaTrashAlt className={"FaTrashAlt"} onClick={()=>deleteForm1(item.id)} />
                    </div>
                </div>
            ))}
        </div>
    );

};
export default Questionnaire;