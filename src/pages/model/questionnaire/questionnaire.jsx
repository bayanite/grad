import './questionnaire.scss'
import '../form/form.scss'
import '../../courses/view courses/courses.scss'
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useState} from "react";


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

//=====================================================
    const deleteForm = async (e,id) => {
        // e.preventDefault();
        await fetch(`http://127.0.0.1:8000/api/paper/delete/${id}`,{
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
                setQuestionnaire(prevState => {
                    const updatedPaper = prevState.data.paper.filter(item => item.id !== id);
                    return { ...prevState, data: { ...prevState.data, paper: updatedPaper } };
                });//remove without refresh all page
            })
    }
//=====================================================
    useEffect(() => {
        showForm()
    }, [])

    const showForm = async () => {

        await fetch(`http://127.0.0.1:8000/api/paper/index/${type}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setQuestionnaire(data);

                console.log("form",data)
            })
            .catch(error => console.error(error));
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
                        <FaTrashAlt className={"FaTrashAlt"} onClick={(e)=>deleteForm(e,item.id)} />
                    </div>
                </div>
            ))}
        </div>
    );

};
export default Questionnaire;