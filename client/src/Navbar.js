// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ activeTab, handleTabChange }) => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <h1 className="small-text">MrFineDance</h1>
        <div className="user-actions">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <nav className="tabs">
        <ul>
          <li>
            <Link to="/" onClick={() => handleTabChange('Home')}>
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
            <Link to="/SearchStock" onClick={() => handleTabChange('SearchStocks')}>
              Search Stocks
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
