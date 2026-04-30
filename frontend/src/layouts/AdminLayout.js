// src/layouts/AdminLayout.js
import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <NavLink to="/admin/dashboard">
          <h1>ADMIN PANEL</h1>
        </NavLink>
        <div className="admin-nav">
          <button onClick={handleLogout} className="logout-btn">logout</button>
        </div>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;