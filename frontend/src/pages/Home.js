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

			<div className="latest-release">
				<h1>latest release</h1>

				<iframe className="spotify-box"
					data-testid="embed-iframe"
					src="https://open.spotify.com/embed/album/0m1EXcI0GhqHMQXSfqhv5M?utm_source=generator&si=13494647b7e344df&theme=1"
					height="552"
					frameBorder="0"
					allowfullscreen=""
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy">	
				</iframe>
			</div>


			<div className="upcoming-events">
				<h1>UPCOMING EVENTS</h1>


				<div className="events"> <EventsBox /> </div>

			</div>
		

		</div>
	);
};

export default Home;