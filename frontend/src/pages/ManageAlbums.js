import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MusicGridGlobal.css";


const ManageAlbums = () => {
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);

    const handleAdd = () => {
        navigate('/admin/add-album');
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-album/${id}`);
    };

    const handleRemove = async () => {
        if (!albumToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/albums/${albumToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove the album from the local UI state so it disappears instantly
                setAlbums(albums.filter(a => a.id !== albumToDelete.id));
                closeModal();
            } else {
                alert("SYSTEM ERROR: COULD NOT DELETE RECORD");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const openModal = (album) => {
        setAlbumToDelete(album);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setAlbumToDelete(null);
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
            ) : albums.length == 0 ? (  
                <div className="empty-state">
                    <p>no albums in the database</p>
                    <p>add some using the add + button</p>
                </div>
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
                            <button onClick={() => handleEdit(album.id)}>edit</button>
                            <button className="admin-btn remove" onClick={() => openModal(album)}>remove</button>
                        </div>
                    </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>the following album will be removed</p>
                        <p className="album-name-highlight">"{albumToDelete?.title}"</p>
                        
                        <div className="modal-actions">
                            <button className="button-confirm" onClick={handleRemove}>CONFIRM REMOVAL</button>
                            <button className="button-cancel" onClick={closeModal}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAlbums;