import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import YoutoubeIdExtractor from "../components/YoutubeIdExtractor.js";
import CityImage from '../assets/city.jpg';
import "./AdminStyleGlobal.css";

const ManageLatest = () => {
    const [latest, setLatest] = useState([]);
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

    const YoutubePreview = ({update}) => {
        return (
            <div className="video-preview-container">
                <a 
                    href={update.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="admin-thumb-link"
                    title="open on youtube"
                >
                    <img 
                        src={`https://img.youtube.com/vi/${YoutoubeIdExtractor({ link: update.mediaUrl })}/mqdefault.jpg`} 
                        alt="watch on youtube" 
                        className="admin-mini-thumb"
                    />
                </a>
            </div>
        )
    }

    const renderMedia = (update) => {
        switch (update.type) {
            case 'VIDEO':
                return < YoutubePreview update={update} />
            case 'IMAGE':
                return <img src={CityImage} alt={update.title} />;
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


    useEffect(() => {
            const fetchAlbums = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/latest');
                    const data = await response.json();
                    
                    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    
                    setLatest(sorted);
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to fetch updates:", error);
                    setLoading(false);
                }
            };
    
            fetchAlbums();
        }, []);

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
                    <div className="updates-table manage">
                        {latest.map((update) => (
                        <div key={update.id} className="update-row manage">

                            <div className={`latest-card ${update.type.toLowerCase()} manage`}>
                                <span className="timestamp">{formatDate(update.createdAt)}</span>
                                <h3>{update.title}</h3>
                                <div className="content-after-title">
                                    {renderMedia(update)}
                                    <p>{update.content}</p>
                                    
                                    <div className="row-buttons">
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