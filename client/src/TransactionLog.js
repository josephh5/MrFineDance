import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLoggedIn from './NavbarLoggedIn';
import './TransactionLog.css';
import { Line } from 'react-chartjs-2';
import { Chart }  from 'chart.js/auto';

const TransactionLog = () => {
    const [buyTransactions, setBuyTransactions] = useState([]);
    const [sellTransactions, setSellTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('TransactionLog');
    const [totalAmountSpent, setTotalAmountSpent] = useState(0);
    const [totalAmountMade, setTotalAmountMade] = useState(0);
    const [historicalData, setHistoricalData] = useState({});
    const [error, setError] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/getTotalAmountSpent')
            .then((response) => {
                setTotalAmountSpent(response.data.totalAmountSpent);
            })
            .catch((error) => {
                console.error('Error fetching total amount spent:', error);
            });

        axios.get('http://127.0.0.1:5000/getTotalAmountMade')
            .then((response) => {
                setTotalAmountMade(response.data.totalAmountMade);
            })
            .catch((error) => {
                console.error('Error fetching total amount made:', error);
            });

        // Fetch buy transactions
        axios.get('/TrackBuy')
            .then((response) => {
                console.log('Buy Transactions:', response.data);
                // Convert JSON object to an array
                setBuyTransactions(Object.values(response.data));
            })
            .catch((error) => {
                console.error('Error fetching buy transactions:', error);
            });

        // Fetch sell transactions
        axios.get('/TrackSell')
            .then((response) => {
                console.log('Sell Transactions:', response.data);
                // Convert JSON object to an array
                setSellTransactions(Object.values(response.data));
            })
            .catch((error) => {
                console.error('Error fetching sell transactions:', error);
            });
    }, []);


    useEffect(() => {
        const fetchHistoricalDataForTransactions = async () => {
            try {
                const buyPromises = buyTransactions.map(async (row) => {
                    const response = await axios.get(`http://127.0.0.1:5000/getHistoricalData?symbol=${row.stock_symbol}`);
                    return {
                        id: row.transaction_id,
                        isBuy: true,
                        data: response.data,
                    };
                });

                const sellPromises = sellTransactions.map(async (row) => {
                    const response = await axios.get(`http://127.0.0.1:5000/getHistoricalData?symbol=${row.stock_symbol}`);
                    return {
                        id: row.receipt_id,
                        isBuy: false,
                        data: response.data,
                    };
                });

                const allPromises = [...buyPromises, ...sellPromises];
                const results = await Promise.all(allPromises);

                const newData = results.reduce((acc, { id, isBuy, data }) => {
                    acc[isBuy ? `buy-${id}` : `sell-${id}`] = data;
                    return acc;
                }, {});
                console.log("NewData: ", newData);

                // Set the historical data first
                setHistoricalData((prevData) => ({
                    ...prevData,
                    ...newData,
                }));

                // Now, create charts for each data set
                Object.entries(newData).forEach(([key, data]) => {
                    const [type, id] = key.split('-');
                    const canvas = document.getElementById(key);
                    const ctx = canvas.getContext('2d');

                    // Destroy existing chart before rendering a new one
                    if (canvas.chart) {
                        canvas.chart.destroy();
                    }

                    canvas.chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.timestamp,
                            datasets: [
                                {
                                    label: 'Closing Price',
                                    data: data.indicators.quote.map(entry => entry.close),
                                    fill: false,
                                    borderColor: 'rgb(75, 192, 192)',
                                },
                            ],
                        },
                    });
                });

            } catch (error) {
                console.error('Error fetching historical data:', error);
            }
        };

        fetchHistoricalDataForTransactions();
    }, [buyTransactions, sellTransactions]);



    const renderLineChart = (id, labels, data) => {
        console.log('Data in renderLineChart:', data);
        console.log("Labels in renderLineChart: ", labels)

        if (!labels || !data) {
            return <p style={{ color: 'red' }}>No historical data found.</p>;
        }

        return (
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <canvas id={id} />
            </div>
        );

    };



    return (
        <div className="transaction-log-container">
            <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
            <div className="transaction-log-content">
                <h2>Transaction Log</h2>

                <div className="totals">
                    <h3 style={{ color: 'red' }}>Total Amount Spent: ${totalAmountSpent}</h3>
                    <h3 style={{ color: 'green' }}>Total Amount Made: ${totalAmountMade}</h3>
                </div>

                <div className="log-table">
                    <h3>Buy Transactions</h3>
                    {buyTransactions.length === 0 ? (
                        <p style={{ color: 'red' }}>No buy transactions to display, add them in Track Buy!</p>
                    ) : (
                        buyTransactions.map((row, index) => (
                            <div key={index} className="log-row">
                                <div className="log-column">
                                    <div>Transaction ID: {row.transaction_id}</div>
                                    <div>Shares: {row.shares}</div>
                                    <div>Stock Symbol: {row.stock_symbol}</div>
                                    <div>Stock Name: {row.stock_name}</div>
                                    <div>Buy Price: ${row.buy_price}</div>
                                    <div>Buy Date: {row.buy_date}</div>
                                    <div>Notes: {row.notes}</div>
                                    <div className="historical-data">
                                        {renderLineChart(`buy-${row.transaction_id}`, historicalData[`buy-${row.transaction_id}`]?.timestamp, historicalData[`buy-${row.transaction_id}`]?.indicators.quote.map(entry => entry.close))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="log-table">
                    <h3>Sell Transactions</h3>
                    {sellTransactions.length === 0 ? (
                        <p style={{ color: 'red' }}>No sell transactions to display, add them in Track Sell!</p>
                    ) : (
                        sellTransactions.map((row, index) => (
                            <div key={index} className="log-row">
                                <div className="log-column">
                                    <div>Receipt ID: {row.receipt_id}</div>
                                    <div>Shares: {row.shares}</div>
                                    <div>Stock Symbol: {row.stock_symbol}</div>
                                    <div>Stock Name: {row.stock_name}</div>
                                    <div>Sell Price: ${row.sell_price}</div>
                                    <div>Sell Date: {row.sell_date}</div>
                                    <div>Notes: {row.notes}</div>
                                    <div className="historical-data">
                                        {renderLineChart(`sell-${row.receipt_id}`, historicalData[`sell-${row.receipt_id}`]?.timestamp, historicalData[`sell-${row.receipt_id}`]?.indicators.quote.map(entry => entry.close))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionLog;

