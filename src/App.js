import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Page/Login/Login';
import Dashboard from './Page/Dashboard/Dashboard';
import Kitap1 from './Page/Kitaplar/Kitap1';
import axios from 'axios';
import NotFound from './Page/NotFound';
import Home from './Page/Home/Home';
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import './index.css'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
const App = () => {  
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
    }
  }, [token]);

  return (
    <>
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/Kitap1" element={<><Navbar /><Kitap1 /><Footer /></>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={token ? <><Navbar /> <Dashboard /> </>: <Navigate to="/login" replace />}
        />
        
      </Routes>
      <ToastContainer />
    </BrowserRouter>
    </>
  );
};

export default App;