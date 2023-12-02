import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarLoggedIn from './NavbarLoggedIn';
import { Chart } from 'chart.js/auto';
import './SearchStock.css';


function SearchStockLoggedIn() {
  const [activeTab, setActiveTab] = useState(/* initial active tab value */);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [stockValue, setStockValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [historicalData, setHistoricalData] = useState({});

  const handleTabChange = (tab) => {
      setActiveTab(tab);
  };

  const fetchHistoricalData = async () => {
      try {
          const response = await axios.get(`http://127.0.0.1:5000/getHistoricalData?symbol=${searchSymbol}`);
          setHistoricalData(response.data);
      } catch (error) {
          console.error('Error fetching historical data:', error);
      }
  };

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/SearchStock', { symbol: searchSymbol });

            const stockValueFromServer = response.data.stockValue;
            setStockValue(stockValueFromServer);
            setErrorMessage('');

            if (searchSymbol !== '') {
                fetchHistoricalData();
            }
        } catch (error) {
            console.error('Error searching stock:', error);

            if (error.response && error.response.status === 404) {
                setErrorMessage('Stock not found. Please try again.');
            } else {
                setErrorMessage('An error occurred while searching for the stock. Please try again later.');
            }

            setStockValue(null);
            setHistoricalData({});
        }
    };

    useEffect(() => {
        if (historicalData.timestamp && historicalData.indicators) {
            const ctx = document.getElementById('stockChart').getContext('2d');
            const stockChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historicalData.timestamp,
                    datasets: [
                        {
                            label: 'Closing Price',
                            data: historicalData.indicators.quote.map((entry) => entry.close),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                        },
                    ],
                },
                options: {
                    responsive: false, // Fixed size
                    maintainAspectRatio: false, // Fixed size
                },
            });

            return () => {
                stockChart.destroy();
            };
        }
    }, [historicalData]);

  return (
    <div className="track-sell-container">
      <NavbarLoggedIn activeTab={activeTab} handleTabChange={handleTabChange} />
          {/* Search bar */}
          <div className="search-container">
              <label htmlFor="searchSymbol">Search Stock Symbol:</label>
              <input
                  type="text"
                  id="searchSymbol"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>

              {/* Error message */}
              {errorMessage && (
                  <div className="error-message-container">
                      <p>{errorMessage}</p>
                  </div>
              )}
          </div>

          {/* Stock value */}
          {stockValue && !errorMessage && (
              <div className="search-stock-container">
                  <div className="stock-value-container">
                      <p>Stock Symbol: {stockValue.stock_symbol}</p>
                      <p>Current Price: {stockValue.current_price}</p>
                      <p>DateTime of Price: {stockValue.datetime_of_price}</p>
                  </div>

                  {/* Historical data graph */}
                  {historicalData.timestamp && historicalData.indicators && (
                      <div className="graph-container">
                          <p><strong>Closing Price of {stockValue.stock_symbol} from the past two years:</strong></p>
                          <canvas id="stockChart" width="600" height="300"></canvas>
                      </div>
                  )}

                  {/* No historical data for stock */}
                  {(!historicalData.timestamp || !historicalData.indicators) && (
                      <div className="graph-container">
                          <p><strong>Closing Price of {stockValue.stock_symbol} from the past two years:</strong></p>
                          <p style={{ color: 'red' }}><strong>No historical data found.</strong></p>
                      </div>
                  )}
              </div>
          )}
    </div>
  );
}

export default SearchStockLoggedIn;


