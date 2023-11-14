import React from 'react';

const SuccessPopup = ({ onGoToHome, onLogin }) => {
    const popupStyle = {
        display: 'block', // Ensure the popup is visible
        backgroundColor: 'white', // Customize the background color
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999,
      };
    
    return (
        <div className="success-popup">
        <h2>You have successfully created your account!</h2>
        <button onClick={onGoToHome}>Go to Home</button>
        <button onClick={onLogin}>Login</button>
        </div>
    );
};

export default SuccessPopup;
