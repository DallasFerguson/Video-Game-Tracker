// App.js or main router file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Search from './pages/Games/Search/Search';
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
