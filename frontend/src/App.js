import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Home from './pages/Home/Home';
import Search from './pages/Games/Search/Search';
import GameDetail from './pages/Games/GameDetail/GameDetail';
import Library from './pages/Library/Library';
import Wishlist from './pages/Wishlist/Wishlist';
import { LibraryProvider } from './contexts/LibraryContext'; // Make sure this is imported

function App() {
  return (
    <Router>
      <LibraryProvider> {/* Add this back */}
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/library" element={<Library />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
        </div>
      </LibraryProvider> {/* Add this back */}
    </Router>
  );
}

export default App;
