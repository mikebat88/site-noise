import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChangePassword.css"

const ChangePassword = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                
                localStorage.setItem('token', data.token);
                
                setMessage("Password changed successfully");
                
                
                
            } else {
                setMessage('');
            }
        } catch (error) {
            setMessage('Server error.');
        }
    };

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>Change password</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        name="oldPassword"
                        type="password"
                        placeholder="Old password" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="newPassword"
                        type="password"
                        placeholder="New password" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="retypePassword" 
                        type="password" 
                        placeholder="Retype password" 
                        onChange={handleChange} 
                    />
                    <button type="submit" >Submit</button>
                </form>
                <div className="message-container">
                    {message ? <p>{message}</p> : null}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;