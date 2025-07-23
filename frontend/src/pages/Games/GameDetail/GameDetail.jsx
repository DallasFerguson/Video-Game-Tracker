// GameDetail.jsx - Keeping the updated version with improved layout from before
// but removing any wishlist, library, or review functionality
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameDetails } from '../../../api/games';

const GameDetail = () => {
  // ... keep the state, effects, and helper functions from previous version ...

  // Custom styles for better layout (keeping these from before)
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };
  
  // ... keep other styles from previous version ...

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2>Loading game details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" style={{ display: 'inline-block', margin: '20px 0', padding: '10px 15px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Home</Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={containerStyle}>
        <h2>Game Not Found</h2>
        <p>The game you're looking for doesn't exist or has been removed.</p>
        <Link to="/" style={{ display: 'inline-block', margin: '20px 0', padding: '10px 15px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={gameHeaderStyle}>
        <h1 style={{ marginBottom: '10px' }}>{game.name || 'Unknown Game'}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#666' }}>
          <span>
            Released: {formatDate(game.first_release_date)}
          </span>
          {game.rating && (
            <span>
              Rating: {Math.round(game.rating)}%
            </span>
          )}
        </div>
      </div>

      <div style={gameContentStyle}>
        <div style={gameCoverStyle}>
          <img 
            src={getCoverUrl(game.cover)} 
            alt={game.name || 'Game cover'} 
            style={coverImageStyle} 
          />
        </div>

        <div style={gameInfoStyle}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Summary</h3>
            <p>{game.summary || 'No summary available for this game.'}</p>
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '10px' }}>Genres</h3>
              {game.genres && game.genres.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {game.genres.map((genre, index) => (
                    <li key={index}>{genre.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No genres available</p>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '10px' }}>Platforms</h3>
              {game.platforms && game.platforms.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {game.platforms.map((platform, index) => (
                    <li key={index}>{platform.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No platforms available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '10px' }}>Screenshots</h3>
        <div style={screenshotGridStyle}>
          {game.screenshots && game.screenshots.length > 0 ? (
            game.screenshots.map((screenshot, index) => (
              <div key={index}>
                <img 
                  src={getScreenshotUrl(screenshot)} 
                  alt={`Screenshot ${index + 1}`}
                  style={screenshotStyle} 
                />
              </div>
            ))
          ) : (
            <p>No screenshots available</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ display: 'inline-block', padding: '10px 15px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Home</Link>
      </div>
    </div>
  );
};

export default GameDetail;
