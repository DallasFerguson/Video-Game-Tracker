import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Home from './pages/Home/Home'; // Adjust path as needed
import Search from './pages/Search/Search'; // Adjust path as needed
import GameDetail from './pages/Games/GameDetail/GameDetail'; // Adjust path as needed

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/game/:id" element={<GameDetail />} />
            {/* No library or wishlist routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
