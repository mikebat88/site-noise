import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./AdminDashboard.css"

const Dashboard = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="admin-container">
            <nav className="admin-sidebar">
                <NavLink to="/admin/albums-edit">edit albums</NavLink>
                <NavLink to="/admin/latest-edit">edit latest</NavLink>
                <NavLink to="/admin/shows-edit">edit shows</NavLink>
                <NavLink to="/admin/change-password">change password</NavLink>
            </nav>
        </div>
    );
};

export default Dashboard;