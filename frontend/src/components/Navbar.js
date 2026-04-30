import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaInstagram, FaSpotify, FaYoutube } from 'react-icons/fa';
import { ReactComponent as BandcampIcon } from '../assets/bandcamp.svg';
import { ReactComponent as AppleMusicIcon } from '../assets/apple-music.svg';
import { ReactComponent as YoutubeMusicIcon } from '../assets/youtube-music.svg';
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="main-nav">
      <NavLink to="/" className="nav-logo-link">
        <img src="/path-to-your-logo.png" alt="Band Logo" className="nav-logo" />
        <h1 className="nav-title">NO/SE</h1>
      </NavLink>

      <div className="social-links">
        <a href="https://www.youtube.com/@noise_withaslash" target="_blank" rel="noreferrer"><FaYoutube /></a>
        <a href="https://www.instagram.com/noise_withaslash" target="_blank" rel="noreferrer"><FaInstagram /></a>
        <a href="https://music.youtube.com/channel/UCTo7g2BNCJTZ4idJe0dg16Q" target="_blank" rel="noreferrer"><YoutubeMusicIcon /></a>
        <a href="https://music.apple.com/us/artist/no-se/1824755937" target="_blank" rel="noreferrer"><AppleMusicIcon /></a>
        <a href="https://noise-withaslash.bandcamp.com/album/art-is-dead" target="_blank" rel="noreferrer"><BandcampIcon /></a>
        <a href="https://open.spotify.com/artist/4sJ1Pk4J3AfYo3Yg9r7Z3n" target="_blank" rel="noreferrer"><FaSpotify /></a>
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