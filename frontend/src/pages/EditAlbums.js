import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MusicGridGlobal.css";


const EditAlbums = () => {
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate('/admin/addAlbum');
    };

    const albums = [
        {
            id: 1,
            title: "SIX",
            image: "/path-to-six-cover.jpg",
            buyLink: "https://yourshop.com/six",
            streamLink: "https://spotify.com/six"
        },
        {
            id: 2,
            title: "LIVE...AND LET DIE",
            image: "/path-to-live-cover.jpg",
            buyLink: "https://yourshop.com/live",
            streamLink: "https://spotify.com/live"
        },
        {
            id: 3,
            title: "LIVE...AND LET DIE",
            image: "/path-to-live-cover.jpg",
            buyLink: "https://yourshop.com/live",
            streamLink: "https://spotify.com/live"
        },
        {
            id: 4,
            title: "LIVE...AND LET DIE",
            image: "/path-to-live-cover.jpg",
            buyLink: "https://yourshop.com/live",
            streamLink: "https://spotify.com/live"
        },
        {
            id: 5,
            title: "LIVE...AND LET DIE",
            image: "/path-to-live-cover.jpg",
            buyLink: "https://yourshop.com/live",
            streamLink: "https://spotify.com/live"
        }
    ];

    return (
        <div className="music-page">

            <button onClick={handleAdd} className='add-album-button'>add +</button>

            <div className="album-grid">
                {albums.map((album) => (
                <div key={album.id} className="album-card">
                    <img src={album.image} alt={album.title} className="album-cover" />
                    <h3 className="album-name">{album.title}</h3>
                    
                    <div className="edit-buttons">
                    <button onClick={handleAdd}>edit</button>
                    <button onClick={handleAdd}>remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

export default EditAlbums;