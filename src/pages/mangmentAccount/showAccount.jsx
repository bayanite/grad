import React, { useEffect, useState, useRef } from 'react';
import { FaArrowRight, FaEye, FaEyeSlash, FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa';
import '../courses/show-copy/ShowCopy.scss';
import './acouunt.scss';
import '../courses/view courses/courses.scss';
import AddAccount from "./addAccount";

const ShowAccount = () => {
    const [userAccount, setUserAccount] = useState([]);
    const [search, setSearch] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [roleFilter, setRoleFilter] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [editedPasswords, setEditedPasswords] = useState({});
    const inputRefs = useRef({});

    // console.log("llsl",userAccount)

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
            console.log("llllllllllllllllllll")
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

    const getAccount = async () => {
        const token = localStorage.getItem('token');
        await fetch('http://127.0.0.1:8000/api/employee/indexAll', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setUserAccount(data);
            })
            .catch(error => console.error(error));
    };

    const changePassword = async (id, oldPassword, newPassword) => {
        const token = localStorage.getItem('token');
        const data = {
            'id': id,
            'oldPassword':oldPassword,
            'newPassword': newPassword,
        };
        console.log("Password updated successfully", data);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/employee/resetpass', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

        const result = await response.json();
        if( result.status === 'success'){
        return { ok:true , result };
        } else
            return { ok: false, result };
        } catch (error) {
        console.error('Error:', error);
        return { ok: false, result: error };
        }

    }

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/employee/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setUserAccount(prevState => {
                    const updatedData = prevState.data.filter(item => item.id !== id);
                    return { ...prevState, data: updatedData };
                });
            } else {
                console.error('Failed to delete user:', data);
            }
        } catch (error) {
            console.error('Error:', error);
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
