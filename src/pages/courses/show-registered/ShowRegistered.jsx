import React, { useEffect, useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import CopyHooks from "../../../hooks/copyHooks";
import { useLocation } from "react-router-dom";

const ShowRegistered = () => {
    const [search, setSearch] = useState(''); // State for search input
    const [register, setRegister] = useState([]); // State for registered data

    const location = useLocation();
    const { fetchRegister } = CopyHooks();
    const id = location.state?.id;

    const getRegister = async () => {
        try {
            const data = await fetchRegister(id);
            if (Array.isArray(data.data.data)) {
                setRegister(data.data.data);
            } else {
                setRegister([]); // Handle unexpected data format
            }
        } catch (error) {
            console.error('Error fetching copy data', error);
            setRegister([]); // Reset state in case of an error
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

    const filteredRegister = register.filter((val) => {
        return search.toLowerCase() === '' || !val.date
            ? true
            : val.date.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="showRegistered">
            <div className="ShowCopy-navbar">
                <FaArrowRight className="arrow-icon" onClick={handleGoBack} />
                <input
                    type="text"
                    placeholder="بحث..."
                    className="search-input"
                    onChange={handleSearch}
                    value={search}
                />
            </div>
            <div className="table-container">
                {register.length === 0 ? (
                    <p>لايوجد مسجلين بعد</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>اسم المستخدم</th>
                            <th>تاريخ التسجيل</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRegister.map((row, index) => (
                            <tr key={index}>
                                <td>{`${row.name} ${row.lastName}`}</td>
                                <td>{row.created_at}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ShowRegistered;
