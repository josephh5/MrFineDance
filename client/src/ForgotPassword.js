import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const { username, email } = useParams();
    const navigate = useNavigate();

    const [usernameInput, setUsernameInput] = useState(username || '');
    const [emailInput, setEmailInput] = useState(email || '');
    const [securityQuestion, setSecurityQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameEmailSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/getSecurityQuestion', {
                username: usernameInput,
                email: emailInput,
            });

            const securityQuestionFromServer = response.data.securityQuestion;

            console.log('Security Question:', securityQuestionFromServer);

            // Use setTimeout to allow time for state update and re-render
            setTimeout(() => {
                setSecurityQuestion(securityQuestionFromServer);
                setError(null);
            }, 0);

            console.log('Before navigation');
            // Comment out the navigation temporarily to see if it logs
            // navigate('/login');
        } catch (error) {
            console.error('Error fetching security question:', error);

            // Use setTimeout to allow time for state update and re-render
            setTimeout(() => {
                setSecurityQuestion(null);
                setError('Invalid username or email. Please try again.');
            }, 0);
        }
        console.log('After try-catch block');
    };
    
    
    

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
    
        // Validate answer, new password, and repeat password
        if (!answer || !newPassword || !repeatPassword) {
            setError('Please fill in all fields.');
            return;
        }
    
        // Check if the new password matches the repeated password
        if (newPassword !== repeatPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }
    
        try {
            // Send the data to the backend for validation and password update
            const response = await axios.post('http://127.0.0.1:5000/ForgotPassword', {
                username: usernameInput,
                email: emailInput,
                answer: answer,
                newPassword: newPassword,
                repeatPassword: repeatPassword,
            });
    
            // Check the response for success or handle accordingly
            console.log(response.data);
    
            // If successful, navigate to the login page or display a success message
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('An error occurred while resetting the password. Please try again.');
        }
    };
    
    

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            {securityQuestion ? (
                // Display security question, answer, and password form
                <form onSubmit={handleSecuritySubmit}>
                    <div className="form-group">
                        <label>Security Question: {securityQuestion}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="answer">Answer</label>
                        <input
                            type="text"
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="repeatPassword">Repeat Password</label>
                        <input
                            type="password"
                            id="repeatPassword"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Reset Password</button>
                    </div>
                </form>
            ) : (
                // Display username and email form
                <form onSubmit={handleUsernameEmailSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Next</button>
                    </div>
                </form>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ForgotPassword;


