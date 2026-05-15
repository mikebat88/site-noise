import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import cityImage from '../assets/city.jpg';
import "./Latest.css";

const Latest = () => {
    //const [latest, setLatest] = useState([]);
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
                return <YouTubeEmbed id={update.mediaUrl} />;
            case 'IMAGE':
                return <img src={cityImage} alt={update.title} />;
            case 'TEXT':
                default:
                return null;
        }
    };

    const [latest, setLatest] = useState([
        {
            "id": 1,
            "title": "title1",
            "content": "kmbklnbknlsdkndsgklnsd nllnasdnlda nladsnlads lsanklgdskngsdnkl",
            "mediaUrl": null,
            "type": "TEXT",
            "createdAt": "2026-05-14",
            "isVisible": true
        },
        {
            "id": 2,
            "title": "title2",
            "content": "",
            "mediaUrl": "NcOwTceSbH4",
            "type": "VIDEO",
            "createdAt": "2026-05-12",
            "isVisible": false
        },
        {
            "id": 3,
            "title": "title3",
            "content": "kllkad dalkdafkl adflkfafalk adll",
            "mediaUrl": "../assets/city.jpg",
            "type": "IMAGE",
            "createdAt": "2026-05-16",
            "isVisible": false
        }
    ]);
/*
    useEffect(() => {
            const fetchAlbums = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/latest');
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
*/

    return (
        <div className="main-container">
            
            <div className="updates-list">
                {loading ? (
                    <p className="status-message">LOADING DATABASE...</p>
                ) : latest.length == 0 ? (  
                    <div className="empty-state">
                        <p>no news currently added</p>
                    </div>
                ) : (
                    <div className="updates-table">
                        {latest.map((update) => (
                        <div key={update.id} className="update-row">

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