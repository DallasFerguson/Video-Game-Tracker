import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import your components (paths may vary)
import Header from './components/YourHeaderComponent';
import Home from './pages/Home';
import Search from './pages/Search';
import GameDetail from './pages/Games/GameDetail';

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
            {/* REMOVED: Library, Wishlist, and Review routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
