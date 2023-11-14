import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://127.0.0.1:5000/login', {
                username: username,
                password: password,
            })
            .then(function (response) {
                console.log(response);
                if (response.data === 'User logged in') {
                    navigate('/HomeLoggedIn');
                } else {
                    setError('Invalid credentials. Please try again.');
                    setUsername('');
                    setPassword('');
                }
            })
            .catch(function (error) {
                console.log(error, 'error');
                setError('An error occurred while logging in.');
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <button type="submit">Log In</button>
                </div>
            </form>
            <div className="forgot-password-link">
                <Link to="/ForgotPassword">Forgot Password?</Link>
            </div>
        </div>
    );
}

export default Login;
