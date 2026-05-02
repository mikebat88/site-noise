import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./MusicGridGlobal.css";


const EditAlbum = () => {
    const initialFormState = { 
        title: '', 
        buyLink: '', 
        streamLink: '', 
        releaseDate: '' 
    };
    const [form, setForm] = useState(initialFormState);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(true);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [existingCoverPath, setExistingCoverPath] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append("Title", form.title);
        formData.append("BuyLink", form.buyLink);
        formData.append("StreamLink", form.streamLink);
        formData.append("ReleaseDate", form.releaseDate);
        
        // Only append the file if the user actually picked a new one
        if (file) {
            formData.append("Cover", file);
        }

        const response = await fetch(`http://localhost:5000/api/albums/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            setStatus(true);
            setMessage("ALBUM CHANGE SAVED");

            setTimeout(() => {
                navigate('/admin/albums-edit');
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await fetch(`http://localhost:5000/api/album/${id}`);
            const data = await response.json();
            setExistingCoverPath(data.cover);
            setForm({
                title: data.title,
                buyLink: data.buyLink,
                streamLink: data.streamLink,
                releaseDate: data.releaseDate.split('T')[0]
            });

            console.log(`GAKJBAG ${data.title}`)
        };

        if (id) fetchAlbum();
    }, [id]);

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>edit album</h2>
                <form onSubmit={handleUpdate}>
                    <   input 
                        name="title"
                        type="text"
                        value={form.title || ''}
                        placeholder="title" 
                        onChange={handleChange} 
                    />
                    <div className="input-group">
                        <label>current cover</label>
                        <img src={`http://localhost:5000${existingCoverPath}`} className="edit-cover-preview-small" />
                        
                        <label>upload new (optional)</label>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                    <input 
                        name="buyLink"
                        type="text"
                        value={form.buyLink || ''}
                        placeholder="buy link" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="streamLink" 
                        type="text" 
                        value={form.streamLink || ''}
                        placeholder="stream link" 
                        onChange={handleChange} 
                    />
                    <div className="input-group">
                        <label>release date</label>
                        <input
                            name="releaseDate"
                            type="date"
                            value={form.releaseDate || ''}
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

export default EditAlbum;