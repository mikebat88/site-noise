import React, { useEffect, useState } from "react";
import "./EventsBox.css";

const EventsBox = () => {
    const [loading, setLoading] = useState(false);

    const events = [{
            "id": 1,
            "date": "2026-08-14",
            "venue": "venue1",
            "city": "city1",
            "infoText": "more info",
            "infoLink": "https://www.bassdrumofdeath.com/tour"
        }, {
            "id": 2,
            "date": "2026-09-01",
            "venue": "venue2",
            "city": "city2",
            "infoText": "tickets",
            "infoLink": "https://www.bassdrumofdeath.com/tour",
        }
    ]


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
                        <p>{event.date} - {event.city} - {event.venue} - </p>
                        <a href={event.infoLink}> {event.infoText}</a>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default EventsBox;