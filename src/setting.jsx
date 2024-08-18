import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import DashboardApi from "./hooks/dashboardApi";

const Setting = ({ visible, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState([]);
    const [director, setDirector] = useState('');
    const [site, setSite] = useState('');
    const [time, setTime] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [facebook, setFacebook] = useState('');

    const { infoCenter, updateInfoCenter } = DashboardApi();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const settingsData = await infoCenter();
            if (settingsData && settingsData.data && settingsData.data.data) {
                const centerInfo = settingsData.data.data[0]; // Assuming the data is an array and we want the first element
                setFormData(settingsData.data.data);
                setDirector(centerInfo.director);
                setSite(centerInfo.site);
                setTime(centerInfo.time);
                setNumber(centerInfo.nubmer);
                setEmail(centerInfo.email);
                setFacebook(centerInfo.facebook);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'director':
                setDirector(value);
                break;
            case 'site':
                setSite(value);
                break;
            case 'time':
                setTime(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'number':
                setNumber(value);
                break;
            case 'facebook':
                setFacebook(value);
                break;
            default:
                break;
        }
        setFormData((prevData) => {
            const updatedData = [...prevData];
            updatedData[0] = { ...updatedData[0], [name]: value }; // Assuming single data object
            return updatedData;
        });
    };

    const handleSave = async () => {
        try {
            await updateInfoCenter(director, time, email, facebook, number, site);
            fetchData(); // Refresh the data after saving
            setEditMode(false)
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className={`offCanvas ${visible ? 'show' : ''}`}>
            <div className="offCanvas-content">
                <div className="offCanvas-header">
                    <h2>معلومات المركز</h2>
                    <FaTimes className="close-icon" onClick={onClose} /> {/* Close icon */}
                </div>
                <div>
                    {editMode ? (
                        <div>
                            <label className="offCanvas-label">
                                مدير المركز :
                                <input
                                    className={"offCanvas-input"}
                                    type="text"
                                    name="director"
                                    value={director}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="offCanvas-label">
                                الموقع :
                                <input
                                    className={"offCanvas-input"}
                                    type="text"
                                    name="site"
                                    value={site}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="offCanvas-label">
                                أوقات الدوام :
                                <input
                                    className={"offCanvas-input"}
                                    type="text"
                                    name="time"
                                    value={time}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="offCanvas-label">
                                الإيميل :
                                <input
                                    className={"offCanvas-input"}
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="offCanvas-label">
                                للتواصل :
                                <input
                                    className={"offCanvas-input"}
                                    type="text"
                                    name="number"
                                    value={number}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="offCanvas-label">
                                Facebook:
                                <input
                                    className={"offCanvas-input"}
                                    type="text"
                                    name="facebook"
                                    value={facebook}
                                    onChange={handleChange}
                                />
                            </label>
                            <button className={"offCanvas-button"} onClick={handleSave}>Save</button>
                            <button className={"offCanvas-button"} onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            {formData && formData.map((item, index) => (
                                <div key={index}>
                                    <p className={"offCanvas-p"}>مدير المركز : {item.director}</p>
                                    <p className={"offCanvas-p"}>الموقع : {item.site}</p>
                                    <p className={"offCanvas-p"}>أوقات الدوام : {item.time}</p>
                                    <p className={"offCanvas-p"}>الإيميل : {item.email}</p>
                                    <p className={"offCanvas-p"}>للتواصل : {item.nubmer}</p>
                                    <p className={"offCanvas-p"}> {item.facebook}: Facebook</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {!editMode && (
                        <button className={"offCanvas-button"} onClick={() => setEditMode(true)}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Setting;
