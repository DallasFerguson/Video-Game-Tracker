import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // Update path if needed

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">GameTracker</Link>
        
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            {/* Remove Library and Wishlist links */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
