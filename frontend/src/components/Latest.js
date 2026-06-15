import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YoutubeIdExtractor from "./YoutubeIdExtractor.js";
import "./Latest.css";

const Latest = () => {
    const [latest, setLatest] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
        let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
        
        return formatted;
    };

    const YouTubeEmbed = ({ id }) => (
        <div className="video-responsive">
            <iframe
                width="100%"
                height="450"
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                />
        </div>
    );

    const renderMedia = (update) => {
        switch (update.type) {
            case 'VIDEO':
                return <YouTubeEmbed id={YoutubeIdExtractor(update.mediaUrl)} />;
            case 'IMAGE':
                return <img src={`${update.mediaUrl}`} alt={update.title} />;
            case 'TEXT':
                default:
                return null;
        }
    };


    useEffect(() => {
            const fetchAlbums = async () => {
                try {
                    const response = await fetch('/api/latest');
                    const data = await response.json();
                    
                    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    
                    setLatest(sorted);
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to fetch events:", error);
                    setLoading(false);
                }
            };
    
            fetchAlbums();
        }, []);

    return (
        <div className="main-container">
            
            <div className="updates-list">
                {loading ? (
                    <p className="status-message">LOADING DATABASE...</p>
                ) : latest.filter((update) => update.isVisible).length == 0 ? (  
                    <div className="empty-state">
                        <p>no news at the moment</p>
                    </div>
                ) : (
                    <div className="updates-table">
                        {latest
                            .filter((update) => update.isVisible)
                            .map((update) => (
                        <div className="update-row">

                            <div className={`latest-card ${update.type.toLowerCase()}   `}>
                                <span className="timestamp">{formatDate(update.createdAt)}</span>
                                <h3>{update.title}</h3>
                                <div className="media"> {renderMedia(update)} </div>
                                <p>{update.content}</p>
                            </div>
                            
                            <div className="separator"></div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Latest;