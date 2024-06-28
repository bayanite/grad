import '../courses/view courses/courses.scss'
import '../model/form/form.scss'
import { useNavigate } from 'react-router-dom';
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import React, {useEffect, useRef, useState} from "react";
import {MdMoreVert} from "react-icons/md";
import AddDates from "./addDates";
import UseAdviser from "../../hooks/useAdviser";
import Swal from "sweetalert2";

const Adviser = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/adviser/addAdviser');
    };
    const handleClick1 = (id) => {
        navigate('/adviser/showAdviser',{state: {id} });
    };

    const [Adviser, setAdviser] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [showAddDatesPopup, setShowAddDatesPopup] = useState(null);
    const { fetchAdvisers, deleteAdviser } = UseAdviser();

    const menuRefs = useRef([]);

    console.log("showAddDatesPopup",showAddDatesPopup);

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };
    const toggleAddPopup = (index) => {
        setShowAddDatesPopup(showAddDatesPopup === index ? null : index);
    };
    const adviserDelete = async (e,id) => {
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
                const isDeleted = await deleteAdviser(e,id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setAdviser(prevState => {
                        const updatedExam = prevState.data.adviser.filter(item => item.id !== id);
                        return { ...prevState, data: { ...prevState.data, adviser: updatedExam } };
                    });//remove without refresh all page
                    setOpenMenuIndex(null); // Close the menu after deletion
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

    };

    useEffect(() => {
        getAdviser()
    }, [])

    const getAdviser = async () => {
        try {
            const data = await fetchAdvisers();
            setAdviser(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if click occurred outside of the menu
            if (!event.target.closest('.menu')) {
                setOpenMenuIndex(null); // Close the menu
            }
        };

        // Attach event listener when menu is open
        if (openMenuIndex !== null) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick); // Clean up event listener
        };
    }, [openMenuIndex]);

    const advisers = Adviser && Adviser.data && Adviser.data.adviser;
      console.log(advisers)
    return (
        <div className={"form"}>
            <div className={"create_template"}>
                <FaPlus className={"FaPlus"}
                        onClick={handleClick}
                />
                <p>إضافة مستشار </p>
            </div>
            {advisers && Array.isArray(advisers) && advisers.map((item, index) => (
                <div key={index} className={'template'} >
                    <img src={process.env.REACT_APP_API_PATH + "/Uploads/" +item.photo} className={'img_template'}
                         onClick={()=>handleClick1(item.id)}
                    />
                    <div className={'content'}>
                        <h1 className={'name_template'}>{item.name}</h1>
                        <h5 className={'title_template'}>أخصائي/ة {item.type}</h5>
                        <text className={'about_template'}>{item.about}</text>
                    </div>
                    <MdMoreVert
                        className={'MdMoreVert'}
                        onClick={() => toggleMenu(index)}
                    />
                    {/*<div className="trash-circle">*/}
                    {/*    <FaTrashAlt className={"FaTrashAlt"} onClick={(e)=>deleteAdviser(e,item.id)} />*/}
                    {/*</div>*/}
                    {openMenuIndex === index && (
                        <div className="menu">
                            <div className="menu-content">
                                <p onClick={(e)=>adviserDelete(e,item.id)}>حذف</p>
                                <p onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAddPopup(index);
                                }}>إضافة مواعيد</p>
                            </div>
                        </div>
                    )}
                    {showAddDatesPopup === index  && <AddDates onClose={() => toggleAddPopup(index)} name={item.name} id={item.id} />}
                </div>
            ))}

        </div>
    );
};
export default Adviser;