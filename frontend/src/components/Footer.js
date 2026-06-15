import React from "react";
import { NavLink } from 'react-router-dom';
import BandTitle from "../assets/text.webp";
import "./Footer.css";

const Footer = () => {
	return (
		<div className="footer-container">
			
			<div className="footer-content">

				<div className="footer-section links-sec">
					<a href="https://www.instagram.com/noise_withaslash" target="_blank" rel="noreferrer">instagram</a>
					<a href="https://www.youtube.com/@noise_withaslash" target="_blank" rel="noreferrer">youtube</a>
					<a href="https://music.youtube.com/channel/UCTo7g2BNCJTZ4idJe0dg16Q" target="_blank" rel="noreferrer">youtube music</a>
					<a href="https://music.apple.com/us/artist/no-se/1824755937" target="_blank" rel="noreferrer">apple music</a>
					<a href="https://noise-withaslash.bandcamp.com/album/art-is-dead" target="_blank" rel="noreferrer">bandcamp</a>
					<a href="https://open.spotify.com/artist/4sJ1Pk4J3AfYo3Yg9r7Z3n" target="_blank" rel="noreferrer">spotify</a>
				</div>
				
				<nav className="footer-section pages-sec">
					<NavLink to="/">home</NavLink>
					<NavLink to="/music">music</NavLink>
					<NavLink to="/contact">contact</NavLink>
				</nav>

				<div className="footer-section empty"></div>
			</div>

			<div className="footer-title">
				<img src={BandTitle} alt="Band logo" className="logo" />
				<p>© 2026 Mikuláš Báthory</p>
			</div>
		</div>
	);
};

export default Footer;