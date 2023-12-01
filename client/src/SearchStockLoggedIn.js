import React, { useState } from 'react';
import axios from 'axios';
import NavbarLoggedIn from './NavbarLoggedIn';

function SearchStockLoggedIn() {
  const [activeTab, setActiveTab] = useState(/* initial active tab value */);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [stockValue, setStockValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/SearchStock', { symbol: searchSymbol });

      // Assuming the backend returns the stock value in the response
      const stockValueFromServer = response.data.stockValue;

      // Update state with stock information
      setStockValue(stockValueFromServer);
      setErrorMessage('');
    } catch (error) {
      console.error('Error searching stock:', error);

      // Handle any errors, e.g., display an error message to the user
      if (error.response && error.response.status === 404) {
        setErrorMessage('Stock not found. Please try again.');
      } else {
        setErrorMessage('An error occurred while searching for the stock. Please try again later.');
      }

      // Clear the stock value in case there was a previous successful search
      setStockValue(null);
    }
  };

  return (
    <div className="track-sell-container">
      <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
      <div className="search-container">
        <label htmlFor="searchSymbol">Search Stock Symbol:</label>
        <input
          type="text"
          id="searchSymbol"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {errorMessage && (
        <div className="error-message-container">
          <p>{errorMessage}</p>
        </div>
      )}
      {stockValue && !errorMessage && (
        <div className="stock-value-container">
          <p>Stock Symbol: {stockValue.stock_symbol}</p>
          <p>Current Price: {stockValue.current_price}</p>
          <p>DateTime of Price: {stockValue.datetime_of_price}</p>
        </div>
      )}
      {/* Other components/content */}
    </div>
  );
}

export default SearchStockLoggedIn;


