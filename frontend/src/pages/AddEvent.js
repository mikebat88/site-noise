import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormatUrl from "../components/FormatUrl.js";

import "./MusicGridGlobal.css";


const AddEvent = () => {
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || !form.venue || !form.city || !form.infoText || !form.infoLink) {
            setMessage("FIELDS CANNOT BE EMPTY");
            setStatus(false);
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append("Date", form.date);
            formData.append("Venue", form.venue);
            formData.append("City", form.city);
            formData.append("InfoText", form.infoText);
            formData.append("InfoLink", FormatUrl(form.infoLink));
    
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setMessage("SHOW ADDED");
                setStatus(true);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setMessage(`SERVER ERROR: ${response.statusText}`);
                setStatus(false);
            }
        } catch (err) {
            setMessage("SERVER UNREACHABLE");
            setStatus(false);
        }

    };

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>add show</h2>
                <form onSubmit={handleSubmit}>
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
                        placeholder="info text" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="infoLink" 
                        type="text" 
                        value={form.infoLink || ''}
                        placeholder="info link" 
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

export default AddEvent;