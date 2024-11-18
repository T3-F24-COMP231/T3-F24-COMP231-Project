// screens/LoginPage.tsx
import React, { useState } from 'react';
import './styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            setError("Username and Password are required.");
            return;
        }
        // Call API to log in
        console.log("User logged in:", { username });
        setError(''); // Clear error
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            {error && <p className="error">{error}</p>}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
