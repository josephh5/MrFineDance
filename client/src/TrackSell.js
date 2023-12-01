// TrackSell.js
import React, { useState } from 'react';
import NavbarLoggedIn from './NavbarLoggedIn';
import axios from 'axios';
import './TrackBuy.css'; // Make sure to create TrackSell.css for styling

const TrackSell = () => {
  const [activeTab, setActiveTab] = useState('TrackSell');
  const [shares, setShares] = useState('');
  const [basis, setBasis] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockName, setStockName] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDate, setSellDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const formattedDate = sellDate instanceof Date ? sellDate.toISOString().split('T')[0] : '';

    axios.post('http://127.0.0.1:5000/TrackSell', {
    shares: shares,
    basis: basis,
    stockSymbol: stockSymbol,
    stockName: stockName,
    sellPrice: sellPrice,
    sellDate: formattedDate,
    notes: notes,
  })
    clearInputFields();
  };

  const clearInputFields = () => {
    setShares('');
    setBasis('');
    setStockSymbol('');
    setStockName('');
    setSellPrice('');
    setSellDate('');
    setNotes('');
  };

  // Function to handle tab selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="track-sell-container">
      <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
      <div>
        <h2>Track Sell</h2>
        <div>
          {/* Input fields for tracking sell */}
          <label>
            Shares:
            <input type="text" value={shares} onChange={(e) => setShares(e.target.value)} />
          </label>
          <label>
            Basis:
            <input type="text" value={basis} onChange={(e) => setBasis(e.target.value)} />
          </label>
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

          {/* Save button */}
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default TrackSell;
