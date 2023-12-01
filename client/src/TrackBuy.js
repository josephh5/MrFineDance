import React, { useState } from 'react';
import axios from 'axios';
import NavbarLoggedIn from './NavbarLoggedIn';
import './TrackBuy.css';
const TrackBuy = () => {
  const [activeTab, setActiveTab] = useState('TrackBuy');
  const [shares, setShares] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockName, setStockName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyDate, setBuyDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const [logs, setLogs] = useState([]);

  const handleSave = () => {
    const formattedDate = buyDate instanceof Date ? buyDate.toISOString().split('T')[0] : '';

    axios.post('http://127.0.0.1:5000/TrackBuy', {
    shares: shares,
    stockSymbol: stockSymbol,
    stockName: stockName,
    buyPrice: buyPrice,
    buyDate: formattedDate,
    notes: notes,
  })
    // Clear input fields after saving
    clearInputFields();
  };

  const handleEdit = (index) => {
    // For now, let's just log the index of the log being edited
    console.log('Edit log with index:', index);
  };

  const handleDelete = (index) => {
    // Remove the log from the logs array
    const updatedLogs = [...logs];
    updatedLogs.splice(index, 1);
    setLogs(updatedLogs);
  };

  const clearInputFields = () => {
    setShares('');
    setStockSymbol('');
    setStockName('');
    setBuyPrice('');
    setBuyDate('');
    setNotes('');
  };
  // Function to handle tab selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
};

  return (
    
    <div className="track-buy-container">
      <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
    <div>
      <h2>Track Buy</h2>
      <div>
        {/* Input fields for tracking buy */}
        <label>
          Shares:
          <input type="text" value={shares} onChange={(e) => setShares(e.target.value)} />
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
          Buy Price:
          <input type="text" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
        </label>
        <label>
          Buy Date:
          <input
            type="date"
            value={buyDate instanceof Date ? buyDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setBuyDate(new Date(e.target.value))}
          />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        {/* Save button */}
        <button onClick={handleSave}>Save</button>
      </div>

      <div>
        {/* Display logs with edit and delete buttons */}
        {logs.map((log, index) => (
          <div key={index}>
            <span>{log.transactionId}</span>
            {/* Display other log details */}
            {/* ... */}
            {/* Edit and delete buttons */}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default TrackBuy;
