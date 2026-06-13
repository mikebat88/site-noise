import React, { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router-dom';
import "./MusicGridGlobal.css";


const EditLatest = () => {
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
    const { id } = useParams();
    const [existingImagePath, setExistingImagePath] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };  

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append("Title", form.title);
        formData.append("Type", form.type);

        if (form.content == null) {
                formData.append("Content", "");
            } else {
                formData.append("Content", form.content);
            }
        
        if (form.type == "IMAGE") {
            // only append the file if the user actually picked a new one
            if (file) {
                formData.append("Cover", file);
            }
        } else {
            formData.append("MediaUrl", form.mediaUrl);
        }


        const response = await fetch(`/api/latest/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            setStatus(true);
            setMessage("NEWS UPDATE CHANGE SAVED");

            setTimeout(() => {
                navigate('/admin/latest-edit');
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            const response = await fetch(`/api/latest/${id}`);
            const data = await response.json();

            console.log("data: " + data.mediaUrl);
            
            if (data.type == "IMAGE" || data.type == "VIDEO") {
                setExistingImagePath(data.mediaUrl);
                
            }
            setForm({
                title: data.title,
                type: data.type,
                content: data.content, 
                mediaUrl: data.mediaUrl, 
            });
        };

        if (id) fetchEvent();
    }, [id]);

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>edit news update</h2>
                <form onSubmit={handleUpdate}>
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
                            <label>current image</label>
                            <img src={`/${existingImagePath}`} className="edit-cover-preview-small" />
                            
                            <label>upload new (optional)</label>
                            <input 
                                type="file"
                                name="mediaUrl"
                                id="image-input"
                                type="file"
                                accept="image/*" 
                                onChange={handleFileChange} />
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

export default EditLatest;