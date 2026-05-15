import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import "./AdminStyleGlobal.css";

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
        
        return formatted.toLowerCase();
    };

    const handleAdd = () => {
        navigate('/admin/add-event');
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-event/${id}`);
    };

    const handleRemove = async () => {
        if (!eventToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/events/${eventToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEvents(events.filter(a => a.id !== eventToDelete.id));
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
        setEventToDelete(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEventToDelete(null);
    };

    useEffect(() => {
            const fetchAlbums = async () => {
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
    
            fetchAlbums();
        }, []);

    return (
        <div className="main-container">
            
            <button onClick={handleAdd} className='add-album-button'>add +</button>

            <div className="events-box manage">
                {loading ? (
                    <p className="status-message">LOADING DATABASE...</p>
                ) : events.length == 0 ? (  
                    <div className="empty-state events">
                        <p>no events currently planned</p>
                    </div>
                ) : (
                    <div className="events-table">
                        {events.map((event) => (
                        <div key={event.id} className="event-row manage">
                            <p>{formatDate(event.date)} - {event.city} - {event.venue}</p>
                            <div className="edit-buttons svg">
                                <button onClick={() => handleEdit(event.id)}> <EditIcon /> </button>
                                <button className="admin-btn remove" onClick={() => openModal(event)}> <TrashIcon /> </button>
                            </div>
                        </div>
                    ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>the following event will be removed</p>
                            <p className="album-name-highlight">"{eventToDelete?.date} - {eventToDelete?.venue}"</p>
                            
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

export default ManageEvents;