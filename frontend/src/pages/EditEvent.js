import React, { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router-dom';
import FormatUrl from "../components/FormatUrl.js";
import "./MusicGridGlobal.css";


const EditEvent = () => {
    const initialFormState = { 
        date: '', 
        venue: '', 
        city: '', 
        infoText: '', 
        infoLink: '' 
    };
    const [form, setForm] = useState(initialFormState);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append("Date", form.date);
        formData.append("Venue", form.venue);
        formData.append("City", form.city);
        formData.append("infoText", form.infoText);
        formData.append("infoLink", FormatUrl(form.infoLink));

        const response = await fetch(`/api/events/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            setStatus(true);
            setMessage("EVENT CHANGE SAVED");

            setTimeout(() => {
                navigate('/admin/events-edit');
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            const response = await fetch(`/api/events/${id}`);
            const data = await response.json();
            
            setForm({
                date: data.date.split("T")[0],
                venue: data.venue,
                city: data.city,
                infoText: data.infoText,
                infoLink: data.infoLink
            });
        };

        if (id) fetchEvent();
    }, [id]);

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>edit shows</h2>
                <form onSubmit={handleUpdate}>
                    <div className="input-group">
                        <label>date</label>
                        <input
                            name="date"
                            type="date"
                            value={form.date || ''}
                            placeholder="date" 
                            onChange={handleChange} 
                        />
                    </div>
                    <input 
                        name="venue"
                        type="text"
                        value={form.venue || ''}
                        placeholder="venue" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="city"
                        type="text"
                        value={form.city || ''}
                        placeholder="city" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="infoText" 
                        type="text" 
                        value={form.infoText || ''}
                        placeholder="infoText" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="infoLink" 
                        type="text" 
                        value={form.infoLink || ''}
                        placeholder="infoLink" 
                        onChange={handleChange} 
                    />
                    <button type="submit" >Submit</button>
                </form>
                <div className="message-container">
                    {message ? (
                        <p className={`status-msg ${status ? 'success-msg' : 'error-msg'}`}>
                            {message}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default EditEvent;