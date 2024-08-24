import React, {useEffect, useState} from 'react';
import {FaArrowRight, FaExclamationCircle, FaPen} from "react-icons/fa";
import CopyHooks from "../../../hooks/copyHooks";
import {useLocation} from "react-router-dom";
import './ShowRegistered.scss';

const ShowRegistered = () => {
    const [search, setSearch] = useState(''); // State for search input
    const [register, setRegister] = useState([]); // State for registered data
    const [loading, setLoading] = useState(true);
    const [marks, setMarks] = useState({}); // State to store marks
    const [editingRowId, setEditingRowId] = useState(null); // State to track which row is being edited
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(null); // State for handling "no data" message
    const location = useLocation();
    const {fetchRegister, saveMark} = CopyHooks(); // Assuming saveMark is a function to save the mark
    const id = location.state?.id;
    const copyType = location.state?.type; // Get the type (online or center)

    const getRegister = async () => {
        try {
            const data = await fetchRegister(id);

            if (data && data.data) {
                const registeredData = data.data.data;

                if (Array.isArray(registeredData)) {
                    setRegister(registeredData);
                    setNoData(registeredData.length === 0 ? 'لا توجد بيانات لعرضها' : null);
                } else {
                    setNoData('لا توجد بيانات لعرضها'); // حالة عدم وجود بيانات مسجلين
                }
            } else {
                setError('فشل في جلب البيانات من الخادم !');
            }
        } catch (error) {
            if (!navigator.onLine) {
                setError('لا يوجد اتصال بالإنترنت !');
            } else {
                setError('فشل الاتصال بالخادم !');
            }
        } finally {
            setLoading(false); // تأكد من إعادة تعيين حالة التحميل بغض النظر عن النجاح أو الفشل
        }
    };


    useEffect(() => {
        if (id) {
            getRegister();
        }
    }, [id]);


    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    const handleSearch = (event) => {
        setSearch(event.target.value); // Update search state
    };

    const handleMarkChange = (e, rowId) => {
        setMarks({...marks, [rowId]: e.target.value});
    };

    const handleKeyDown = async (e, rowIdBooking) => {
        if (e.key === 'Enter') {
            try {
                await saveMark(rowIdBooking, marks[rowIdBooking]); // Save the mark
                alert('Mark saved successfully!');

                setEditingRowId(null); // Exit editing mode

                getRegister(); // Fetch updated data
            } catch (error) {
                console.error('Error saving mark', error);
                alert('Failed to save mark');
            }
        }
    };

    const handleEditClick = (rowIdBooking, currentMark) => {
        setEditingRowId(rowIdBooking); // Set the current row to be editable using id_booking
        setMarks({...marks, [rowIdBooking]: currentMark ?? ''}); // Initialize with the current mark if exists
    };
    const filteredRegister = Array.isArray(register) ? register.filter((val) => {
        return search.toLowerCase() === '' || !val.date
            ? true
            : val.date.toLowerCase().includes(search.toLowerCase());
    }) : [];


    return (
        <div className="showRegistered">
            <div className="ShowCopy-navbar">
                <FaArrowRight className="arrow-icon" onClick={handleGoBack}/>
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-input"
                    onChange={handleSearch}
                    value={search}
                />
            </div>

            {loading ? (
                <div className="spinner-container2">
                    <div className="spinner"/>
                    {/* Loading spinner */}
                </div>
            ) : error ? (
                <div className="spinner-container2">
                    <FaExclamationCircle className="error-icon"/> {/* Error icon */}
                    <p className="error-message-">{error}</p>
                </div>
            ) : noData ? (
                <div className="spinner-container2">
                    <p className="error-message-">{noData}</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>اسم المستخدم</th>
                            <th>تاريخ التسجيل</th>
                            {copyType === 'center' && (
                                <>
                                    <th>العلامة</th>
                                    <th>تعديل</th>
                                </>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRegister.map((row, index) => (
                            <tr key={index}>
                                <td>{`${row.name} ${row.lastName}`}</td>
                                <td>{row.created_at}</td>
                                {copyType === 'center' && (
                                    <>
                                        <td>
                                            {editingRowId === row.id_booking ? (
                                                <input
                                                    className="input_mark"
                                                    type="text"
                                                    value={marks[row.id_booking] || ''}
                                                    onChange={(e) => handleMarkChange(e, row.id_booking)}
                                                    onKeyDown={(e) => handleKeyDown(e, row.id_booking)} // Use row.id_booking here
                                                />
                                            ) : (
                                                row.marks
                                            )}
                                        </td>
                                        <td>
                                            <FaPen
                                                className={`FaPen ${row.mark === 0 ? '' : 'disabled'}`}
                                                onClick={() => row.mark === 0 && handleEditClick(row.id_booking, row.mark)}
                                                style={{pointerEvents: row.mark !== 0 ? 'none' : 'auto'}} // Prevent click events when disabled
                                            />


                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShowRegistered;