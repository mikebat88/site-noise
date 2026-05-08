import React from 'react';
import { ReactComponent as EmailIcon } from '../assets/email.svg';
import { ReactComponent as InstagramIcon } from '../assets/instagram-pixel.svg';
import { TypeAnimation } from 'react-type-animation';
import "./Contact.css";


const Contact = () => {
    
/*
    useEffect(() => {
        
    }, []);

    //if (error) return <div>Error: {error}</div>;
*/
    return (
        <div className="contact-container">
            
            <h1 className="contact-title">
                    <TypeAnimation className="title"
                    sequence={[
                        "reach out to us"
                    ]}
                    cursor={false}
                    wrapper="span"
                    speed={40}
                />
                <span className="blink">_</span>
            </h1>
            <div className="contact-items">
                <div className="contact-item email">
                    <div className="contact-icon email"><EmailIcon /></div>
                    <p>yaboismusicofficial@gmail.com</p>
                </div>
                <div className="contact-item instagram">
                    <div className="contact-icon instagram"><InstagramIcon /></div>
                    <p>@noise_withaslash</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;