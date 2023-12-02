import React, { useState, useEffect } from 'react';
import NavbarLoggedIn from './NavbarLoggedIn';
import TrackBuy from './TrackBuy';
import TrackSell from './TrackSell';
import './Home.css';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

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

    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const fetchHistoricalData = async (symbol, index) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/getHistoricalData?symbol=${symbol}`);
            const historicalData = response.data;

            if (historicalData.timestamp && historicalData.indicators) {
                const ctx = document.getElementById(`stockChart${index}`).getContext('2d');
                // eslint-disable-next-line no-unused-vars
                const stockChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: historicalData.timestamp,
                        datasets: [
                            {
                                label: `Closing Price - ${symbol}`,
                                data: historicalData.indicators.quote.map((entry) => entry.close),
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                    },
                });
            } else {
                // Handle case when no data is available
                const canvas = document.getElementById(`stockChart${index}`);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'darkred';
                ctx.font = '16px Arial';
                const text = 'No historical data found.';
                const textWidth = ctx.measureText(text).width; // Get the width of the text

                // Calculate the starting position for centering the text horizontally
                const xPos = (canvas.width - textWidth) / 2;

                ctx.fillText(text, xPos, canvas.height / 2);
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    useEffect(() => {
        if (Array.isArray(topStocks) && topStocks.length > 0) {
            topStocks.forEach((stock, index) => {
                fetchHistoricalData(stock[0], index);
            });
        }
    }, [topStocks]);

    return (
        <div>
            <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
                <div>
                    {activeTab === 'HomeLoggedIn' && Array.isArray(topStocks) && topStocks.length > 0 && (
                    <div className="top-5-stocks">
                        {topStocks.map((stock, index) => (
                            <div key={index} className="stock-container">
                                <div className="stock-card">
                                    <div className="stock-title">{stock[1]}</div> {/* Access the name from the tuple */}
                                    <div className="stock-details">
                                        <div>{stock[0]}</div> {/* Access the symbol from the tuple */}
                                        <div>Price: ${stock[2]}</div> {/* Access the price from the tuple */}
                                        <div>Time: {stock[3]}</div> {/* Access the datetime_of_price from the tuple */}
                                    </div>
                                </div>

                                {/* Render canvas for each stock */}
                                <div className="graph-container">
                                    <p><strong>Closing Price of {stock[0]} from the past two years:</strong></p>
                                    <canvas id={`stockChart${index}`} width="600" height="200"></canvas>
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