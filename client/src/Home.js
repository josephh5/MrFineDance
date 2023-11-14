import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [activeTab, setActiveTab] = useState('Home');
    const [topStocks, setTopStocks] = useState([]);
    
    useEffect(() => {
        axios.post('/', {})
            .then((response) => {
                setTopStocks(response.data);
            }).catch((error) => {
                console.error('Error fetching top stocks:', error);
            });
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            {/* <Navbar activeTab={activeTab} handleTabChange={handleTabChange} /> */}
            {
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
                      <Link to="/SearchStock" onClick={() => handleTabChange('SearchStocks')}>
                        Search Stocks
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            }
                <div>
                    {activeTab === 'Home' && Array.isArray(topStocks) && topStocks.length > 0 && (
                        <div className="top-5-stocks">
                            {topStocks.map((stock, index) => (
                                <div key={index} className="stock-card">
                                    <div className="stock-title">{stock[1]}</div> {/* Access the name from the tuple */}
                                    <div className="stock-details">
                                        <div>{stock[0]}</div> {/* Access the symbol from the tuple */}
                                        <div>Price: ${stock[2]}</div> {/* Access the price from the tuple */}
                                        <div>Time: {stock[3]}</div> {/* Access the datetime_of_price from the tuple */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
        </div>
    );
}

export default Home;