// NavbarLoggedIn.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import LogoutModal from './LogoutModal';

const NavbarLoggedIn = ({ activeTab, handleTabChange }) => {
    const [username, setUsername] = useState("");
    const [logoutMessage, setLogoutMessage] = useState('');
    useEffect(() => {
        // Make an HTTP request to fetch username from the backend
        axios.post('/HomeLoggedIn')
            .then((response) => {
            setUsername(response.data.username);
        })
        .catch((error) => {
            // Handle any errors
            console.error('Error fetching username', error);
      });
  }, []);

  const handleLogout = () => {
    // Make an HTTP GET request to the /logout route
    axios.get('/logout')
      .then((response) => {
        // Handle the logout response, e.g., redirect to the login page
        if (response.data.message === 'Successfully logged out') {
          //setLogoutMessage('You have successfully logged out. You will be redirected to the home page.');
          /*window.alert('You have successfully logged out. You will be redirected to the home page in a few seconds.');
          setTimeout(() => {
            window.location.href = '/'; // Replace with your login page URL
          }, 3000);
          */
          const confirmation = window.confirm('You have successfully logged out. Click "OK" to be redirected to the home page.');
          if (confirmation) {
            window.location.href = '/'; 
          }
        } else {
          // Handle any potential errors or unexpected responses
          alert('Logout failed. Please try again.');
          //setLogoutMessage('Logout failed. Please try again.');
        }
      })
      .catch((error) => {
        // Handle any errors that may occur during the logout request
        console.error('Logout error:', error);
        //setLogoutMessage('An error occurred during logout. Please try again.');
        alert('An error occurred during logout. Please try again.');
      });
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <h1 className="small-text">MrFineDance</h1>
        <div className="user-actions">
          <p>Hi, {username}</p>
          <div>
              <button onClick={handleLogout}> Log Out</button>
          </div>
          {logoutMessage && <p>{logoutMessage}</p>}
        </div>
      </nav>
      <nav className="tabs">
        <ul>
          <li>
            <Link to="/HomeLoggedIn" onClick={() => handleTabChange('HomeLoggedIn')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/TrackBuy" onClick={() => handleTabChange('TrackBuy')}>
              Track Buy
            </Link>
          </li>
          <li>
            <Link to="/TrackSell" onClick={() => handleTabChange('TrackSell')}>
              Track Sell
            </Link>
          </li>
          <li>
            <Link to="/TransactionLog" onClick={() => handleTabChange('ViewTransactions')}>
              View Transactions
            </Link>
          </li>
          <li>
            <Link to="/SearchStockLoggedIn" onClick={() => handleTabChange('SearchStocks')}>
              Search Stocks
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavbarLoggedIn;