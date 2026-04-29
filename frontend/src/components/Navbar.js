import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FaInstagram, FaSpotify, FaYoutube } from 'react-icons/fa';
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo-link">
        <img src="/path-to-your-logo.png" alt="Band Logo" className="nav-logo" />
        <h1 className="nav-title">NO/SE</h1>
      </Link>

      <div className="social-links">
        <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
        <a href="https://spotify.com" target="_blank" rel="noreferrer"><FaSpotify /></a>
      </div>

      {/* 3. BOTTOM SECTION: PAGE NAV */}
      <div className="page-links">
        <NavLink to="/music">music</NavLink>
        <NavLink to="/contact">contact</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;