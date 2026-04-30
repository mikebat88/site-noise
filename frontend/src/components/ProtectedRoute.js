import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isVerified, setIsVerified] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsVerified(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    setIsVerified(true);
                } else {
                    localStorage.removeItem('token');
                    setIsVerified(false);
                }
            } catch (error) {
                console.error("Verification failed", error);
                setIsVerified(false);
            }
        };

        verifyToken();
    }, []);

    // 1. While the API call is happening, show a loading screen
    if (isVerified === null) {
        return (
            <div className="main-wrapper" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'Courier New', letterSpacing: '2px' }}>
                    verifying...
                </p>
            </div>
        );
    }

    if (!isVerified) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;