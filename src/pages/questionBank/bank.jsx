import '../courses/view courses/courses.scss'
import '../model/form/form.scss'
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";
const Bank = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/questionBank/addBank');
    };
    const handleClick1 = (title,description,id) => {
        navigate('/questionBank/showBank',{state: { title, description,id } });
    };

    const [exam, setExams] = useState([]);

    const deleteExam = async (e,id) => {
        // e.preventDefault();
        await fetch(`http://127.0.0.1:8000/api/exam/delete/${id}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // window.location.reload(); //refresh all page
                setExams(prevState => {
                    const updatedExam = prevState.data.exam.filter(item => item.id !== id);
                    return { ...prevState, data: { ...prevState.data, exam: updatedExam } };
                });//remove without refresh all page
            })
    }

    useEffect(() => {
        showExam()
    }, [])

    const showExam = async () => {

        await fetch('http://127.0.0.1:8000/api/exam/index', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setExams(data);

                console.log("exam",data)
            })
            .catch(error => console.error(error));
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
                            <FaTrashAlt className={"FaTrashAlt"} onClick={(e)=>deleteExam(e,item.id)} />
                        </div>
                    </div>
                ))}


        </div>
    );
};
export default Bank;