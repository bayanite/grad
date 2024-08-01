import '../courses/view courses/courses.scss'
import '../model/form/form.scss'
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import Exam from "../../hooks/Exam";
const Bank = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/questionBank/addBank');
    };
    const handleClick1 = (title,description,id) => {
        navigate('/questionBank/showBank',{state: { title, description,id } });
    };

    const [exam, setExams] = useState([]);

    const {deleteBank,allExam}=Exam();

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
                // setIds(id)
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
                        return { ...prevState, data: { ...prevState.data, exam: updatedExam } };
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

    useEffect(() => {
        showExam()
    }, [])

    const showExam = async () => {
        try {
            const data = await allExam();
            setExams(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const exams = exam && exam.data && exam.data.exam;

    return (
        <div className={"form"}>
            <div className={"create_template"}>
                <FaPlus className={"FaPlus"} onClick={handleClick}/>
                <p>إنشاء نموذج امتحان </p>
            </div>
                {exams && Array.isArray(exams) && exams.map((item, index) => (
                    <div key={index} className={'template'} >
                        <img src={"/images/exam.jpg"} className={'img_template'}  onClick={()=>handleClick1(item.title,item.description,item.id)} />
                        <div className={'content'}>
                            <h1 className={'name_template'}>{item.title}</h1>
                            <text className={'about_template'}>{item.description}</text>
                        </div>
                        <div className="trash-circle">
                            <FaTrashAlt className={"FaTrashAlt"} onClick={(e)=>deleteExam(item.id)} />
                        </div>
                    </div>
                ))}


        </div>
    );
};
export default Bank;