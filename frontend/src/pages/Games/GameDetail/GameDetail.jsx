// GameDetail.jsx - Without library/wishlist buttons
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameDetails } from '../../../api/games';
import Button from '../../../components/ui/Button/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
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
      return 'https://via.placeholder.com/264x374?text=No+Cover';
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  };

  // Function to safely get screenshot URLs
  const getScreenshotUrl = (screenshot) => {
    if (!screenshot || !screenshot.image_id) {
      return 'https://via.placeholder.com/1280x720?text=No+Screenshot';
    }
    return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot.image_id}.jpg`;
  };

  if (loading) {
    return (
      <div className="game-detail loading" style={{ textAlign: 'center', padding: '40px' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '20px' }}>Loading game details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-detail error" style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#fff0f0',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '40px auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#e3350d' }}>Error</h2>
        <p>{error}</p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail not-found" style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#f8f8f8',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '40px auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Game Not Found</h2>
        <p>The game you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="game-detail" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f8f8f8',
      color: '#333'
    }}>
      <div className="game-header" style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#2a75bb' }}>
          {game.name || 'Unknown Game'}
        </h1>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            flex: '0 0 300px',
            height: '450px',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <img 
              src={getCoverUrl(game.cover)} 
              alt={game.name || 'Game cover'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <div style={{ flex: '1' }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              <span style={{ 
                padding: '8px 12px',
                backgroundColor: '#f0f4f8',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                Released: {formatDate(game.first_release_date)}
              </span>
              
              {game.rating && (
                <span style={{ 
                  padding: '8px 12px',
                  backgroundColor: '#fff8e0',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  Rating: {Math.round(game.rating)}%
                </span>
              )}
            </div>
            
            <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              <h3 style={{ marginBottom: '10px', color: '#2a75bb' }}>Summary</h3>
              <p>{game.summary || 'No summary available for this game.'}</p>
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <h3 style={{ marginBottom: '10px', color: '#2a75bb' }}>Genres</h3>
                {game.genres && game.genres.length > 0 ? (
                  <ul style={{ 
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {game.genres.map((genre, index) => (
                      <li key={index} style={{
                        padding: '4px 8px',
                        backgroundColor: '#f0f4f8',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}>
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No genres available</p>
                )}
              </div>
              
              <div>
                <h3 style={{ marginBottom: '10px', color: '#2a75bb' }}>Platforms</h3>
                {game.platforms && game.platforms.length > 0 ? (
                  <ul style={{ 
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {game.platforms.map((platform, index) => (
                      <li key={index} style={{
                        padding: '4px 8px',
                        backgroundColor: '#f0f4f8',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}>
                        {platform.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No platforms available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {game.screenshots && game.screenshots.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            marginBottom: '20px', 
            borderBottom: '2px solid #eaeaea',
            paddingBottom: '10px',
            color: '#2a75bb'
          }}>
            Screenshots
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {game.screenshots.map((screenshot, index) => (
              <div key={index} style={{ 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                <img 
                  src={getScreenshotUrl(screenshot)} 
                  alt={`Screenshot ${index + 1}`}
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default GameDetail;
