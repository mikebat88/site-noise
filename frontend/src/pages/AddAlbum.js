import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MusicGridGlobal.css";


const AddAlbum = () => {
    const [form, setForm] = useState({ title: '', buyLink: '', streamLink: '', releaseDate: '' });
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(true);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !file || !form.buyLink || !form.streamLink || !form.releaseDate) {
            setMessage("FIELDS CANNOT BE EMPTY");
            setStatus(false);
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append("Title", form.title);
            formData.append("Cover", file);
            formData.append("BuyLink", form.buyLink);
            formData.append("StreamLink", form.streamLink);
            formData.append("ReleaseDate", form.releaseDate);
    
            const response = await fetch('http://localhost:5000/api/albums', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setMessage("ALBUM ADDED");
                setStatus(true);
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
                <h2>add album</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        name="title"
                        type="text"
                        placeholder="title" 
                        onChange={handleChange} 
                    />
                    <div className="input-group">
                        <label>Cover Image (JPG/PNG)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="form-input" 
                        />
                    </div>
                    <input 
                        name="buyLink"
                        type="text"
                        placeholder="buy link" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="streamLink" 
                        type="text" 
                        placeholder="stream link" 
                        onChange={handleChange} 
                    />
                    <div className="input-group">
                        <label>release date</label>
                        <input
                            name="releaseDate"
                            type="date"
                            placeholder="release date" 
                            onChange={handleChange} 
                        />
                    </div>
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

export default AddAlbum;