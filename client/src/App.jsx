import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonationForm from './components/DonationForm';
import AddDonationRequest from './components/AddDonationRequest';
import NearbyRequests from './components/NearbyRequests';
function App() {

  return (
    <div>
      <Navbar></Navbar>

      <div className="flex-grow mt-14">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/form" element={<DonationForm />} />
              <Route path="/donate" element={<AddDonationRequest />} />
              <Route path="/requests" element={<NearbyRequests />} />
              <Route path="/admin" element={<div>Admin Panel</div>} />
            </Routes>
      </div>

      <footer style={{ backgroundColor: '#1976d2', padding: '10px', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">
          © 2025 Technotriples - All Rights Reserved
        </Typography>
      </footer>
    </div>
  );
}

export default App;