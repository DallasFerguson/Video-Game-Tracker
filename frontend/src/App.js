// App.js or main router file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import GameDetail from './pages/Games/GameDetail/GameDetail';
// Remove import statements for Library, Wishlist, and Review components

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Search />} /> {/* Optional trending route */}
            <Route path="/game/:id" element={<GameDetail />} />
            {/* Remove Library, Wishlist, and Review routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
