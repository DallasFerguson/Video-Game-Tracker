// App.js with debugging styles to fix black screen
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Home from './pages/Home/Home';
import Search from './pages/Games/Search/Search';
import GameDetail from './pages/Games/GameDetail/GameDetail';
import Trending from './pages/Games/Trending/Trending';
import './App.css';

function App() {
  // Add logging to check if component is rendering
  console.log('App component rendering');

  // Add debugging styles to ensure content is visible
  useEffect(() => {
    // Force light colors for debugging
    document.body.style.backgroundColor = '#f8f8f8';
    document.body.style.color = '#333';
  }, []);

  return (
    <Router>
      <div className="App" style={{ backgroundColor: '#f8f8f8', color: '#333', minHeight: '100vh' }}>
        <Header />
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
