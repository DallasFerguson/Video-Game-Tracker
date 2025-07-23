import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // You'll need to create this CSS file too

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">GameTracker</Link>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            {/* No library or wishlist links */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
