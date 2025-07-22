// GameDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameDetails } from '../../../api/games';
import './GameDetail.css';

const GameDetail = () => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(id);
        setGame(gameData);
        setError(null);
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError("Failed to load game details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  // Function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to safely get the cover image URL
  const getCoverUrl = (cover) => {
    if (!cover || !cover.image_id) {
      return 'https://via.placeholder.com/200x280?text=No+Cover';
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  };

  // Function to safely get screenshot URLs
  const getScreenshotUrl = (screenshot) => {
    if (!screenshot || !screenshot.image_id) {
      return 'https://via.placeholder.com/640x360?text=No+Screenshot';
    }
    return `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`;
  };

  if (loading) {
    return (
      <div className="game-detail loading">
        <div className="container">
          <h2>Loading game details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-detail error">
        <div className="container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail not-found">
        <div className="container">
          <h2>Game Not Found</h2>
          <p>The game you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="game-detail">
      <div className="container">
        <div className="game-header">
          <h1>{game.name || 'Unknown Game'}</h1>
          <div className="game-meta">
            <span className="release-date">
              Released: {formatDate(game.first_release_date)}
            </span>
            {game.rating && (
              <span className="rating">
                Rating: {Math.round(game.rating)}%
              </span>
            )}
          </div>
        </div>

        <div className="game-content">
          <div className="game-cover">
            <img 
              src={getCoverUrl(game.cover)} 
              alt={game.name || 'Game cover'} 
              className="cover-image" 
              style={{ maxWidth: '200px', height: 'auto' }} // Smaller cover image
            />
          </div>

          <div className="game-info">
            <div className="game-summary">
              <h3>Summary</h3>
              <p>{game.summary || 'No summary available for this game.'}</p>
            </div>

            <div className="game-details">
              <div className="genres">
                <h3>Genres</h3>
                {game.genres && game.genres.length > 0 ? (
                  <ul>
                    {game.genres.map((genre, index) => (
                      <li key={index}>{genre.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No genres available</p>
                )}
              </div>

              <div className="platforms">
                <h3>Platforms</h3>
                {game.platforms && game.platforms.length > 0 ? (
                  <ul>
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

        <div className="game-screenshots">
          <h3>Screenshots</h3>
          <div className="screenshot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {game.screenshots && game.screenshots.length > 0 ? (
              game.screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot">
                  <img 
                    src={getScreenshotUrl(screenshot)} 
                    alt={`Screenshot ${index + 1}`}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} // Smaller screenshots
                  />
                </div>
              ))
            ) : (
              <p>No screenshots available</p>
            )}
          </div>
        </div>

        <div className="navigation">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
