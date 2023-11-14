// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Note the use of Routes and Route
//import './App.css';
import Home from './Home';
import HomeLoggedIn from './HomeLoggedIn';
import TransactionLog from './TransactionLog';
import ViewStocks from './ViewStocks';
import AccountPage from './AccountPage';
import Login from './Login';
import SignUp from './SignUp';
import TrackBuy from './TrackBuy';
import TrackSell from './TrackSell';
import ForgotPassword from './ForgotPassword'
import SearchStock from './SearchStock'
import SearchStockLoggedIn from './SearchStockLoggedIn'

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/HomeLoggedIn" element={<HomeLoggedIn /> } />
                    <Route path="/ViewStocks" element={<ViewStocks />} />
                    <Route path="/TransactionLog" element={<TransactionLog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/Account" element={<AccountPage />} />
                    {/* <Route path="./NavBar" element={<NavBar />} /> */}
                    <Route path="/TrackBuy" element={<TrackBuy />} />
                    <Route path="/TrackSell" element={<TrackSell />} />
                    <Route path="/ForgotPassword" element={<ForgotPassword />} />
                    <Route path="/SearchStock" element={<SearchStock />} />
                    <Route path="/SearchStockLoggedIn" element={<SearchStockLoggedIn />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;