// screens/ResetPasswordPage.tsx
import React, { useState } from 'react';
import './styles/ResetPasswordPage.css';

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = () => {
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }
        // Call API to reset password
        setMessage("A reset link has been sent to your email.");
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            {message && <p className="message">{message}</p>}
            <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={handlePasswordReset}>Submit</button>
        </div>
    );
};

export default ResetPasswordPage;

