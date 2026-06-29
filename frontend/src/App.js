import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import CrimeMap from './pages/CrimeMap';
import Charts from './pages/Charts';
import Prediction from './pages/Prediction';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/map" element={<CrimeMap />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;