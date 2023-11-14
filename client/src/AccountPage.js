// src/HomePage.js
import React from 'react';
import './AccountPage.css';
import { Link } from 'react-router-dom';

function AccountPage() {
    return (
        <div className="home-container">
            <h1>$Mr. Finedance</h1>
            <div className="button-container">
                <Link to="/login" className="button">Log In</Link>
                <Link to="/signup" className="button">Sign Up</Link>
            </div>
        </div>
    );
}

export default AccountPage;