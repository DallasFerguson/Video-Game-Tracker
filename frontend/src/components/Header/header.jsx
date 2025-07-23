import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">GameTracker</Link>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            {/* Remove these links:
            <li><Link to="/library">Library</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
