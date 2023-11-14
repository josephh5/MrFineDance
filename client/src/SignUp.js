// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Import the CSS file
import Dropdown from './Dropdown';
import {useNavigate} from "react-router-dom";
import SuccessPopup from './SuccessPopup';

function Signup() {
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [selectedOption, setSelectedOption] = useState('In what city were you born in?');
    const [securityAnswer, setSecurityAnswer] = useState('');

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const navigate = useNavigate();

    const registerUser = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:5000/signup', {
            username: username,
            email: email,
            password: password,
            selectedOption: selectedOption,
            securityAnswer: securityAnswer
        })
        .then(function (response) {
            console.log(response);
            if (response.data.error){
                handleSignUpFailure(response);
            }
            else{
                handleSignUpSuccess();
            }
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response.status === 401) {
                alert("Invalid credentials");
            }
        });
    };

    const handleSignUpFailure = (response) => {
        setShowSuccessPopup(false);
        if (response.data.error === 'Username already in use!') {
            alert("Username already in use!");
            navigate('/');
        }
        if (response.data.error === 'Email already in use!') {
            alert("Email already in use!");
            navigate('/');
        }
    };

    const handleSignUpSuccess = () => {
        setShowSuccessPopup(true);
        navigate('/HomeLoggedIn');
    };

    const goToHome = () => {
        navigate('/');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    /*return (
        <div className="signup-container">
            {!showSuccessPopup ? ( 
                <div>
                    <h2 className="signup-heading">Sign Up</h2>
                    <form onSubmit={registerUser}>
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
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="form-group">
                            <label htmlFor="SecurityQuestion">Select a security question:</label>
                            <Dropdown
                            options={['In what city were you born in?', 
                                    'What is the name of the first school you attended?', 
                                    'What is your oldest cousin\'s first name?']}
                            onChange={(selectedValue) => setSelectedOption(selectedValue)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="SecurityQuestionAnswer">Security Question Answer</label>
                            <input
                                type="text"
                                id="securityAnswer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            ) : (
                <SuccessPopup
                    onGoToHome={goToHome}
                    onLogin={goToLogin}
                />
            )}
        </div>
    );*/




    return (
        <div className="signup-container">
                <div>
                    <h2 className="signup-heading">Sign Up</h2>
                    <form onSubmit={registerUser}>
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
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="form-group">
                            <label htmlFor="SecurityQuestion">Select a security question:</label>
                            <Dropdown
                            options={['In what city were you born in?', 
                                    'What is the name of the first school you attended?', 
                                    'What is your oldest cousin\'s first name?']}
                            onChange={(selectedValue) => setSelectedOption(selectedValue)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="SecurityQuestionAnswer">Security Question Answer</label>
                            <input
                                type="text"
                                id="securityAnswer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export default Signup;