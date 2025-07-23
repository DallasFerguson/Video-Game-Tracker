// index.js with proper CSS loading order
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// First load general CSS
import './index.css';

// Then load fonts
import './assets/fonts/fonts.css';

// Then load variables and animations (order matters)
import './assets/styles/variables.css';
import './assets/styles/animations.css';

// Add debugging styles to make sure content is visible
const debugStyles = document.createElement('style');
debugStyles.innerHTML = `
  body {
    background-color: #f8f8f8 !important;
    color: #333 !important;
  }
  
  .App, .home-page, .search-page, .trending-page, .game-detail, .reviews-page {
    background-color: #f8f8f8 !important;
    color: #333 !important;
  }
  
  /* Override any before/after pseudo-elements that might add dark backgrounds */
  .home-page::before, .search-page::before, .trending-page::before, 
  .game-detail::before, .reviews-page::before,
  .home-page::after, .search-page::after, .trending-page::after, 
  .game-detail::after, .reviews-page::after {
    background: none !important;
  }
`;
document.head.appendChild(debugStyles);

console.log('Starting to render app...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App rendering complete');
