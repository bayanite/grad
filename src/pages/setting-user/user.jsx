import React, {useEffect, useState} from 'react';
import './user.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowRight, FaEye, FaRegCheckCircle, FaRegTimesCircle} from 'react-icons/fa';
import {BsSend, BsSendCheck} from "react-icons/bs";
import usesSetting from "../../hooks/userSetting";

const UserSetting = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    const handleEdit = (type) => {
        if (type === 'مركز') {
            navigate('/courses/announce-course/AnnounceCourse');
        } else if (type === 'أون لاين') {
            navigate('/courses/add-online-courses/AddOnlineCourse');
        }
    };

    const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order
    const [search, setSearch] = useState(''); // Initial sort order
    const [user, setUser] = useState([]); // Initial sort order

    const handleSearch = (event) => {
        setSearch(event.target.value)
    };


    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
        setSortOrder(newSortOrder);
    };


    const {fetchUser, checkUser} = usesSetting();

    const getUser = async () => {
        try {
            const data = await fetchUser();
            setUser(data.data.data);

        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    const CheckUser = async (id, status) => {
        console.log("id", id)
        console.log("status", status)
        try {
            const data = await checkUser(id, status);
            getUser();
            console.log("User status updated:", data);
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    return (
        <div className={'ShowCopys'}>
            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-input"
                    onChange={handleSearch}
                />
            </div>
            <div className="table-container">
                {user.length === 0 ? (
                    <p>لايوجد مسجلين بعد</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>تاريخ التسجيل</th>
                            <th>اسم المستخدم</th>
                            <th>رقم الجوال</th>

                            <th> اسم الدورة</th>
                            <th> نوع التسجيل</th>
                            <th>عرض الاستمارة</th>
                            <th>الحالة</th>
                        </tr>
                        </thead>
                        <tbody>
                        {user.filter((val) => {
                            return search.toLowerCase() === '' || !val.date ? val : val.date.toLowerCase().includes(search.toLowerCase());
                        }).map((row, index) => (
                            <tr key={index}>
                                <td>{row.created_at}</td>
                                <td>{row.name + " " + row.lastName}</td>
                                <td>{row.mobilePhone}</td>
                                <td>{row.namecourse}</td>
                                <td>{row.type}</td>
                                <td>
                                    <FaEye className={"FaEye"} />
                                    {/* onClick={showForm(row.id_coursepaper)} */}
                                </td>
                                <td>
                                    <FaRegCheckCircle
                                        className="FaRegCheckCircle-"
                                        onClick={() => CheckUser(row.id_booking, 1)}
                                    />
                                    <FaRegTimesCircle
                                        className="FaRegTimesCircle-"
                                        onClick={() => CheckUser(row.id_booking, 0)}
                                    />
                                    <BsSendCheck className={"send-notif"} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};



export default UserSetting
