// import React, { useEffect, useState } from 'react';
// import './user.scss';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowRight, FaEye, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
// import { BsSendCheck } from "react-icons/bs";
// import usesSetting from "../../hooks/userSetting";
// import Spinner from "react-spinner-material";
//
// const UserSetting = () => {
//     const navigate = useNavigate();
//     // const location = useLocation();
//
//     const [search, setSearch] = useState('');
//     const [user, setUser] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     const { fetchUser, checkUser } = usesSetting();
//
//     const handleGoBack = () => {
//         navigate(-1);  // Use navigate to go back
//     };
//
//     // const handleEdit = (type) => {
//     //     if (type === 'مركز') {
//     //         navigate('/courses/announce-course/AnnounceCourse');
//     //     } else if (type === 'أون لاين') {
//     //         navigate('/courses/add-online-courses/AddOnlineCourse');
//     //     }
//     // };
//
//     useEffect(() => {
//         if (!navigator.onLine) {
//             setHasInternet(false);
//             setLoading(false);
//         }
//     }, []);
//
//     const handleSearch = (event) => {
//         setSearch(event.target.value);
//     };
//
//     // const handleSort = () => {
//     //     const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
//     //     setSortOrder(newSortOrder);
//     // };
//     const filteredRows = user.filter(row =>
//         row.name.toLowerCase().includes(search.toLowerCase())
//     );
//
//     const getUser = async () => {
//         try {
//             const data = await fetchUser();
//             setUser(data.data.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//         }
//     };
//
//     const CheckUser = async (id, status) => {
//         try {
//             const data = await checkUser(id, status);
//             getUser();
//             console.log("User status updated:", data);
//         } catch (error) {
//             console.error('Error checking user:', error);
//         }
//     };
//
//     useEffect(() => {
//         getUser();
//     }, []);
//
//     return (
//         <div className="ShowCopys">
//             {loading ? (
//                 <div className="spinner-container">
//                     <Spinner size={120} visible={true} />
//                 </div>
//             ) : (
//                 <>
//                     <div className="ShowCopy-navbar">
//                         <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
//                         <input
//                             type="text"
//                             placeholder="بحث..."
//                             className="search-input"
//                             onChange={handleSearch}
//                         />
//                     </div>
//                     <div className="table-container">
//                         <table>
//                             <thead>
//                             <tr>
//                                 <th>تاريخ التسجيل</th>
//                                 <th>اسم المستخدم</th>
//                                 <th>رقم الجوال</th>
//                                 <th>اسم الدورة</th>
//                                 <th>نوع التسجيل</th>
//                                 <th>عرض الاستمارة</th>
//                                 <th>الحالة</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {filteredRows.filter((val) =>
//                                 search.toLowerCase() === '' || !val.date ? val : val.date.toLowerCase().includes(search.toLowerCase())
//                             ).map((row, index) => (
//                                 <tr key={index}>
//                                     <td>{row.created_at}</td>
//                                     <td>{row.name + " " + row.lastName}</td>
//                                     <td>{row.mobilePhone}</td>
//                                     <td>{row.namecourse}</td>
//                                     <td>{row.type}</td>
//                                     <td>
//                                         <FaEye className="FaEye" />
//                                         {/* onClick={showForm(row.id_coursepaper)} */}
//                                     </td>
//                                     <td>
//                                         <FaRegCheckCircle
//                                             className="FaRegCheckCircle-"
//                                             onClick={() => CheckUser(row.id_booking, 1)}
//                                         />
//                                         <FaRegTimesCircle
//                                             className="FaRegTimesCircle-"
//                                             onClick={() => CheckUser(row.id_booking, 0)}
//                                         />
//                                         <BsSendCheck className="send-notif" />
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default UserSetting;
import React, { useEffect, useState } from 'react';
import './user.scss';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaEye, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { BsSendCheck } from "react-icons/bs";
import usesSetting from "../../hooks/userSetting";
import Spinner from "react-spinner-material";

const UserSetting = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasInternet, setHasInternet] = useState(true);

    const { fetchUser, checkUser } = usesSetting();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (!navigator.onLine) {
            setHasInternet(false);
            setLoading(false);
        }
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredRows = user.filter(row =>
        row.name.toLowerCase().includes(search.toLowerCase())
    );

    const getUser = async () => {
        try {
            const data = await fetchUser();
            setUser(data.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    const CheckUser = async (id, status) => {
        try {
            const data = await checkUser(id, status);
            getUser();
            console.log("User status updated:", data);
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    useEffect(() => {
        if (hasInternet) {
            getUser();
        }
    }, [hasInternet]);
    const handleShowForm=(id_user,id_online_center)=>{
        navigate('/users/showForm',{state: { id_user, id_online_center } });
    }
    return (
        <div className="ShowCopys">
            {loading ? (
                <div className="spinner-container">
                    <Spinner size={120} visible={true} />
                </div>
            ) : (
                <>
                    {!hasInternet ? (
                        <div className="no-internet">No Internet</div>
                    ) : (
                        <>
                            <div className="ShowCopy-navbar">
                                <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
                                <input
                                    type="text"
                                    placeholder="بحث..."
                                    className="search-input"
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="table-container">
                                {user.length === 0 ? (
                                    <div className="no-data">لا يوجد مسجلين</div>
                                ) : (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>تاريخ التسجيل</th>
                                            <th>اسم المستخدم</th>
                                            <th>رقم الجوال</th>
                                            <th>اسم الدورة</th>
                                            <th>نوع التسجيل</th>
                                            <th>عرض الاستمارة</th>
                                            <th>الحالة</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredRows.filter((val) =>
                                            search.toLowerCase() === '' || !val.date ? val : val.date.toLowerCase().includes(search.toLowerCase())
                                        ).map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.created_at}</td>
                                                <td>{row.name + " " + row.lastName}</td>
                                                <td>{row.mobilePhone}</td>
                                                <td>{row.namecourse}</td>
                                                <td>{row.type}</td>
                                                <td>
                                                    <FaEye className="FaEye" onClick={()=>handleShowForm(row.id_user,row.id_online_center)}/>
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
                                                    <BsSendCheck className="send-notif" />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default UserSetting;
