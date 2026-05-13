import React, { useEffect, useState } from "react";
import "./EventsBox.css";

const EventsBox = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
        
        return formatted.toLowerCase();
    };

	useEffect(() => {
			const fetchEvents = async () => {
				try {
					const response = await fetch('http://localhost:5000/api/events');
					const data = await response.json();
					
					const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
					
					setEvents(sorted);
					setLoading(false);
				} catch (error) {
					console.error("Failed to fetch events:", error);
					setLoading(false);
				}
			};
	
			fetchEvents();
		}, []);

    return (
        <div className="events-box">
            {loading ? (
                <p className="status-message">LOADING DATABASE...</p>
            ) : events.length == 0 ? (  
                <div className="empty-state">
                    <p>no events currently planned</p>
                </div>
            ) : (
                <div className="events-table">
                    {events.map((event) => (
                    <div key={event.id} className="event-row">
                        <p>{formatDate(event.date)} - {event.city} - {event.venue} - </p>
                        <a href={event.infoLink}> {event.infoText}</a>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default EventsBox;