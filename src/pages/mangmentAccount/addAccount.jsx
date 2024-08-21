import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import {FaLock, FaLockOpen, FaUser} from "react-icons/fa";
import Account from "../../hooks/account";

const AddAccount = ({toggle, onSave}) => {
    const [loading1, setLoading1] = useState(false); // Loading state
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('1');
    const [nameEmp, setNameEmp] = useState('');
    const [passwordEm, setPasswordEmp] = useState('');
    const handleSelectChange = (event) => {
        if (event.target.value === 'موظف')
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
    const {addAccount} = Account(toggle, onSave);

    const handleAddAccount = async () => {
        try {
            setLoading1(true); // Start the loading state
            await addAccount(nameEmp, passwordEm, selectedRole);

        } catch (error) {
            console.error('Error adding template:', error);
        } finally {
            setLoading1(false); // End the loading state
        }
    }
    const isFormValid = nameEmp !== '' && passwordEm !== '' && selectedRole !== '';

    return (
        <div className="popup" onClick={toggle}>
            <div className="popup-inner" onClick={handlePopupClick}>
                <nav className="popup-navbar">
                    <h5>إضافة مستخدم</h5>
                    <IoClose className={"IoClose"} onClick={toggle}/>
                </nav>
                <div className="form1 sign-in-form">
                    <div className="input-field Account">
                        <FaUser className="icon"/>
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
                            <FaLockOpen className="icon" onClick={togglePasswordVisibility}/>
                        ) : (
                            <FaLock className="icon" onClick={togglePasswordVisibility}/>
                        )}
                    </div>
                    {/*<div className="input-field Account">*/}
                    <select
                        className="input-field Account"
                        // value={selectedRole}
                        onChange={handleSelectChange}
                    >
                        <option>موظف</option>
                        <option>مدير</option>
                    </select>

                    {/*</div>*/}
                    <div style={{display: 'flex', justifyContent: 'space-between', marginRight: '190px'}}>
                        <button style={{marginTop: '120px'}} type="submit" onClick={handleAddAccount}
                                disabled={!isFormValid}>
                            {loading1 ? (
                                <div className="loading-indicator">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </div>
                            ) : (
                                "حفظ"
                            )}
                        </button>
                        <button style={{marginTop: '120px'}} type="button" onClick={toggle}>
                            إلغاء
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AddAccount;