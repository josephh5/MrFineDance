import React, { useState, useEffect } from 'react';
import NavbarLoggedIn from './NavbarLoggedIn';
import TrackBuy from './TrackBuy';
import TrackSell from './TrackSell';
import './Home.css';
import axios from 'axios';

function HomeLoggedIn() {
    const [activeTab, setActiveTab] = useState('HomeLoggedIn');
    const [topStocks, setTopStocks] = useState([]);

    useEffect(() => {
        if (activeTab === 'HomeLoggedIn') {
            axios.post('/HomeLoggedIn', {})
                .then((response) => {
                    console.log('Response from /HomeLoggedIn:', response.data);
                    setTopStocks(response.data.top_5_stocks_data);
                }).catch((error) => {
                    console.error('Error fetching top stocks:', error);
                });
            }

    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    return (
        <div>
            <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
                <div>
                    {activeTab === 'HomeLoggedIn' && Array.isArray(topStocks) && topStocks.length > 0 && (
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
                    {activeTab === 'TrackBuy' && <TrackBuy />}
                    {activeTab === 'TrackSell' && <TrackSell />}
                </div>
        </div>
    );
}

export default HomeLoggedIn;