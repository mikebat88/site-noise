import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MusicGridGlobal.css";


const AddLatest = () => {
    const initialFormState = { 
        title: "", 
        type: "TEXT",
        content: "", 
        mediaUrl: "", 
    };
    const [form, setForm] = useState(initialFormState);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(true);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        setForm({
            ...form,
            type: e.target.value,
            mediaUrl: ""
        });
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.type || !form.title) {
            setMessage("FIELDS CANNOT BE EMPTY");
            setStatus(false);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("Title", form.title);
            formData.append("Type", form.type);

            if (form.type === "VIDEO") {
                formData.append("MediaUrl", form.mediaUrl);
            }

            
            if (form.type === "IMAGE" && file) {
                formData.append("MediaUrl", file); 
            }
                
            const response = await fetch('http://localhost:5000/api/latest', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setMessage("UPDATE ADDED");
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
                <h2>add news update</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>select type</label>
                        <select value={form.type} onChange={handleTypeChange}>
                            <option value="TEXT">text</option>
                            <option value="VIDEO">youtube video</option>
                            <option value="IMAGE">image</option>
                        </select>
                    </div>


                    <div className="input-group">
                        <label>title</label>
                        <input
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    {form.type === "VIDEO" && (
                        <div className="input-group">
                            <label>youtube link</label>
                            <input 
                                name="mediaUrl"
                                type="text" 
                                placeholder="https://www.youtube.com/watch?v=..." 
                                value={form.mediaUrl} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {form.type === "IMAGE" && (
                        <div className="input-group">
                            <label>insert image</label>
                            <input
                                name="mediaUrl"
                                id="image-input"
                                type="file"
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="form-input" 
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>content (optional)</label>
                        <textarea
                            name="content"
                            rows="6"
                            value={form.content}
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

export default AddLatest;