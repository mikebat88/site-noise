import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // if the admin is already logged in, redirect straight to dashboard
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/admin/dashboard', { replace: true });
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
                
                setMessage('');
                
                setTimeout(() => {
                    navigate('/admin/dashboard', { replace: true }); 
                }, 500);
                
            } else {
                setMessage('Invalid username or password');
            }
        } catch (error) {
            setMessage('Server error.');
        }
    };

    return (
        <div className="main-wrapper">
            <div className="form">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                    />
                    <button type="submit" >Login</button>
                </form>
                <div className="message-container">
                    {message ? <p>{message}</p> : null}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;