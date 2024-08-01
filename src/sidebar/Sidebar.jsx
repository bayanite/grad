import React, { useState, useEffect } from 'react';
import sidebarNav from '../configs/sidebarNav';
import './sidebar.scss';
import logo from '../assets/images/logo.png';
import { FaBars } from "react-icons/fa";
import {  NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Fetch the user role from local storage or an API call
        const role = localStorage.getItem('userRole'); // Assume the role is stored in local storage
        setUserRole(parseInt(role, 10));
    }, []);

    const sideBarNav = sidebarNav(userRole);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth <= 570) {
            setIsOpen(false);
        } else if (windowWidth <= 870) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [windowWidth]);

    const toggle = () => {
        if (windowWidth > 570 && windowWidth <= 870) {
            setIsOpen(!isOpen);
        }
    };

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     setIsAuthenticated(false);
    // };

    return (
        <div style={{ width: isOpen ? "250px" : "60px" }} className="sidebar">
            <div className="top_section">
                <img
                    style={{
                        width: isOpen ? "70px" : "50px",
                        height: isOpen ? "70px" : "50px",
                        padding: isOpen ? "10px 15px" : "0px 1px",
                        marginRight: isOpen ? "40px" : "0px",
                    }}
                    src={logo}
                    className={"logo"}
                    alt=""
                />
                <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                    {windowWidth > 570 && windowWidth <= 870 && (
                        <FaBars className={"FaBars"} onClick={toggle} />
                    )}
                </div>
            </div>
            {sideBarNav.map((item, index) => (
                <NavLink to={item.path} key={index} className="link" activeclassname="active">
                    <div className="icon">{item.icon}</div>
                    <div style={{ display: isOpen ? "inline-flex" : "none" }} className="link_text">
                        {item.name}
                    </div>
                </NavLink>
            ))}
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;
