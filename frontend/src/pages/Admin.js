import React, { useState } from 'react';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

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
                
                // SAVE THE TOKEN: This is the "somewhere" you mentioned!
                localStorage.setItem('token', data.token);
                
                setMessage('Login successful! Token saved.');
                // Optional: Redirect to admin dashboard here
            } else {
                setMessage('Invalid username or password.');
            }
        } catch (error) {
            setMessage('Server error.');
        }
    };

    /*const addLink = async (linkData) => {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(linkData)
        });

        if (response.ok) {
            console.log("Link added successfully!");
        } else if (response.status === 401) {
            console.error("You aren't logged in or your token expired.");
        }
    };*/

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px' }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="username" 
                    placeholder="Username" 
                    onChange={handleChange} 
                    style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                />
                <button type="submit" style={{ width: '100%' }}>Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;