import React from 'react';
import { Link } from 'react-router-dom';
import EventsBox from "../components/EventsBox";
import Latest from "../components/Latest";
import "./Home.css";

const Home = () => {
	return (
		<div className="home-container">
		
			<div className="latest-container">
				<h1>latest</h1>

				<div className="latest"> <Latest /> </div>

			</div>

			<div className="upcoming-events">
				<h1>UPCOMING EVENTS</h1>

				<div className="events"> <EventsBox /> </div>

			</div>
		

		</div>
	);
};

export default Home;