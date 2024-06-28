import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaFilter } from "react-icons/fa";
import './ShowCertificate.scss';

const ShowCertificate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName;

    const handleShowTamplate = () => {
        navigate("/certificate/ShowTamplate");
    };

    const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
    };

    const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order
    const [sortField, setSortField] = useState('number'); // Field to sort by
    const [search, setSearch] = useState(''); // Initial search value
    const [filterVisible, setFilterVisible] = useState(false); // State to manage filter modal visibility
    const [filterType, setFilterType] = useState(''); // State to manage filter by type
    const [filterCourseName, setFilterCourseName] = useState(''); // State to manage filter by course name
    const [filteredRows, setFilteredRows] = useState([]); // State to manage filtered rows

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleSort = (field) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
        setSortOrder(newSortOrder);
        setSortField(field);
    };

    const handleFilterApply = () => {
        const filtered = rows.filter((val) => {
            return (
                (!search || val.name.toLowerCase().includes(search.toLowerCase())) &&
                (!filterType || val.type === filterType) &&
                (!filterCourseName || val.course === filterCourseName)
            );
        }).sort((a, b) => {
            if (sortField === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortField === 'number') {
                return sortOrder === 'asc'
                    ? a.number - b.number
                    : b.number - a.number;
            }
            return 0;
        });

        setFilteredRows(filtered);
        setFilterVisible(false);
    };

    const rows = [
        { number: 1001, date: '2020-04-24', type: 'مركز', name: 'نور', course: 'دبلوم' },
        { number: 1002, date: '2020-04-25', type: 'مركز', name: 'نور', course: 'دبلوم' },
        { number: 1003, date: '2020-04-24', type: 'أون لاين', name: 'بيان', course: 'دبلوم1' },
        { number: 1004, date: '2020-04-27', type: 'مركز', name: 'بيان', course: 'دبلوم' },
        { number: 1005, date: '2020-04-24', type: 'أون لاين', name: 'بيان', course: 'علوم' },
        { number: 1006, date: '2020-04-24', type: 'أون لاين', name: 'بيان', course: 'علوم' },
        { number: 1007, date: '2020-04-24', type: 'أون لاين', name: 'رغد', course: 'علوم' },
        { number: 1008, date: '2020-04-24', type: 'أون لاين', name: 'رغد', course: 'علوم' },
        { number: 1009, date: '2020-05-24', type: 'أون لاين', name: 'رغد', course: 'دبلوم1' },
        { number: 1010, date: '2024-04-24', type: 'أون لاين', name: 'بيان', course: 'دبلوم1' },
        { number: 1011, date: '2025-04-24', type: 'أون لاين', name: 'بيان', course: 'تفسير' },
        { number: 1012, date: '2020-04-24', type: 'أون لاين', name: 'بيان', course: 'تفسير' },
        { number: 1013, date: '2020-04-24', type: 'أون لاين', name: 'سوسو', course: 'تفسير' },
        { number: 1014, date: '2020-04-24', type: 'أون لاين', name: 'سوسو', course: 'دبلوم1' },
        { number: 1015, date: '2020-04-24', type: 'مركز', name: 'بيان', course: 'دبلوم' },
        { number: 1016, date: '2020-04-24', type: 'أون لاين', name: 'بيان', course: 'دبلوم1' },
        // Add more rows as needed
    ];

    return (
        <div className={'ShowCopys'}>
            <div className={'ShowCopy-navbar'}>
                <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-input"
                    onChange={handleSearch}
                />
                <FaFilter className="filter-icon" onClick={() => setFilterVisible(true)} />
                {filterVisible && (
                    <div className="filter-modal">
                        <div className="filter-content">
                            <h2>تصفية النتائج</h2>
                            <label>
                                نوع التسجيل:
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="">الكل</option>
                                    <option value="أون لاين">أون لاين</option>
                                    <option value="مركز">مركز</option>
                                </select>
                            </label>
                            <label>
                                اسم الدورة:
                                <input type="text" value={filterCourseName} onChange={(e) => setFilterCourseName(e.target.value)} />
                            </label>

                            <button onClick={handleFilterApply}>تطبيق</button>
                            <button onClick={() => setFilterVisible(false)}>إغلاق</button>
                        </div>
                    </div>
                )}
                <div className="navbar-button-">
                    <button className={"show"} onClick={handleShowTamplate}>
                        عرض القوالب
                    </button>
                </div>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>الرقم التسلسلي</th>
                        <th>تاريخ المنح</th>
                        <th>الاسم</th>
                        <th> نوع التسجيل</th>
                        <th>اسم الدورة</th>
                        <th>
                            عرض الشهادة
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRows.length ? filteredRows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.number}</td>
                            <td>{row.date}</td>
                            <td>{row.name}</td>
                            <td>{row.type}</td>
                            <td>{row.course}</td>
                            <td>
                                <FaEye className={"FaEye"} />
                            </td>
                        </tr>
                    )) : rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.number}</td>
                            <td>{row.date}</td>
                            <td>{row.name}</td>
                            <td>{row.type}</td>
                            <td>{row.course}</td>
                            <td>
                                <FaEye className={"FaEye"} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowCertificate;
