// src/layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MainLayout.css';
import vid1 from '../assets/vid1.webm';
import vid2 from '../assets/vid2.webm';

const MainLayout = () => {
  return (
    <div className="app-wrapper">
      <div className="bg-video-container left">
        <video src={vid1}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback nofullscreen"
          onContextMenu={(e) => e.preventDefault()} />
      </div>
      <div className="bg-video-container right">
        <video src={vid2}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback nofullscreen" />
      </div>
      
      <div className="main-container">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;