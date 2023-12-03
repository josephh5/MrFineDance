import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLoggedIn from './NavbarLoggedIn';
import './TransactionLog.css';

const TransactionLog = () => {
    const [buyTransactions, setBuyTransactions] = useState([]);
    const [sellTransactions, setSellTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('TransactionLog');
    const [totalAmountSpent, setTotalAmountSpent] = useState(0);
    const [totalAmountMade, setTotalAmountMade] = useState(0);

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

    const handleDeleteBuyTransaction = (transactionId) => {
        axios.post(`http://127.0.0.1:5000/deleteBuyTransaction?transaction_id=${transactionId}`)
            .then((response) => {
                // Remove the deleted transaction from the buyTransactions list
                const updatedBuyTransactions = buyTransactions.filter((transaction) => transaction.transaction_id !== transactionId);
                setBuyTransactions(updatedBuyTransactions);
                console.log('Buy transaction deleted:', response.data);
            })
            .catch((error) => {
                console.error('Error deleting buy transaction:', error);
            });
    };

    const handleDeleteSellTransaction = (receiptId) => {
        axios.post(`http://127.0.0.1:5000/deleteSellTransaction?receipt_id=${receiptId}`)
            .then((response) => {
                // Remove the deleted transaction from the sellTransactions list
                const updatedSellTransactions = sellTransactions.filter((transaction) => transaction.receipt_id !== receiptId);
                setSellTransactions(updatedSellTransactions);
                console.log('Sell transaction deleted:', response.data);
            })
            .catch((error) => {
                console.error('Error deleting sell transaction:', error);
            });
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
                                    <div>
                                        <button onClick={() => handleDeleteBuyTransaction(row.transaction_id)}>
                                            Delete
                                        </button>
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
                                    <div>Basis: ${row.basis}</div>
                                    <div>Sell Date: {row.sell_date}</div>
                                    <div>Notes: {row.notes}</div>
                                    <div>
                                        <button onClick={() => handleDeleteSellTransaction(row.receipt_id)}>
                                            Delete
                                        </button>
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