import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import "./AdminStyleGlobal.css";

const ManageLatest = () => {
    //const [latest, setLatest] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updateToDelete, setUpdateToDelete] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
        let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
        
        return formatted;
    };

    const renderMedia = (update) => {
        switch (update.type) {
            case 'VIDEO':
                return <iframe src={update.mediaUrl} title="video" />;
            case 'IMAGE':
                return <img src={update.mediaUrl} alt={update.title} />;
            case 'TEXT':
                default:
                return null;
        }
    };

    const handleAdd = () => {
        navigate('/admin/add-latest');
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-latest/${id}`);
    };

    const handleRemove = async () => {
        /*
        if (!updateToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/latest/${updateToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setLatest(latest.filter(a => a.id !== updateToDelete.id));
                closeModal();
            } else {
                alert("SYSTEM ERROR: COULD NOT DELETE RECORD");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
*/
        return;
    };

    const openModal = (event) => {
        setUpdateToDelete(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setUpdateToDelete(null);
    };

    const toggleVisibility = (id) => {
        setLatest((prevLatest) =>
            prevLatest.map((item) =>
                item.id === id
                    ? { ...item, isVisible: !item.isVisible }
                    : item
            )
        );
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
            "mediaUrl": "https://www.youtube.com/watch?v=NcOwTceSbH4",
            "type": "VIDEO",
            "createdAt": "2026-05-12",
            "isVisible": false
        },
        {
            "id": 3,
            "title": "title3",
            "content": "kllkad dalkdafkl adflkfafalk adll",
            "mediaUrl": "city.jpg",
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
            
            <button onClick={handleAdd} className='add-album-button'>add +</button>

            <div className="updates-list manage">
                {loading ? (
                    <p className="status-message">LOADING DATABASE...</p>
                ) : latest.length == 0 ? (  
                    <div className="empty-state">
                        <p>no news currently added</p>
                    </div>
                ) : (
                    <div className="updates-table">
                        {latest.map((update) => (
                        <div key={update.id} className="update-row manage">

                            <div className={`latest-card ${update.type.toLowerCase()} manage`}>
                                <span className="timestamp">{formatDate(update.createdAt)}</span>
                                <h3>{update.title}</h3>
                                {renderMedia(update)}
                                <p>{update.content}</p>
                                <label className="is-visible-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={update.isVisible} 
                                        onChange={() => toggleVisibility(update.id)} 
                                    />
                                    <span className="status-text">[ {update.isVisible ? "ACTIVE" : "HIDDEN"} ]</span>
                                </label>
                                <div className="edit-buttons svg">
                                    <button onClick={() => handleEdit(update.id)}> <EditIcon /> </button>
                                    <button className="admin-btn remove" onClick={() => openModal(update)}> <TrashIcon /> </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>the following update will be removed</p>
                            <p className="album-name-highlight">"{updateToDelete?.title}"</p>
                            
                            <div className="modal-actions">
                                <button className="button-confirm" onClick={handleRemove}>CONFIRM REMOVAL</button>
                                <button className="button-cancel" onClick={closeModal}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLatest;