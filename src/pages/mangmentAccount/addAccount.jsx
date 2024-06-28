import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import {FaCamera, FaLock, FaLockOpen, FaUser} from "react-icons/fa";

const AddAccount = ({toggle,onSave}) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [nameEmp, setNameEmp] = useState('');
    const [passwordEm, setPasswordEmp] = useState('');
 console.log("select",selectedRole)
    const handleSelectChange = (event) => {
     if(event.target.value ==='موظف')
        setSelectedRole('1');
     else
         setSelectedRole('0');
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const handlePopupClick = (event) => {
        event.stopPropagation();
    };

    const addAccount = async () => {
        const token = localStorage.getItem('token');
        const data = {
            'name': nameEmp,
            'password': passwordEm,
            'role': selectedRole
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/employee/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("jgdd", result);

            if (response.ok) {
                console.log("lllll", result.ok);
                toggle(); // Call toggle function when the request is successful
                onSave();
            } else {
                // Handle error case if needed
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="popup" onClick={toggle}>
            <div className="popup-inner" onClick={handlePopupClick}>
                <nav className="popup-navbar">
                    <h5>إضافة مستخدم</h5>
                    <IoClose className={"IoClose"} onClick={toggle}/>
                </nav>
                <div className="form1 sign-in-form">
                    <div className="input-field Account">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="اسم المستخدم"
                            onChange={(e) => setNameEmp(e.target.value)}
                        />
                    </div>
                    <div className="input-field Account">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="كلمة المرور"
                            onChange={(e) => setPasswordEmp(e.target.value)}
                        />
                        {isPasswordVisible ? (
                            <FaLockOpen className="icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaLock className="icon" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    {/*<div className="input-field Account">*/}
                    <select
                        className="input-field Account"
                        // value={selectedRole}
                        onChange={handleSelectChange}
                    >
                        <option value=" " >اختر دورًا</option>
                        <option>موظف</option>
                        <option>مدير</option>
                    </select>

                    {/*</div>*/}
                    <div style={{display: 'flex', justifyContent: 'space-between', marginRight: '190px'}}>
                        <button style={{ marginTop: '120px'}} type="submit" onClick={addAccount}>
                            حفظ
                        </button>
                        <button style={{ marginTop: '120px'}} type="button" onClick={toggle}>
                            إلغاء
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AddAccount;