import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Zodiac from './pages/Zodiac/Zodiac';
import Forecast from './pages/Forecast/Forecast';
import GetToKnow from './pages/GetToKnow/GetToKnow';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/zodiac" element={<Zodiac />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/get-to-know" element={<GetToKnow />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}