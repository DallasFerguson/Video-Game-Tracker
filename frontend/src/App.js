// App.js with all necessary context providers
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Home from './pages/Home/Home';
import Search from './pages/Games/Search/Search';
import GameDetail from './pages/Games/GameDetail/GameDetail';
import Trending from './pages/Games/Trending/Trending';

// Import context providers
import { LibraryProvider } from './contexts/LibraryContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

import './App.css';

function App() {
  // Add logging to check if component is rendering
  console.log('App component rendering');

  // Add debugging styles to ensure content is visible
  useEffect(() => {
    // Force light colors for debugging
    document.body.style.backgroundColor = '#f8f8f8';
    document.body.style.color = '#333';
    console.log('Applied light theme styles');
  }, []);

  return (
    // Wrap the entire application with all necessary providers
    <ThemeProvider>
      <NotificationProvider>
        <LibraryProvider>
          <WishlistProvider>
            <ReviewProvider>
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
            </ReviewProvider>
          </WishlistProvider>
        </LibraryProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
