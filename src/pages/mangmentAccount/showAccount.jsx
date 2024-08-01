import React, { useEffect, useState, useRef } from 'react';
import { FaArrowRight, FaEye, FaEyeSlash, FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa';
import '../courses/show-copy/ShowCopy.scss';
import './acouunt.scss';
import '../courses/view courses/courses.scss';
import AddAccount from "./addAccount";
import Account from "../../hooks/account";
import Swal from "sweetalert2";

const ShowAccount = () => {
    const [userAccount, setUserAccount] = useState([]);
    const [search, setSearch] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [roleFilter, setRoleFilter] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [editedPasswords, setEditedPasswords] = useState({});
    const inputRefs = useRef({});

     const {getAllAccount,updatePassword,deleteAccount}=Account();

    const togglePasswordVisibility = (index) => {
        setVisiblePasswords((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleEditClick = (index, password) => {
        setEditMode((prevState) => ({
            ...prevState,
            [index]: true
        }));
        setEditedPasswords((prevState) => ({
            ...prevState,
            [index]: password
        }));
    };

    const handleSaveClick = async (index, row) => {
        const oldPassword = row.password;
        const result = await changePassword(row.id, oldPassword, editedPasswords[index]);
        if (result.ok) {
            setEditMode((prevState) => ({
                ...prevState,
                [index]: false
            }));
            // Update the user password in the state
            setUserAccount((prevState) => {
                const updatedData = prevState.data.map((user, i) =>
                    i === index ? { ...user, password: editedPasswords[index] } : user
                );
                return { ...prevState, data: updatedData };
            });
        }
    };

    const handlePasswordChange = (index, newPassword) => {
        setEditedPasswords((prevState) => ({
            ...prevState,
            [index]: newPassword
        }));
    };

    const handleKeyDown = (index, row, event) => {
        if (event.key === 'Enter') {
            handleSaveClick(index, row);
        }

    };

    const filteredRows = userAccount && userAccount.data ? userAccount.data.filter((row) => {
        const matchesSearch = search === '' || row.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === '' || row.role === roleFilter;
        return matchesSearch && matchesRole;
    }) : [];

    useEffect(() => {
        getAccount();
    }, []);

    const getAccount = async () =>
    {
        try {
            const data = await getAllAccount();
            setUserAccount(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const changePassword = async (id, oldPassword, newPassword) => {
        try {
            return  await updatePassword(id, oldPassword, newPassword);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const deleteUser = async (id) => {

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
                const isDeleted = await deleteAccount(id);
                if (isDeleted) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    setUserAccount(prevState => {
                        const updatedData = prevState.data.filter(item => item.id !== id);
                        return { ...prevState, data: updatedData };
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
    };

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    return (
        <div className={'ShowCopys'}>
            <div className="navbar">
                <FaArrowRight className="arrow-icon"  onClick={handleGoBack} />
                <div className="buttons-container">
                    <div className="filter-button" onClick={() => setRoleFilter('موظف')}>موظف</div>
                    <div className="filter-button" onClick={() => setRoleFilter('مدير')}>مدير</div>
                    <div className="filter-button" onClick={() => setRoleFilter('')}>الكل</div>
                </div>
                <div className={"div-add"}>
                    <input
                        type="text"
                        placeholder="بحث..."
                        className="search-input"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={"plus-user"} onClick={toggle}>
                        <FaPlus className={"plus-user-role"} />
                        {isOpen && <AddAccount toggle={toggle} onSave={getAccount} />}
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>اسم المستخدم</th>
                        <th>دوره</th>
                        <th>كلمة السر</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRows && Array.isArray(filteredRows) && filteredRows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.role}</td>
                            <td className={!visiblePasswords[index] ? 'hidden-password' : ''}>
                                {editMode[index] ? (
                                    <input
                                        className={"input_pass"}
                                        type="text"
                                        value={editedPasswords[index]}
                                        onChange={(e) => handlePasswordChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index,row, e)}
                                        // style={{ width: '100%' }}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        onBlur={() => handleSaveClick(index,row)}
                                    />
                                ) : (
                                    visiblePasswords[index] ? row.password : '••••••••'
                                )}
                            </td>
                            <td>
                                {visiblePasswords[index] ? (
                                    <FaEyeSlash className={"FaEyeSlash"} onClick={() => togglePasswordVisibility(index)} />
                                ) : (
                                    <FaEye className={"FaEyeSlash"} onClick={() => togglePasswordVisibility(index)} />
                                )}

                                    <FaPen className={"FaPen"} onClick={() => handleEditClick(index, row.password)} />
                                <FaTrashAlt className={"FaTrashAlt1"} onClick={()=>deleteUser(row.id)} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowAccount;
