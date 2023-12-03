// TrackSell.js
import React, { useState } from 'react';
import NavbarLoggedIn from './NavbarLoggedIn';
import axios from 'axios';
import './TrackBuy.css';

const TrackSell = () => {
    const [activeTab, setActiveTab] = useState('TrackSell');
    const [basisInputType, setBasisInputType] = useState('byNumber'); // Track basis by number or date
    const [shares, setShares] = useState('');
    const [basisByNumber, setBasisByNumber] = useState('');
    const [basisByDate, setBasisByDate] = useState('');
    const [stockSymbol, setStockSymbol] = useState('');
    const [stockName, setStockName] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [sellDate, setSellDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        const formattedSellDate = sellDate instanceof Date ? sellDate.toISOString().split('T')[0] : '';
        const formattedBuyDate = basisByDate instanceof Date ? basisByDate.toISOString().split('T')[0] : '';

        axios
            .post('http://127.0.0.1:5000/TrackSell', {
                shares: shares,
                basis: basisByNumber,
                stockSymbol: stockSymbol,
                stockName: stockName,
                sellPrice: sellPrice,
                sellDate: formattedSellDate,
                buyDate: formattedBuyDate,
                notes: notes,
            })
            .then(() => {
                clearInputFields();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const clearInputFields = () => {
        setShares('');
        setBasisByNumber('');
        setBasisByDate('');
        setStockSymbol('');
        setStockName('');
        setSellPrice('');
        setSellDate('');
        setNotes('');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="track-sell-container">
            <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
            <div>
                <h2>Track Sell</h2>
                <div>
                    <label>
                        Shares:
                        <input type="text" value={shares} onChange={(e) => setShares(e.target.value)} />
                    </label>
                    <div style={{ display: 'flex' }}>
                        {basisInputType === 'byNumber' ? ( // Render basis input based on the selected type
                            <label>
                                Basis:
                                <input
                                    type="text"
                                    value={basisByNumber}
                                    onChange={(e) => setBasisByNumber(e.target.value)}
                                />
                            </label>
                        ) : (
                            <label>
                                Basis:
                                <input
                                    type="date"
                                    value={basisByDate instanceof Date ? basisByDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setBasisByDate(new Date(e.target.value))}
                                />
                            </label>
                        )}
                        {/* Dropdown menu for selecting basis input type */}
                        <label style={{ marginLeft: '30px', marginTop: '9px' }}>
                            Basis Input Type:
                            <select value={basisInputType} onChange={(e) => setBasisInputType(e.target.value)}>
                                <option value="byNumber">By Number</option>
                                <option value="byDate">By Date</option>
                            </select>
                        </label>
                    </div>
                    <label>
                        Stock Symbol:
                        <input type="text" value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} />
                    </label>
                    <label>
                        Stock Name:
                        <input type="text" value={stockName} onChange={(e) => setStockName(e.target.value)} />
                    </label>
                    <label>
                        Sell Price:
                        <input type="text" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                    </label>
                    <label>
                        Sell Date:
                        <input
                            type="date"
                            value={sellDate instanceof Date ? sellDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setSellDate(new Date(e.target.value))}
                        />
                    </label>

                    <label>
                        Notes:
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </label>

                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default TrackSell;
