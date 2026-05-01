import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MusicGridGlobal.css";


const EditAlbums = () => {
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAdd = () => {
        navigate('/admin/add-album');
    };

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/albums');
                const data = await response.json();
                
                // Sort by date (latest first) so your newest uploads are at the top
                const sorted = data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                
                setAlbums(sorted);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch albums:", error);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    return (
        <div className="music-page">

            <button onClick={handleAdd} className='add-album-button'>add +</button>

            {loading ? (
            <p className="status-message">LOADING DATABASE...</p>
        ) : ( 
                <div className="album-grid">
                    {albums.map((album) => (
                    <div key={album.id} className="album-card">
                        <img 
                            src={`http://localhost:5000${album.cover}`} 
                            alt={album.title} 
                            className="album-cover" 
                        />
                        <h3 className="album-name">{album.title}</h3>
                        
                        <div className="edit-buttons">
                            <button onClick={handleAdd}>edit</button>
                            <button onClick={handleAdd}>remove</button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditAlbums;