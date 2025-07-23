// src/components/Header/header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  // Add debugging styles to ensure header is visible
  const headerStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  };

  const navStyle = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const navItemStyle = {
    marginLeft: '1.5rem'
  };

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s'
  };

  return (
    <header className="header" style={headerStyle}>
      <div className="container" style={containerStyle}>
        <Link to="/" className="logo" style={logoStyle}>GameTracker</Link>
        
        <nav className="nav">
          <ul style={navStyle}>
            <li style={navItemStyle}><Link to="/" style={navLinkStyle}>Home</Link></li>
            <li style={navItemStyle}><Link to="/search" style={navLinkStyle}>Search</Link></li>
            <li style={navItemStyle}><Link to="/trending" style={navLinkStyle}>Trending</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
