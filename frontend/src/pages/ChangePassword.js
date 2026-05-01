import "./AdminStyleGlobal.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', retypePassword: '' });
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword != passwords.retypePassword) {
            setStatus('error');
            setMessage("Passwords don't match");
            return;
        }

        if (passwords.oldPassword == '' || passwords.newPassword == '' || passwords.retypePassword == '') {
            setStatus('error');
            setMessage("Fields cannot be empty");
            return;
        }

        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('http://localhost:5000/api/admin/change-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });

            if (response.ok) {
                setStatus('success');
                setMessage("Password changed successfully");
                setPasswords({ oldPassword: '', newPassword: '' , retypePassword: ''});
            } else {
                setStatus('error');
                const errorData = await response.json();
                setMessage(errorData.message || 'Update failed');
            }
        } catch (error) {
            setMessage('CONNECTION ERROR: Server unreachable');
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
                    {message ? (
                        <p className={`status-msg ${status === 'success' ? 'success-msg' : 'error-msg'}`}>
                            {message}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;