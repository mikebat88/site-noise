// src/layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-container">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;